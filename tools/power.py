#!/usr/bin/env python3
"""Chabels Dynasty — WIN-NOW power rankings -> data/power.json.

One board, one score per team. The score blends three inputs:

  ROSTER  — Chabels is a Lock-In league (one game per player per week, your
            pick), so each player is valued at his weekly CEILING: projected
            mu (Hashtag 2026-27, league scoring, data/projections.json) plus an
            optimal-stopping premium over an estimated game-to-game sigma. A
            team is worth its best 16 of those — the position-aware starting 10
            at full weight, then a declining tail. No dynasty value, no picks.

  HISTORY — the manager's track record: recency-weighted regular-season win %
            over the seasons we have, plus credit for title-game trips
            (data/history.json). The preseason anchor.

  RESULTS — once games are played: all-play win %, real win %, points-per-game
            index and last-3 form (from data/scores.json + data/standings.json).

  weights — preseason is 50% ROSTER / 50% HISTORY. As games are played RESULTS
            ramps in (cap 0.65) and HISTORY fades toward ~4%.

Each team gets a one-line take (blurb), a headline, and a short write-up
(3-5 sentences) — written like a real power-rankings column, not a scoring
breakdown: no score numbers or percentages in the prose, just the roster,
trades, injuries, streaks and track record that actually explain where a team
sits. If ANTHROPIC_API_KEY is set the headline and write-up are written by
Claude in the league's honest-with-bite voice; otherwise plain rule-built
text is used. All three are cached in the previous data/power.json and only
regenerated when a team's rank, roster or the results weight moved.

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

# Chabels is a Lock-In league: each player counts ONE game per week and you pick
# which one (pass on a stinker, wait for a good night). So a player's weekly
# worth is NOT his average — it's the game you can realistically lock, roughly a
# high-percentile outcome. weekly = availability * (mu + K_STOP * sigma):
#   mu     projected fantasy points / game (Hashtag, league scoring)
#   sigma  game-to-game standard deviation, estimated from the stat line
#   K_STOP optimal-stopping premium over ~3.3 games a week (~+0.68 sigma)
#   avail  how often the player is actually available to lock a game
K_STOP = 0.68
GAMES_PER_WEEK = 3.3


def player_sigma(p):
    """Estimate a player's game-to-game fantasy-points SD from projected rates."""
    pts, oreb, treb = p["pts"], p["oreb"], p["treb"]
    ast, stl, blk, to = p["ast"], p["stl"], p["blk"], p["to"]
    tpm, fgm, fga, ftm, fta = p["tpm"], p["fgm"], p["fga"], p["ftm"], p["fta"]
    dd, td = p["dd"], p["td"]
    v_score = pts + 2 * fgm - fga + ftm - fta + tpm      # the scoring bundle mean
    sd_score = 0.40 * v_score + 3.5
    sd_reb = 1.5 + 0.30 * treb
    sd_ast = 2.0 * (1.0 + 0.35 * ast)
    sd_stl = 4.0 * math.sqrt(max(stl, 0.05))
    sd_blk = 4.0 * math.sqrt(max(blk, 0.05))
    sd_to = 2.0 * math.sqrt(max(to, 0.05))
    p_dd = min(0.99, max(0.0, dd))
    p_td = min(0.99, max(0.0, td))
    var = (sd_score ** 2 + sd_reb ** 2 + sd_ast ** 2 + sd_stl ** 2 + sd_blk ** 2
           + sd_to ** 2 + 25 * p_dd * (1 - p_dd) + 100 * p_td * (1 - p_td))
    return math.sqrt(var)


def player_availability(gp):
    """Fraction of weeks a ~gp-game player can lock a real game. Steep at the
    bottom — in Lock-In a missed week is a zero from that slot."""
    return min(1.0, (max(gp, 1) / 74.0) ** 0.7)


def weekly_value(p):
    """Projected weekly Lock-In value for a player row from data/projections.json."""
    mu = p["total"]
    sig = player_sigma(p)
    return round(player_availability(p["gp"]) * (mu + K_STOP * sig), 2)


def build_pool(projections):
    """name -> {value, mu, sigma, gp, positions} for every projected player."""
    exact, loose = {}, {}
    for p in (projections.get("players") or []):
        sig = player_sigma(p)
        row = {
            "name": p["name"], "positions": p.get("pos") or [],
            "mu": round(p["total"], 1), "sigma": round(sig, 1), "gp": p["gp"],
            "value": weekly_value(p),
        }
        n = _norm(p["name"])
        exact[n] = row
        loose.setdefault(_strip_suffix(n), row)
    ranked = sorted(exact.values(), key=lambda r: -r["value"])
    for i, r in enumerate(ranked, 1):
        r["rank"] = i

    def find(name):
        n = _norm(name)
        return exact.get(n) or loose.get(_strip_suffix(n))
    return find, ranked


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
            lineup.append({"slot": slot, "name": None, "rank": None, "value": 0.0, "mu": None})
        else:
            used.add(pick)
            p = players[pick]
            lineup.append({"slot": slot, "name": p["name"], "rank": p.get("rank"),
                           "value": p["value"], "mu": p.get("mu")})
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

def history_context(history, playoff_teams=6):
    """Per-manager track record: recency-weighted regular-season win %, playoff /
    finals / title credit, a recent-trend nudge, and the career record. This is
    the preseason anchor — a 30-10 team every year should not open the board at
    #7 because the roster looks thin."""
    seasons = [s for s in history.get("seasons", [])
               if s.get("status") == "complete"
               and s.get("standings") and any(r["wins"] or r["losses"] for r in s["standings"])]
    seasons.sort(key=lambda s: s["season"])
    if not seasons:
        return {}
    # steep recency lean: most recent season 4x, next 2x, older 1x
    wt = {}
    for i, s in enumerate(reversed(seasons)):
        wt[s["season"]] = (4, 2, 1)[i] if i < 3 else 1

    order = {}
    for s in seasons:
        for i, r in enumerate(sorted(s["standings"], key=lambda x: (-x["wins"], -x.get("pf", 0))), 1):
            order.setdefault(r["name"], []).append((s["season"], i))

    out = {}
    for s in seasons:
        yr, champ, ru = s["season"], s.get("champion"), s.get("runner_up")
        finish = {r["name"]: i for i, r in
                  enumerate(sorted(s["standings"], key=lambda x: (-x["wins"], -x.get("pf", 0))), 1)}
        for r in s["standings"]:
            n = r["name"]
            g = r["wins"] + r["losses"]
            d = out.setdefault(n, {"num": 0.0, "den": 0.0, "playoff_pts": 0.0,
                                   "titles": 0, "runner_ups": 0, "playoffs": 0,
                                   "w": 0, "l": 0, "seasons": 0})
            if g:
                d["num"] += wt[yr] * r["wins"] / g
                d["den"] += wt[yr]
                d["w"] += r["wins"]
                d["l"] += r["losses"]
                d["seasons"] += 1
            if finish.get(n, 99) <= playoff_teams:
                d["playoffs"] += 1
                d["playoff_pts"] += 0.15
            if n == champ:
                d["titles"] += 1
                d["playoff_pts"] += 1.0
            elif n == ru:
                d["runner_ups"] += 1
                d["playoff_pts"] += 0.5

    for n, d in out.items():
        d["wpct"] = d["num"] / d["den"] if d["den"] else 0.5
        fins = [i for _, i in sorted(order.get(n, []))]
        d["best"] = min(fins) if fins else 99
        # trend: finishing better lately than early is a small plus
        d["trend"] = (fins[0] - fins[-1]) / 10.0 if len(fins) >= 2 else 0.0
    return out


def history_score(row, mean_wpct):
    """Track-record row -> 0..100 on the power scale."""
    if not row:
        return 50.0
    raw = (55
           + 175 * (row["wpct"] - mean_wpct)   # recency-weighted win %
           + 7 * row["playoff_pts"]            # playoff trips, finals, titles
           + 8 * row.get("trend", 0.0))        # improving vs sliding
    return max(10.0, min(98.0, raw))


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


def rule_writeup(row, gp):
    """Plain-text fallback write-up: same three-beat shape as the Claude version,
    but built from templates instead of prose — no score numbers or percentages."""
    bits = []

    lu = sorted((s for s in row["lineup"] if s["name"]), key=lambda s: -s["value"])
    top3 = ", ".join(s["name"] for s in lu[:3])

    # lede: identity/trajectory
    if row["movement"] >= 3:
        bits.append(f"{row['name']} is on the move, up {row['movement']} spots since last week.")
    elif row["movement"] <= -3:
        bits.append(f"{row['name']} is sliding, down {abs(row['movement'])} spots since last week.")
    elif row["rank"] == 1:
        bits.append(f"{row['name']} is still the team to beat.")
    else:
        bits.append(f"{row['name']} holds at #{row['rank']} this week.")

    # reasoning: whatever's most concrete
    if row["gaps"]:
        bits.append("The lineup is playing a replacement-level starter at " +
                    ", ".join(row["gaps"]) + ", and that's the hole to watch.")
    elif top3:
        bits.append(f"Built around {top3}, with a career record of {row['career']}." if row.get("career")
                    else f"Built around {top3}.")
    hurt = injured_starters(row)
    if hurt:
        bits.append("Injury concern right now: " + ", ".join(hurt) + ".")

    # kicker: results/trajectory
    if gp:
        bits.append(f"This season: {row['record']}, {round(row['_rc']['allplay'] * 100)}% all-play.")
    else:
        bits.append("No games played yet — this is the preseason read.")
    return " ".join(bits)


def load_trades():
    """Parse the hand-curated js/trades-data.js into plain dicts, file order = chronological."""
    path = ROOT / "js" / "trades-data.js"
    try:
        js = path.read_text()
    except Exception:
        return []
    blocks = re.findall(r"\{\s*teams:.*?\n  \},?\n", js, re.S)
    trades = []
    for b in blocks:
        date_m = re.search(r'date: "([^"]+)"', b)
        sides = re.findall(r'side\d: \{ team: "([^"]+)", assets: \[(.*?)\]\}', b, re.S)
        parsed_sides = []
        for team, assets_text in sides:
            names = re.findall(r'\{ type: "player", name: "([^"]+)" \}', assets_text)
            picks = re.findall(r'pickRound: (\d+), pickSeason: "(\d+)"', assets_text)
            parsed_sides.append({"team": team, "players": names, "picks": picks})
        trades.append({
            "date": date_m.group(1) if date_m else "",
            "sides": parsed_sides,
        })
    return trades


def recent_trade_line(owner, trades):
    """Most recent trade involving `owner`, as a short human-readable line, or ''."""
    for t in reversed(trades):
        mine = next((s for s in t["sides"] if s["team"] == owner), None)
        theirs = next((s for s in t["sides"] if s["team"] != owner), None)
        if not mine or not theirs:
            continue

        def describe(side):
            bits = list(side["players"]) + [f"a {season} R{rnd}" for rnd, season in side["picks"]]
            return ", ".join(bits) if bits else "nothing of note"

        return f"Traded with {theirs['team']} ({t['date']}): got {describe(mine)}, gave up {describe(theirs)}."
    return ""


def injured_starters(row):
    """Rostered starters currently flagged injured in data/players.json, by name match."""
    by_name = {}
    for p in (load("players") or {}).values():
        if p.get("injury") and p.get("name"):
            by_name[_norm(p["name"])] = (p["name"], p["injury"])
    hits = []
    for s in row["lineup"]:
        hit = by_name.get(_norm(s.get("name", "")))
        if hit:
            hits.append(f"{hit[0]} ({hit[1]})")
    return hits


def rule_headline(row, gp):
    """Plain-text fallback headline, trajectory-based."""
    if row["movement"] >= 3:
        return "On the Move"
    if row["movement"] <= -3:
        return "Sliding"
    if row["rank"] == 1:
        return "Still the Team to Beat"
    if row.get("gaps"):
        return "A Hole to Fill"
    return "Holding Steady"


def write_writeups(board, gp, prev):
    prev_by_name = {b["name"]: b for b in (prev.get("board") or [])}
    prev_gp = (prev.get("games_per_team") or 0)
    trades = load_trades()

    def unchanged(row):
        p = prev_by_name.get(row["name"])
        if not p or not p.get("writeup") or not p.get("headline"):
            return False
        same_line = [s["name"] for s in row["lineup"]] == [s.get("name") for s in p.get("lineup", [])]
        same_rank = p.get("rank") == row["rank"]
        same_phase = (gp == 0) == (prev_gp == 0)
        return same_line and same_rank and same_phase and (gp == 0 or p.get("record") == row["record"])

    stale = [r for r in board if not unchanged(r)]
    if not stale:
        for r in board:
            r["writeup"] = prev_by_name[r["name"]]["writeup"]
            r["headline"] = prev_by_name[r["name"]]["headline"]
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
        form = r["_rc"].get("form", 0.0) if gp else 0.0
        streak = ("; trending up the last 3 weeks" if form > 0.5 else
                   "; trending down the last 3 weeks" if form < -0.5 else "")
        trade = recent_trade_line(r["name"], trades)
        trade_bit = f"; most recent trade — {trade}" if trade else ""
        hurt = injured_starters(r)
        hurt_bit = f"; injury flags: {', '.join(hurt)}" if hurt else ""
        move = (f"; up {r['movement']} spots since last week" if r["movement"] > 0 else
                f"; down {abs(r['movement'])} spots since last week" if r["movement"] < 0 else
                "; unchanged since last week")
        prev_headline = (prev_by_name.get(r["name"]) or {}).get("headline", "")
        continuity = f"; last week's headline was \"{prev_headline}\"" if prev_headline else ""
        lines.append(
            f'#{r["rank"]} {r["name"]} (score {r["score"]} of {board[0]["score"]} top score) — '
            f"starters: {lu}{gap}{rez}{rec}{streak}{trade_bit}{hurt_bit}{move}{continuity}"
        )
    phase = ("Preseason — the board leans on roster projection and manager track record, no games played yet."
             if not gp else
             f"{gp} games played — the board is now mostly this season's real results, with roster and track record behind it.")
    user = (
        f"Week {board[0].get('_week', 0)}. {phase}\n\n"
        "The board:\n" + "\n".join(lines) +
        "\n\n"
        "Write this like a real sports power-rankings column, not a scoring-formula explainer. "
        "For EACH team, write a short bolded headline (3-6 words, a real power-rankings headline like "
        "\"Still the Team to Beat\" or \"Reality Check Incoming\") followed by a short write-up "
        "(3-5 sentences) in three beats: (1) a lede stating the team's identity or trajectory right now, "
        "(2) 1-2 sentences of concrete reasoning — pull from whatever is most interesting in the data: a "
        "player, a lineup hole, a recent trade, an injury, a hot or cold streak, the manager's history — "
        "(3) a kicker, what to watch for this team next. "
        "Do NOT mention the numeric score, percentages, or score weights anywhere in the prose — explain "
        "the team, not the formula. Match the tone to the team's trajectory: rising teams get statement "
        "language, falling teams get a warning-sign tone, true contenders get a 'the case for/against' "
        "framing, teams at the bottom get building-block framing. If last week's headline is given, you can "
        "nod to the change in trajectory in prose (e.g. \"after cooling off last week...\") instead of just "
        "restating the same take. "
        "Return in this exact format, one block per team, in board order, nothing else:\n\n"
        "### <owner>\n**<headline>**\n<the write-up>\n"
    )
    out = claude(VOICE, user, max_tokens=4000)
    parsed = {}
    if out:
        for block in re.split(r"^#{1,3}\s*", out, flags=re.M)[1:]:
            lines_b = block.strip().splitlines()
            if not lines_b:
                continue
            owner = re.sub(r"[*_`:]", "", lines_b[0]).strip()
            owner = re.sub(r"^\d+[.)]\s*", "", owner)  # strip a leading "1. "
            rest = [l.strip() for l in lines_b[1:] if l.strip()]
            headline, body = "", rest
            if rest and re.match(r"^\*\*.+\*\*$", rest[0]):
                headline = re.sub(r"^\*\*|\*\*$", "", rest[0]).strip()
                body = rest[1:]
            text = " ".join(body)
            if text:
                parsed[_norm(owner)] = {"headline": headline, "writeup": text}
    if out and not parsed:
        print("  writeups: Claude returned text but nothing parsed. First 300 chars:")
        print("  " + out[:300].replace("\n", " \\n "))
    for r in board:
        got = parsed.get(_norm(r["name"]))
        if got and got["writeup"] and got["headline"]:
            r["writeup"], r["headline"] = got["writeup"], got["headline"]
        else:
            r["writeup"] = rule_writeup(r, gp)
            r["headline"] = rule_headline(r, gp)
    return "claude" if parsed else "rule"


# --------------------------------------------------------------------- main

def main():
    rosters = (load("rosters") or {}).get("rosters") or []
    standings = load("standings") or {"rows": []}
    scores = load("scores") or {"weeks": []}
    league = load("league") or {}
    meta = load("meta") or {}
    history = load("history") or {"seasons": []}
    projections = load("projections") or {}
    if not rosters or not (projections.get("players")):
        print("missing rosters or projections — run tools/snapshot.py and refresh data/projections.json")
        return 1

    find_player, pool = build_pool(projections)
    proj_as_of = projections.get("as_of", "")
    slots = [s for s in (league.get("roster_positions") or STARTER_SLOTS_DEFAULT)
             if s not in ("BN", "IR", "TAXI")] or STARTER_SLOTS_DEFAULT

    rc_all, gp = results_context(scores, standings)
    rec_by_name = {r["name"]: f'{r["wins"]}-{r["losses"]}' for r in standings["rows"]}

    hc_all = history_context(history, league.get("playoff_teams") or 6)
    mean_wpct = (sum(h["wpct"] for h in hc_all.values()) / len(hc_all)) if hc_all else 0.5

    # in Lock-In you rotate ~16 players through 10 slots over a week, so the
    # roster is worth its best 16 — the starting 10 (position-aware) at full
    # weight, then a declining tail for the next 6 who grab a slot on off nights.
    DEPTH_W = [0.55, 0.45, 0.36, 0.28, 0.22, 0.17]

    rows = []
    for t in rosters:
        players = []
        for p in t["players"]:
            pr = find_player(p["name"])
            players.append({
                "name": p["name"],
                "rank": pr["rank"] if pr else None,
                "value": pr["value"] if pr else 4.0,
                "mu": pr["mu"] if pr else None,
                "sigma": pr["sigma"] if pr else None,
                "positions": p.get("positions") or ([p["pos"]] if p.get("pos") else []),
            })
        lineup, bench = best_lineup(players, slots)
        lineup_avg = sum(s["value"] for s in lineup) / max(1, len(lineup))
        depth = [b["value"] for b in bench[:len(DEPTH_W)]]
        depth_avg = (sum(v * w for v, w in zip(depth, DEPTH_W)) / sum(DEPTH_W[:len(depth)])
                     if depth else 0.0)
        roster_raw = 0.72 * lineup_avg + 0.28 * depth_avg

        gaps = []
        for s in lineup:
            if s["name"] is None or s["rank"] is None or s["rank"] > 110:
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
    src2 = write_writeups(rows, gp, prev)
    print(f"blurbs: {src}  |  writeups: {src2}  |  games/team {gp}  weights R{w_r:.2f} H{w_h:.2f} C{w_c:.2f}")

    for r in rows:
        for k in ("_raw", "_rc", "_hc", "_week", "_thin_back"):
            r.pop(k, None)

    out = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "season": meta.get("current_season"), "week": meta.get("current_week"),
        "status": meta.get("league_status"),
        "games_per_team": gp,
        "weights": {"roster": round(w_r, 3), "history": round(w_h, 3), "results": round(w_c, 3)},
        "as_of": proj_as_of,
        "model": "Lock-In win-now: each player valued at his weekly ceiling "
                 "(mu + optimal-stopping premium x sigma), roster = best 16 of "
                 "those, blended with manager track record and this season's results",
        "board": rows,
    }
    (DATA / "power.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print("wrote data/power.json —", " ".join(f'{r["rank"]}.{r["name"]}({r["score"]})' for r in rows))

    # human-readable derived list (weekly Lock-In value), for reference
    rl = {
        "as_of": proj_as_of + " — weekly Lock-In value (tools/power.py model)",
        "source": projections.get("source", ""),
        "count": len(pool),
        "players": [{"name": p["name"], "rank": p["rank"], "weekly": p["value"],
                     "mu": p["mu"], "sigma": p["sigma"], "gp": p["gp"]} for p in pool],
    }
    (DATA / "rankings-season.json").write_text(json.dumps(rl, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
