#!/usr/bin/env python3
"""Chabels Dynasty — WIN-NOW power rankings -> data/power.json.

One board, one score per team. The score blends three inputs:

  ROSTER  — the value of the best starting lineup you can field at PG/SG/G/
            SF/PF/F/C/UTIL x3, plus discounted bench depth. Player value comes
            from Hashtag's 2026-27 points-league PROJECTIONS scored with the
            league's own rules (data/rankings-season.json). No dynasty value,
            no age curve, no draft picks — "how good is this team this season".

  HISTORY — the manager's track record: recency-weighted regular-season win %
            over the seasons we have, plus credit for title-game trips
            (data/history.json). The preseason anchor.

  RESULTS — once games are played: all-play win %, real win %, points-per-game
            index and last-3 form (from data/scores.json + data/standings.json).

  weights — preseason is 50% ROSTER / 50% HISTORY. As games are played RESULTS
            ramps in (cap 0.65) and HISTORY fades toward ~4%.

Each team gets a one-line take. If ANTHROPIC_API_KEY is set the takes are
written by Claude in the league's honest-with-bite voice; otherwise a plain
rule-built line is used. Blurbs are cached in the previous data/power.json and
only regenerated when a team's rank, roster or the results weight moved.

  python3 tools/power.py
"""
import datetime
import json
import math
import os
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"


def load(name, default=None):
    p = DATA / f"{name}.json"
    try:
        return json.loads(p.read_text())
    except Exception:
        return default


# ---------------------------------------------------------------- name matching

def _norm(s):
    s = (s or "").lower().strip()
    s = "".join(c for c in __import__("unicodedata").normalize("NFD", s)
                if __import__("unicodedata").category(c) != "Mn")
    return re.sub(r"\s+", " ", s)


def _strip_suffix(s):
    return re.sub(r"\s+(jr\.?|sr\.?|ii|iii|iv|v)$", "", s).strip()


def season_rank_lookup(season_db):
    exact, loose = {}, {}
    for row in season_db:
        n = _norm(row["name"])
        exact[n] = row
        loose.setdefault(_strip_suffix(n), row)
    def find(name):
        n = _norm(name)
        return exact.get(n) or loose.get(_strip_suffix(n))
    return find


# --------------------------------------------------------------- player value

def value_of(rank):
    """Season rank -> 0..100 win-now value. Steep at the top: a top-12 player is
    worth roughly double a top-60 one."""
    if not rank:
        return 3.0
    return round(100.0 * math.exp(-(rank - 1) / 55.0) + 4.0 * math.exp(-(rank - 1) / 400.0), 2)


# -------------------------------------------------------------- best lineup

# roster_positions -> the starting slots we fill (bench/IR ignored)
STARTER_SLOTS_DEFAULT = ["PG", "SG", "G", "SF", "PF", "F", "C", "UTIL", "UTIL", "UTIL"]
SLOT_ELIGIBLE = {
    "PG": {"PG"}, "SG": {"SG"}, "SF": {"SF"}, "PF": {"PF"}, "C": {"C"},
    "G": {"PG", "SG"}, "F": {"SF", "PF"},
    "GF": {"PG", "SG", "SF", "PF"}, "FC": {"SF", "PF", "C"},
    "UTIL": {"PG", "SG", "SF", "PF", "C"},
}
# fill most-constrained slots first so a scarce position isn't burned on UTIL
SLOT_ORDER = ["C", "PG", "SG", "SF", "PF", "G", "F", "FC", "GF", "UTIL"]


def best_lineup(players, slots):
    """players: [{name, value, positions:[...]}] . Greedy: for each slot (scarce
    first), take the highest-value unused eligible player."""
    order = [s for s in SLOT_ORDER for _ in range(slots.count(s))]
    used = set()
    lineup = []
    pool = sorted(range(len(players)), key=lambda i: -players[i]["value"])
    for slot in order:
        elig = SLOT_ELIGIBLE.get(slot, {slot})
        pick = next((i for i in pool
                     if i not in used and (set(players[i]["positions"]) & elig or not players[i]["positions"] and slot == "UTIL")),
                    None)
        if pick is None:
            lineup.append({"slot": slot, "name": None, "rank": None, "value": 0.0})
        else:
            used.add(pick)
            p = players[pick]
            lineup.append({"slot": slot, "name": p["name"], "rank": p.get("rank"), "value": p["value"]})
    bench = sorted((players[i] for i in range(len(players)) if i not in used),
                   key=lambda p: -p["value"])
    return lineup, bench


def slot_label(slot):
    return {"G": "guard", "F": "forward", "C": "center", "PG": "point guard",
            "SG": "shooting guard", "SF": "small forward", "PF": "power forward",
            "UTIL": "flex"}.get(slot, slot.lower())


# ----------------------------------------------------------------- results

def results_context(scores, standings):
    """Per-owner: real win%, pf/gm index, all-play%, last-3 form. Empty preseason."""
    weeks = scores.get("weeks") or []
    rows = {r["name"]: r for r in standings.get("rows", [])}
    owners = list(rows)
    gp = round(sum(r["wins"] + r["losses"] for r in rows.values()) / max(1, len(rows)))
    out = {o: {"winpct": 0.5, "pf_pg": 0.0, "allplay": 0.5, "form": 0.5} for o in owners}
    if not weeks:
        return out, 0

    for o in owners:
        r = rows[o]
        g = r["wins"] + r["losses"]
        out[o]["winpct"] = (r["wins"] + 0.5 * r.get("ties", 0)) / g if g else 0.5

    per_owner_scores = {o: [] for o in owners}
    ap_w = {o: 0 for o in owners}
    ap_n = {o: 0 for o in owners}
    for wk in weeks:
        s = wk["scores"]
        present = [o for o in owners if o in s]
        for o in present:
            per_owner_scores[o].append(s[o])
            beat = sum(1 for x in present if x != o and s[o] > s[x])
            tie = sum(1 for x in present if x != o and abs(s[o] - s[x]) < 1e-6)
            ap_w[o] += beat + 0.5 * tie
            ap_n[o] += len(present) - 1

    pf_pg = {o: (sum(v) / len(v) if v else 0.0) for o, v in per_owner_scores.items()}
    mean_pf = sum(pf_pg.values()) / len(pf_pg) if pf_pg else 0.0
    sd_pf = (sum((v - mean_pf) ** 2 for v in pf_pg.values()) / len(pf_pg)) ** 0.5 or 1.0
    for o in owners:
        out[o]["pf_pg"] = round(pf_pg[o], 1)
        out[o]["pf_z"] = (pf_pg[o] - mean_pf) / sd_pf
        out[o]["allplay"] = (ap_w[o] / ap_n[o]) if ap_n[o] else 0.5
        last = per_owner_scores[o][-3:]
        out[o]["form"] = ((sum(last) / len(last)) - mean_pf) / sd_pf if last else 0.0
    return out, gp


def results_score(rc):
    """0..100 from the context row."""
    ap = rc["allplay"] * 100
    wp = rc["winpct"] * 100
    pf = 55 + 13 * rc.get("pf_z", 0)
    fm = 55 + 9 * rc.get("form", 0)
    raw = 0.38 * ap + 0.24 * wp + 0.26 * pf + 0.12 * fm
    return max(5.0, min(98.0, raw))


# --------------------------------------------------------- manager track record

def history_context(history):
    """Per-manager: recency-weighted regular-season win %, finals credit, career
    record over the seasons we have. This is the preseason anchor — a 30-10 team
    every year should not open the board at #7 because the roster looks thin."""
    seasons = [s for s in history.get("seasons", [])
               if s.get("standings") and any(r["wins"] or r["losses"] for r in s["standings"])]
    seasons.sort(key=lambda s: s["season"])
    if not seasons:
        return {}
    # most recent season weighted 3, next 2, the rest 1
    wt = {}
    for i, s in enumerate(reversed(seasons)):
        wt[s["season"]] = max(1, 3 - i)

    out = {}
    for s in seasons:
        yr, champ, ru = s["season"], s.get("champion"), s.get("runner_up")
        for r in s["standings"]:
            n = r["name"]
            g = r["wins"] + r["losses"]
            d = out.setdefault(n, {"num": 0.0, "den": 0.0, "finals": 0.0,
                                   "titles": 0, "runner_ups": 0,
                                   "w": 0, "l": 0, "seasons": 0, "best": 99})
            if g:
                d["num"] += wt[yr] * r["wins"] / g
                d["den"] += wt[yr]
                d["w"] += r["wins"]
                d["l"] += r["losses"]
                d["seasons"] += 1
            if n == champ:
                d["finals"] += 1.0
                d["titles"] += 1
            elif n == ru:
                d["finals"] += 0.5
                d["runner_ups"] += 1
    order = {}
    for s in seasons:
        for i, r in enumerate(sorted(s["standings"], key=lambda x: (-x["wins"], -x.get("pf", 0))), 1):
            order.setdefault(r["name"], []).append(i)
    for n, d in out.items():
        d["wpct"] = d["num"] / d["den"] if d["den"] else 0.5
        d["best"] = min(order.get(n, [99]))
    return out


def history_score(row, mean_wpct):
    """Track-record row -> 0..100 on the power scale."""
    if not row:
        return 50.0
    return max(10.0, min(98.0, 55 + 190 * (row["wpct"] - mean_wpct) + 6 * row["finals"]))


# ------------------------------------------------------------------ AI voice

VOICE = (
    "You write for the Chabels Dynasty League, a 10-team dynasty fantasy "
    "BASKETBALL league. Voice: honest with bite. Praise the top, be blunt about "
    "the bottom, and back every take with something concrete from the data you "
    "are given (a player name, a lineup hole, a record). No hype, no cliches, no "
    "hedging. Use the owner's name."
)


def claude(system, user, max_tokens=1200):
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        return None
    body = json.dumps({
        "model": os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-5"),
        "max_tokens": max_tokens,
        "system": system,
        "messages": [{"role": "user", "content": user}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            d = json.loads(r.read())
        return "".join(b.get("text", "") for b in d.get("content", []))
    except Exception as e:
        print(f"  Claude call failed: {e}")
        return None


def rule_blurb(row, gp):
    lu = sorted((s for s in row["lineup"] if s["name"]), key=lambda s: -s["value"])
    top = ", ".join(s["name"] for s in lu[:2])
    bits = [f"Built around {top}." if top else "No ranked starter to build around."]
    rez, roster = row["history_score"], row["roster_score"]
    thin_by_rez = not gp and row.get("career") and rez - roster > 12
    if row["gaps"]:
        bits.append("Playing a replacement-level starter at " + ", ".join(row["gaps"]) + ".")
    elif row.get("_thin_back"):
        bits.append("Top-heavy — the back of the lineup is where it thins out.")
    elif not thin_by_rez:
        bits.append("Balanced from top to bottom of the starting nine.")

    if gp:
        bits.append(f"{row['record']}, {round(row['_rc']['allplay'] * 100)}% all-play.")
    elif row.get("career"):
        ti, ru = row.get("titles") or 0, row.get("runner_ups") or 0
        if ti:
            hon = f" with {ti} title{'s' if ti != 1 else ''}"
        elif ru:
            hon = f" with {ru} finals trip{'s' if ru != 1 else ''}"
        else:
            hon = ""
        if rez - roster > 12 and roster < 58:
            bits.append(f"The roster reads thin, but a {row['career']} record{hon} says trust the manager.")
        elif rez - roster > 12:
            bits.append(f"Good roster, better résumé — {row['career']}{hon}.")
        elif roster - rez > 12:
            bits.append(f"On paper it's a real roster; the {row['career']} track record is the reason to wait and see.")
        else:
            bits.append(f"{row['career']} across the league's history{hon}.")
    return " ".join(bits)


def write_blurbs(board, gp, prev):
    prev_by_name = {b["name"]: b for b in (prev.get("board") or [])}

    prev_gp = (prev.get("games_per_team") or 0)

    def unchanged(row):
        p = prev_by_name.get(row["name"])
        if not p or not p.get("blurb"):
            return False
        same_line = [s["name"] for s in row["lineup"]] == [s.get("name") for s in p.get("lineup", [])]
        same_rank = p.get("rank") == row["rank"]
        same_phase = (gp == 0) == (prev_gp == 0)
        return same_line and same_rank and same_phase and (gp == 0 or p.get("record") == row["record"])

    stale = [r for r in board if not unchanged(r)]
    if not stale:
        for r in board:
            r["blurb"] = prev_by_name[r["name"]]["blurb"]
        return "cached"

    lines = []
    for r in board:
        lu = ", ".join(f"{s['name']} (#{s['rank']})" if s["rank"] else s["name"]
                       for s in r["lineup"] if s["name"])
        gap = ("; holes: " + ", ".join(r["gaps"])) if r["gaps"] else ""
        rez = (f"; career {r['career']}"
               + (f", {r['titles']} title(s)" if r.get("titles") else "")
               + (f", {r['runner_ups']} finals loss(es)" if r.get("runner_ups") else "")) if r.get("career") else ""
        rec = f"; this season {r['record']}, all-play {round(r['_rc']['allplay'] * 100)}%" if gp else ""
        lines.append(f'#{r["rank"]} {r["name"]} (score {r["score"]}) — starters: {lu}{gap}{rez}{rec}')
    phase = ("Preseason — the board is 50% roster projection, 50% manager track record."
             if not gp else
             f"{gp} games played — the board is now mostly this season's real results, with roster and track record behind it.")
    user = (
        f"Week {board[0].get('_week', 0)}. {phase}\n\n"
        "The board:\n" + "\n".join(lines) +
        "\n\nWrite ONE sentence (max ~30 words) for EACH team, in board order. "
        "Lean on what actually moved them — roster, résumé, or recent results. "
        "Return exactly one line per team as `<owner>: <sentence>` — nothing else."
    )
    out = claude(VOICE, user)
    parsed = {}
    if out:
        for ln in out.splitlines():
            m = re.match(r"\s*(?:#?\d+[.)]?\s*)?([^:]+?):\s*(.+)", ln.strip())
            if m:
                parsed[_norm(m.group(1))] = m.group(2).strip()
    for r in board:
        r["blurb"] = parsed.get(_norm(r["name"])) or rule_blurb(r, gp)
    return "claude" if parsed else "rule"


# --------------------------------------------------------------------- main

def main():
    rosters = (load("rosters") or {}).get("rosters") or []
    standings = load("standings") or {"rows": []}
    scores = load("scores") or {"weeks": []}
    league = load("league") or {}
    meta = load("meta") or {}
    history = load("history") or {"seasons": []}
    season_db = (load("rankings-season") or {}).get("players") or []
    if not rosters or not season_db:
        print("missing rosters or season ranks — run tools/snapshot.py first")
        return 1

    find_rank = season_rank_lookup(season_db)
    slots = [s for s in (league.get("roster_positions") or STARTER_SLOTS_DEFAULT)
             if s not in ("BN", "IR", "TAXI")] or STARTER_SLOTS_DEFAULT

    rc_all, gp = results_context(scores, standings)
    rec_by_name = {r["name"]: f'{r["wins"]}-{r["losses"]}' for r in standings["rows"]}

    hc_all = history_context(history)
    mean_wpct = (sum(h["wpct"] for h in hc_all.values()) / len(hc_all)) if hc_all else 0.5

    rows = []
    for t in rosters:
        players = []
        for p in t["players"]:
            sr = find_rank(p["name"])
            rank = sr["rank"] if sr else None
            players.append({
                "name": p["name"], "rank": rank, "value": value_of(rank),
                "positions": p.get("positions") or ([p["pos"]] if p.get("pos") else []),
            })
        lineup, bench = best_lineup(players, slots)
        # per-slot average so the lineup number isn't just "how many slots"
        lineup_value = sum(s["value"] for s in lineup) / max(1, len(lineup))
        # depth = the next 5 guys, the ones you turn to when a starter is out
        bench_value = sum(b["value"] for b in bench[:5]) / 5.0
        # lineup ~75%, bench depth ~25%
        roster_raw = 0.75 * lineup_value + 0.25 * bench_value

        gaps = []
        for s in lineup:
            if s["name"] is None or s["rank"] is None or s["rank"] > 115:
                lab = slot_label(s["slot"])
                if lab not in gaps:
                    gaps.append(lab)
        starter_ranks = sorted((s["rank"] or 400) for s in lineup)
        # top-heavy = only two or three real difference-makers, then a cliff
        thin_back = len(starter_ranks) >= 4 and starter_ranks[3] > 45

        rc = rc_all.get(t["name"], {"allplay": 0.5, "winpct": 0.5})
        hc = hc_all.get(t["name"])
        career = f'{hc["w"]}-{hc["l"]}' if hc and hc["seasons"] else None
        rows.append({
            "roster_id": t["roster_id"], "name": t["name"], "handle": t.get("handle", ""),
            "record": rec_by_name.get(t["name"], "0-0"),
            "career": career,
            "titles": (hc["titles"] if hc else 0),
            "runner_ups": (hc["runner_ups"] if hc else 0),
            "_raw": roster_raw, "_rc": rc, "_hc": hc, "_thin_back": thin_back,
            "lineup": lineup,
            "bench_top": [b["name"] for b in bench[:4] if b["value"] > 6],
            "gaps": gaps[:3],
        })

    # roster score: z-score the raw onto a power-ranking scale
    raws = [r["_raw"] for r in rows]
    mean = sum(raws) / len(raws)
    sd = (sum((x - mean) ** 2 for x in raws) / len(raws)) ** 0.5 or 1.0
    for r in rows:
        r["roster_score"] = round(max(14.0, min(98.0, 61 + 15 * (r["_raw"] - mean) / sd)), 1)
        r["history_score"] = round(history_score(r["_hc"], mean_wpct), 1)

    # three inputs: roster projection (R), manager track record (H), this
    # season's real results (C). Preseason it's a 50/50 R/H split; as games are
    # played C ramps in (cap 0.65) and the history anchor fades toward ~4%.
    w_c = min(0.65, 0.055 * gp)
    rem = 1.0 - w_c
    w_h = rem * max(0.12, 0.5 - 0.025 * gp)
    w_r = rem - w_h
    for r in rows:
        rs = round(results_score(r["_rc"]), 1) if gp else None
        r["results_score"] = rs
        c = rs if rs is not None else r["roster_score"]
        r["weights"] = {"roster": round(w_r, 3), "history": round(w_h, 3), "results": round(w_c, 3)}
        r["score"] = round(w_r * r["roster_score"] + w_h * r["history_score"] + w_c * c, 1)

    rows.sort(key=lambda r: -r["score"])
    prev = load("power") or {}
    prev_rank = {b["name"]: b["rank"] for b in (prev.get("board") or [])}
    for i, r in enumerate(rows, 1):
        r["rank"] = i
        r["movement"] = (prev_rank.get(r["name"]) - i) if r["name"] in prev_rank else 0
        r["_week"] = meta.get("current_week", 0)

    src = write_blurbs(rows, gp, prev)
    print(f"blurbs: {src}  |  games/team {gp}  weights R{w_r:.2f} H{w_h:.2f} C{w_c:.2f}")

    for r in rows:
        for k in ("_raw", "_rc", "_hc", "_week", "_thin_back"):
            r.pop(k, None)

    out = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "season": meta.get("current_season"), "week": meta.get("current_week"),
        "status": meta.get("league_status"),
        "games_per_team": gp,
        "weights": {"roster": round(w_r, 3), "history": round(w_h, 3), "results": round(w_c, 3)},
        "as_of": (load("rankings-season") or {}).get("as_of", ""),
        "model": "win-now: best-lineup roster projection + manager track record, "
                 "with this season's real results ramping in as games are played",
        "board": rows,
    }
    (DATA / "power.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print("wrote data/power.json —", " ".join(f'{r["rank"]}.{r["name"]}({r["score"]})' for r in rows))
    return 0


if __name__ == "__main__":
    sys.exit(main())
