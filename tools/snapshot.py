#!/usr/bin/env python3
"""Snapshot the Chabels Dynasty Sleeper league into data/*.json.

The site reads these files first and falls back to a live Sleeper fetch only if a
file is missing or stale. A GitHub Action runs this daily in-season, weekly off,
and commits whatever changed. stdlib only.

  python3 tools/snapshot.py
"""
import datetime
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
BASE = "https://api.sleeper.app/v1"

OWNERS = json.loads((DATA / "owners.json").read_text())
CURRENT_LEAGUE = OWNERS["current_league"]


def get(path, tries=4):
    url = BASE + path
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.loads(r.read())
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if i == tries - 1:
                print(f"  ! {path}: {e}")
                return None
            time.sleep(1.5 * (i + 1))


# ---------------------------------------------------------------- identity

def _user_to_name(users_by_id):
    """user_id -> canonical owner name, via owners.json then Sleeper handle."""
    uid_to_name = {}
    for rid, o in OWNERS["rosters"].items():
        for uid in o["user_ids"]:
            uid_to_name[uid] = o["name"]
    out = {}
    for uid, u in users_by_id.items():
        out[uid] = uid_to_name.get(uid) or u.get("display_name") or f"User {uid[:5]}"
    return out


def _roster_owner(league_id, users_by_id):
    """This league's roster_id -> owner name. owners.json roster keys are the
    CURRENT league's; for past seasons fall back to owner_id, then Team N."""
    users = get(f"/league/{league_id}/users") or []
    ubi = {u["user_id"]: u for u in users}
    name_of = _user_to_name(ubi)
    rosters = get(f"/league/{league_id}/rosters") or []
    out = {}
    for r in rosters:
        rid = r["roster_id"]
        owner = r.get("owner_id")
        co = r.get("co_owners") or []
        nm = name_of.get(owner)
        if not nm:
            for c in co:
                if name_of.get(c):
                    nm = name_of[c]
                    break
        if not nm and league_id == CURRENT_LEAGUE:
            nm = OWNERS["rosters"].get(str(rid), {}).get("name")
        out[rid] = nm or f"Team {rid}"
    return out, ubi


# ------------------------------------------------------------------ players

def player_universe(needed_ids):
    """Fetch the full NBA player dict once, keep only ids we reference."""
    print("  fetching player dictionary ...")
    allp = get("/players/nba") or {}
    out = {}
    for pid in needed_ids:
        p = allp.get(str(pid))
        if not p:
            continue
        nm = p.get("full_name") or " ".join(
            x for x in (p.get("first_name"), p.get("last_name")) if x)
        fpos = p.get("fantasy_positions") or ([p.get("position")] if p.get("position") else [])
        out[str(pid)] = {
            "name": nm, "pos": (fpos[0] if fpos else ""),
            "positions": [x for x in fpos if x],
            "team": p.get("team"), "age": p.get("age"), "number": p.get("number"),
            "injury": p.get("injury_status") or None,
        }
    return out


# -------------------------------------------------------------------- chain

def league_chain():
    """[(season, league_id, status), ...] newest first."""
    chain, lid = [], CURRENT_LEAGUE
    while lid:
        lg = get(f"/league/{lid}")
        if not lg:
            break
        chain.append((int(lg["season"]), lid, lg.get("status"), lg))
        lid = lg.get("previous_league_id")
    return chain


def pts(settings, key):
    return round((settings.get(f"fpts{key}") or 0)
                 + (settings.get(f"fpts{key}_decimal") or 0) / 100, 2)


def standings_for(league_id, roster_owner):
    rosters = get(f"/league/{league_id}/rosters") or []
    rows = []
    for r in rosters:
        s = r.get("settings") or {}
        rid = r["roster_id"]
        rows.append({
            "roster_id": rid,
            "name": roster_owner.get(rid, f"Team {rid}"),
            "handle": OWNERS["rosters"].get(str(rid), {}).get("handle", "")
                      if league_id == CURRENT_LEAGUE else "",
            "wins": s.get("wins", 0), "losses": s.get("losses", 0), "ties": s.get("ties", 0),
            "pf": pts(s, ""), "pa": pts(s, "_against"),
        })
    rows.sort(key=lambda x: (-x["wins"], -x["pf"]))
    return rows


def champion_from_bracket(league_id, roster_owner):
    wb = get(f"/league/{league_id}/winners_bracket") or []
    if not wb:
        return None, None
    final = max((m for m in wb if m.get("w") and not m.get("p")), key=lambda m: m.get("r", 0), default=None)
    # the p==1 match is the championship game
    champ_match = next((m for m in wb if m.get("p") == 1), final)
    if not champ_match:
        return None, None
    return (roster_owner.get(champ_match.get("w")),
            roster_owner.get(champ_match.get("l")))


# --------------------------------------------------------------------- main

def main():
    DATA.mkdir(exist_ok=True)
    chain = league_chain()
    if not chain:
        print("could not reach Sleeper"); return 1
    cur_season, cur_id, cur_status, cur_lg = chain[0]
    print(f"league chain: {[c[0] for c in chain]}  (current {cur_season}, {cur_status})")

    roster_owner_cur, users_cur = _roster_owner(cur_id, {})
    needed = set()

    # ---- current rosters
    rosters_raw = get(f"/league/{cur_id}/rosters") or []
    for r in rosters_raw:
        needed.update(str(p) for p in (r.get("players") or []))

    # ---- transactions (all seasons, all weeks) + drafts + history
    history, transactions, drafts = [], [], []
    for season, lid, status, lg in chain:
        r_owner, _ = _roster_owner(lid, {})

        for wk in range(1, 26):
            txns = get(f"/league/{lid}/transactions/{wk}")
            if not txns:
                continue
            for t in txns:
                if t.get("type") != "trade":
                    continue
                adds = t.get("adds") or {}
                drops = t.get("drops") or {}
                needed.update(str(p) for p in adds)
                parties = sorted({r_owner.get(rid) for rid in t.get("roster_ids", [])})
                by_team = {}
                for pid, rid in adds.items():
                    by_team.setdefault(r_owner.get(rid, f"Team {rid}"), {"players": [], "picks": []})
                    by_team[r_owner.get(rid, f"Team {rid}")]["players"].append(str(pid))
                for dp in (t.get("draft_picks") or []):
                    who = r_owner.get(dp.get("owner_id"), f"Team {dp.get('owner_id')}")
                    by_team.setdefault(who, {"players": [], "picks": []})
                    by_team[who]["picks"].append(
                        f"{dp.get('season')} R{dp.get('round')}"
                        + (f" (via {r_owner.get(dp.get('previous_owner_id'),'?')})"
                           if dp.get("previous_owner_id") != dp.get("owner_id") else ""))
                transactions.append({
                    "season": season, "week": t.get("leg", wk),
                    "created": t.get("created"),
                    "parties": [p for p in parties if p],
                    "receives": by_team,
                })

        for did in [d["draft_id"] for d in (get(f"/league/{lid}/drafts") or [])]:
            d = get(f"/draft/{did}") or {}
            picks = get(f"/draft/{did}/picks") or []
            for p in picks:
                needed.add(str(p.get("player_id")))
            drafts.append({
                "season": season, "draft_id": did,
                "type": d.get("type"), "status": d.get("status"),
                "rounds": (d.get("settings") or {}).get("rounds"),
                "order": {r_owner.get(int(k), k): v
                          for k, v in (d.get("draft_order") or {}).items()} if d.get("draft_order") else {},
                "picks": [{
                    "round": p.get("round"), "pick": p.get("pick_no"),
                    "roster_id": p.get("roster_id"),
                    "owner": r_owner.get(p.get("roster_id")),
                    "player_id": str(p.get("player_id")),
                } for p in picks],
            })

        champ, runner = champion_from_bracket(lid, r_owner)
        history.append({
            "season": season, "league_id": lid, "status": status,
            "champion": champ, "runner_up": runner,
            "standings": standings_for(lid, r_owner),
        })

    # ---- current matchups (in-season only)
    cur_week = (cur_lg.get("settings") or {}).get("leg") or 1
    matchups = {"week": cur_week, "games": []}
    if cur_status in ("in_season", "post_season"):
        raw = get(f"/league/{cur_id}/matchups/{cur_week}") or []
        pair = {}
        for m in raw:
            pair.setdefault(m.get("matchup_id"), []).append(m)
        for grp in pair.values():
            if len(grp) == 2:
                matchups["games"].append({
                    "a": {"name": roster_owner_cur.get(grp[0]["roster_id"]), "pts": grp[0].get("points") or 0},
                    "b": {"name": roster_owner_cur.get(grp[1]["roster_id"]), "pts": grp[1].get("points") or 0},
                })

    # ---- per-owner per-week scores for the current season (all-play + form)
    weeks = []
    reg_end = (cur_lg.get("settings") or {}).get("playoff_week_start")
    last_scored = min(cur_week, (reg_end - 1)) if reg_end else cur_week
    if cur_status in ("in_season", "post_season"):
        for w in range(1, max(1, last_scored) + 1):
            raw = get(f"/league/{cur_id}/matchups/{w}") or []
            wk = {}
            for m in raw:
                if m.get("points") is not None and any((m.get("players_points") or {}).values() if m.get("players_points") else [1]):
                    wk[roster_owner_cur.get(m["roster_id"], f"Team {m['roster_id']}")] = round(m.get("points") or 0, 2)
            if wk and any(v > 0 for v in wk.values()):
                weeks.append({"week": w, "scores": wk})

    players = player_universe(needed)

    rosters_out = []
    for r in rosters_raw:
        rid = r["roster_id"]
        rosters_out.append({
            "roster_id": rid,
            "name": roster_owner_cur.get(rid),
            "handle": OWNERS["rosters"].get(str(rid), {}).get("handle", ""),
            "players": [players.get(str(p), {"name": str(p)}) | {"id": str(p)}
                        for p in (r.get("players") or [])],
            "starters": [str(p) for p in (r.get("starters") or [])],
        })

    writes = {
        "meta.json": {
            "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
            "current_season": cur_season, "current_week": cur_week,
            "league_status": cur_status, "league_id": cur_id,
            "seasons": [c[0] for c in chain],
        },
        "league.json": {
            "season": cur_season, "week": cur_week, "status": cur_status,
            "name": cur_lg.get("name"),
            "roster_positions": cur_lg.get("roster_positions") or [],
            "scoring_settings": cur_lg.get("scoring_settings") or {},
            "playoff_week_start": (cur_lg.get("settings") or {}).get("playoff_week_start"),
            "total_rosters": cur_lg.get("total_rosters"),
        },
        "standings.json": {"season": cur_season, "rows": standings_for(cur_id, roster_owner_cur)},
        "rosters.json": {"season": cur_season, "rosters": rosters_out},
        "scores.json": {"season": cur_season, "weeks": weeks},
        "matchups.json": matchups,
        "transactions.json": {"trades": sorted(transactions, key=lambda t: t.get("created") or 0, reverse=True)},
        "history.json": {"seasons": history},
        "drafts.json": {"drafts": drafts},
        "players.json": players,
    }
    for name, obj in writes.items():
        (DATA / name).write_text(json.dumps(obj, indent=2, sort_keys=False))
        print(f"  wrote data/{name}  ({(DATA / name).stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
