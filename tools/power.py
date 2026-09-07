#!/usr/bin/env python3
"""Chabels Dynasty — WIN-NOW power rankings -> data/power.json.

One board, one score per team. The score blends:

  ROSTER  — the value of the best starting lineup you can field at PG/SG/G/
            SF/PF/F/C/UTIL x3, plus discounted bench depth. Player value comes
            from Hashtag's current-season points-league rank (data/rankings-
            season.json). No dynasty value, no age curve, no draft picks —
            this is "how good is this team this season".

  RESULTS — once games are played: all-play win %, real win %, points-per-game
            index and last-3 form (from data/scores.json + data/standings.json).

  weight  — results start at 0 (preseason = pure roster board) and ramp to a
            0.72 cap by ~week 12.

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
    if row["gaps"]:
        bits.append("Playing a replacement-level starter at " + ", ".join(row["gaps"]) + ".")
    elif row.get("_thin_back"):
        bits.append("Top-heavy — the back of the lineup is where it thins out.")
    else:
        bits.append("Balanced from top to bottom of the starting nine.")
    if gp:
        bits.append(f"{row['record']}, {round(row['_rc']['allplay'] * 100)}% all-play.")
    return " ".join(bits)


def write_blurbs(board, gp, prev):
    prev_by_name = {b["name"]: b for b in (prev.get("board") or [])}

    def unchanged(row):
        p = prev_by_name.get(row["name"])
        if not p or not p.get("blurb"):
            return False
        same_line = [s["name"] for s in row["lineup"]] == [s.get("name") for s in p.get("lineup", [])]
        same_rank = p.get("rank") == row["rank"]
        same_w = abs((prev.get("results_weight") or 0) - 0) < 1e-9 if not gp else True
        return same_line and same_rank and (gp == 0 and same_w or gp > 0 and p.get("record") == row["record"])

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
        rec = f"; {r['record']}, all-play {round(r['_rc']['allplay'] * 100)}%" if gp else ""
        lines.append(f'#{r["rank"]} {r["name"]} (score {r["score"]}) — starters: {lu}{gap}{rec}')
    user = (
        f"Week {board[0].get('_week', 0)}. {'Preseason — the board is a pure roster projection.' if not gp else f'{gp} games played, results now carry weight.'}\n\n"
        "The board:\n" + "\n".join(lines) +
        "\n\nWrite ONE sentence (max ~30 words) for EACH team, in board order. "
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
    season_db = (load("rankings-season") or {}).get("players") or []
    if not rosters or not season_db:
        print("missing rosters or season ranks — run tools/snapshot.py first")
        return 1

    find_rank = season_rank_lookup(season_db)
    slots = [s for s in (league.get("roster_positions") or STARTER_SLOTS_DEFAULT)
             if s not in ("BN", "IR", "TAXI")] or STARTER_SLOTS_DEFAULT

    rc_all, gp = results_context(scores, standings)
    rec_by_name = {r["name"]: f'{r["wins"]}-{r["losses"]}' for r in standings["rows"]}

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
        worst3 = sorted((s["rank"] or 400) for s in lineup)[-3:]
        thin_back = sum(worst3) / 3 > 108

        rc = rc_all.get(t["name"], {"allplay": 0.5, "winpct": 0.5})
        rows.append({
            "roster_id": t["roster_id"], "name": t["name"], "handle": t.get("handle", ""),
            "record": rec_by_name.get(t["name"], "0-0"),
            "_raw": roster_raw, "_rc": rc, "_thin_back": thin_back,
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

    w = min(0.72, 0.06 * gp)
    for r in rows:
        rs = round(results_score(r["_rc"]), 1) if gp else None
        r["results_score"] = rs
        r["score"] = round(r["roster_score"] * (1 - w) + (rs or r["roster_score"]) * w, 1)

    rows.sort(key=lambda r: -r["score"])
    prev = load("power") or {}
    prev_rank = {b["name"]: b["rank"] for b in (prev.get("board") or [])}
    for i, r in enumerate(rows, 1):
        r["rank"] = i
        r["movement"] = (prev_rank.get(r["name"]) - i) if r["name"] in prev_rank else 0
        r["_week"] = meta.get("current_week", 0)

    src = write_blurbs(rows, gp, prev)
    print(f"blurbs: {src}  |  games/team {gp}  results weight {w:.2f}")

    for r in rows:
        for k in ("_raw", "_rc", "_week", "_thin_back"):
            r.pop(k, None)

    out = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "season": meta.get("current_season"), "week": meta.get("current_week"),
        "status": meta.get("league_status"),
        "games_per_team": gp, "results_weight": round(w, 3),
        "as_of": (load("rankings-season") or {}).get("as_of", ""),
        "model": "win-now: best lineup + bench depth, blended with real results as games are played",
        "board": rows,
    }
    (DATA / "power.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print("wrote data/power.json —", " ".join(f'{r["rank"]}.{r["name"]}({r["score"]})' for r in rows))
    return 0


if __name__ == "__main__":
    sys.exit(main())
