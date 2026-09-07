/* ============================================
   CHABELS DYNASTY — 3-Tier Power Rankings
   Based on Hashtag current-season points + dynasty rankings
   ============================================ */

// Hashtag Basketball 2025-26 points league rankings.
// Used by rank only for current-season / win-now scoring; raw projected PPG
// is not displayed or used because Chabels has custom scoring rules.
let CURRENT_SEASON_POINTS_DB = []; // loaded from data/rankings-season.json (fallback: empty)

// Hashtag Basketball POINTS-LEAGUE Dynasty Rankings (Top 460) — updated 02 July 2026
// Format: { name, rank, age, team, pos }
let DYNASTY_DB = []; // loaded from data/rankings-dynasty.json (fallback: empty)

// Dizzle Dynasty July 2026 Points rankings (full-player list from Peter's shared sheet).
// Used with Hashtag dynasty rankings as an across-the-board average for 5-year value.
let DIZZLE_DYNASTY_POINTS_DB = []; // loaded from data/rankings-dizzle.json (fallback: empty)

// Value function: convert rank to value points (higher = better)
function rankToValue(rank) {
  if (!rank || rank > 450) return 0.5;
  if (rank <= 10) return 100 - (rank - 1) * 5;     // 100, 95, 90...
  if (rank <= 30) return 55 - (rank - 10) * 1.5;    // 55 → 25
  if (rank <= 60) return 25 - (rank - 30) * 0.5;    // 25 → 10
  if (rank <= 120) return 10 - (rank - 60) * 0.1;   // 10 → 4
  if (rank <= 160) return 4 - (rank - 120) * 0.05;  // 4 → 2
  if (rank <= 220) return 2 - (rank - 160) * 0.02;  // 2 → 0.8
  if (rank <= 450) return 0.8 - (rank - 220) * 0.002;  // 0.8 → 0.34
  return 0.5;
}

// Age decay for different windows
function ageMultiplier(age, window) {
  if (window === '1yr') {
    // Next season: prime years are best, age doesn't matter much unless very old
    if (age >= 36) return 0.6;
    if (age >= 33) return 0.8;
    if (age >= 30) return 0.95;
    return 1.0;
  } else if (window === '5yr') {
    // 5-year window: youth matters more
    if (age >= 36) return 0.2;
    if (age >= 33) return 0.4;
    if (age >= 30) return 0.65;
    if (age >= 28) return 0.8;
    if (age >= 25) return 0.95;
    if (age >= 22) return 1.1;
    return 1.2; // Under 22 = premium
  } else {
    // Longer-term fallback: youth is king
    if (age >= 36) return 0.05;
    if (age >= 33) return 0.15;
    if (age >= 30) return 0.3;
    if (age >= 28) return 0.5;
    if (age >= 25) return 0.75;
    if (age >= 22) return 1.1;
    return 1.4; // Under 22 = massive premium
  }
}

// ===== Draft Pick Valuation =====
// Round-based base values (10-team league)
function pickRoundValue(round) {
  switch(round) {
    case 1: return 30;  // 1st rounders are gold
    case 2: return 15;
    case 3: return 8;
    case 4: return 5;
    case 5: return 3;
    case 6: return 2;
    case 7: return 1;
    default: return 1;
  }
}

// Boost pick value based on how bad the original team is (worse team = higher pick)
function teamStrengthMultiplier(wins, losses) {
  const totalGames = wins + losses || 1;
  const winPct = wins / totalGames;
  // Worse team = better pick = higher multiplier
  if (winPct <= 0.25) return 1.5;  // Lottery pick territory
  if (winPct <= 0.35) return 1.3;
  if (winPct <= 0.45) return 1.1;
  if (winPct <= 0.55) return 0.9;
  return 0.7;  // Contender pick = late round
}

// Time window multiplier for picks
function pickWindowMultiplier(season, window) {
  const yr = parseInt(season);
  if (window === '1yr') {
    // Next season: 2026 picks are about to be used, very valuable
    return yr === 2026 ? 1.2 : 0.7;
  } else if (window === '5yr') {
    // 5yr: all picks matter
    return yr <= 2027 ? 1.0 : 0.8;
  } else {
    // Longer-term: future picks are premium
    return yr <= 2027 ? 0.9 : 1.1;
  }
}

// Build draft pick inventory for each roster
function buildPickInventory(rosters, tradedPicks) {
  const NUM_ROUNDS = 7;
  const SEASONS = ['2026', '2027'];

  // Team record lookup by roster_id
  const teamRecords = {};
  rosters.forEach(r => {
    teamRecords[r.roster_id] = {
      wins: r.settings?.wins || 0,
      losses: r.settings?.losses || 0
    };
  });

  // Initialize: each team owns their own picks
  // Key: roster_id → array of { season, round, originalTeamId }
  const inventory = {};
  rosters.forEach(r => {
    inventory[r.roster_id] = [];
    SEASONS.forEach(s => {
      for (let rd = 1; rd <= NUM_ROUNDS; rd++) {
        inventory[r.roster_id].push({
          season: s,
          round: rd,
          originalTeamId: r.roster_id
        });
      }
    });
  });

  // Process trades: remove from previous owner, add to new owner
  tradedPicks.forEach(tp => {
    const fromId = tp.previous_owner_id;
    const toId = tp.owner_id;
    if (fromId === toId) return; // not actually traded

    // Remove from previous owner
    if (inventory[fromId]) {
      const idx = inventory[fromId].findIndex(p =>
        p.season === tp.season && p.round === tp.round && p.originalTeamId === tp.roster_id
      );
      if (idx >= 0) inventory[fromId].splice(idx, 1);
    }

    // Add to new owner
    if (inventory[toId]) {
      inventory[toId].push({
        season: tp.season,
        round: tp.round,
        originalTeamId: tp.roster_id
      });
    }
  });

  return { inventory, teamRecords };
}

// Calculate total draft capital value for a team in a given window
function calcDraftCapitalValue(picks, teamRecords, window) {
  let total = 0;
  const pickDetails = [];

  picks.forEach(p => {
    const baseVal = pickRoundValue(p.round);
    const rec = teamRecords[p.originalTeamId] || { wins: 20, losses: 20 };
    const strengthMult = teamStrengthMultiplier(rec.wins, rec.losses);
    const windowMult = pickWindowMultiplier(p.season, window);
    const val = baseVal * strengthMult * windowMult;
    total += val;

    if (p.round <= 2) { // Only show 1st and 2nd round picks in display
      pickDetails.push({
        label: `${p.season} Rd${p.round}`,
        originalTeam: p.originalTeamId,
        value: val.toFixed(1)
      });
    }
  });

  pickDetails.sort((a, b) => b.value - a.value);
  return { total, details: pickDetails };
}

// (Historical-performance code removed — the board uses no historical record.)
// Main: Fetch rosters + users, calculate rankings
async function renderThreeTierRankings() {
  const containers = {
    '1yr': document.getElementById('rankings-1yr'),
    '5yr': document.getElementById('rankings-5yr')
  };

  Object.values(containers).forEach(el => {
    if (el) el.innerHTML = '<div class="loading">Loading power rankings</div>';
  });

  // Player ranking DBs are hand-maintained snapshots in data/*.json.
  if (window.CD && !DYNASTY_DB.length) {
    const [s, d, z] = await Promise.all([
      CD.load('rankings-season'), CD.load('rankings-dynasty'), CD.load('rankings-dizzle')
    ]);
    if (s && s.players) CURRENT_SEASON_POINTS_DB = s.players;
    if (d && d.players) DYNASTY_DB = d.players;
    if (z && z.players) DIZZLE_DYNASTY_POINTS_DB = z.players;
    const asof = document.getElementById('rankings-asof');
    if (asof && d && d.as_of) asof.textContent = 'Player values as of ' + d.as_of + '.';
  }

  const BASE = 'https://api.sleeper.app/v1';
  const LEAGUE_ID = '1354592185370034176';
  const rosterOwnerMap = {1:'Peter',2:'CJ',3:'Schommer',4:'Schu',5:'Noah',6:'Nolan',7:'Logan',8:'Kaleb',9:'Christian/Mitch',10:'Austin'};

  // Prefer the committed snapshot (no 5 MB /players/nba download); fall back to Sleeper.
  let teams = null;
  if (window.CD) {
    const [rostersSnap, standingsSnap] = await Promise.all([CD.load('rosters'), CD.load('standings')]);
    if (rostersSnap && Array.isArray(rostersSnap.rosters) && rostersSnap.rosters.length) {
      const rec = {};
      ((standingsSnap && standingsSnap.rows) || []).forEach(r => { rec[r.roster_id] = r; });
      teams = rostersSnap.rosters.map(r => {
        const s = rec[r.roster_id] || {};
        return {
          name: r.name || rosterOwnerMap[r.roster_id] || ('Team ' + r.roster_id),
          roster_id: r.roster_id,
          wins: s.wins || 0,
          losses: s.losses || 0,
          fpts: s.pf || 0,
          playerNames: (r.players || []).map(p => p.name).filter(Boolean)
        };
      });
    }
  }

  if (!teams) {
    let rosters, users, allPlayers;
    try {
      [rosters, users, allPlayers] = await Promise.all([
        fetch(`${BASE}/league/${LEAGUE_ID}/rosters`).then(r => r.json()),
        fetch(`${BASE}/league/${LEAGUE_ID}/users`).then(r => r.json()),
        fetch(`${BASE}/players/nba`).then(r => r.json())
      ]);
    } catch (e) {
      Object.values(containers).forEach(el => {
        if (el) el.innerHTML = '<p class="loading">Failed to load data.</p>';
      });
      return;
    }
    const userMap = {};
    users.forEach(u => { userMap[u.user_id] = (u.metadata && u.metadata.team_name) || u.display_name || u.username; });
    teams = rosters.map(r => ({
      name: rosterOwnerMap[r.roster_id] || userMap[r.owner_id] || ('Team ' + r.roster_id),
      roster_id: r.roster_id,
      wins: (r.settings && r.settings.wins) || 0,
      losses: (r.settings && r.settings.losses) || 0,
      fpts: ((r.settings && r.settings.fpts) || 0) + ((r.settings && r.settings.fpts_decimal) || 0) / 100,
      playerNames: (r.players || []).map(pid => {
        const p = allPlayers[pid];
        return p ? (p.full_name || (p.first_name + ' ' + p.last_name)) : null;
      }).filter(Boolean)
    }));
  }

  // Normalize accented characters to ASCII for matching
  function normalizeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function findByPlayerName(db, clean, cleaned, stripSuffix) {
    let match = db.find(d => normalizeAccents(d.name.toLowerCase()) === clean);
    if (!match) {
      match = db.find(d => stripSuffix(normalizeAccents(d.name.toLowerCase())) === cleaned);
    }
    return match || null;
  }

  // Match player name to current-season and dynasty DBs (handles accents and suffixes)
  function findRankedPlayer(playerName, window) {
    if (!playerName) return null;
    const clean = normalizeAccents(playerName.toLowerCase().trim());
    const stripSuffix = s => s.replace(/\s+(jr\.?|sr\.?|ii|iii|iv)$/i, '').trim();
    const cleaned = stripSuffix(clean);

    const seasonMatch = findByPlayerName(CURRENT_SEASON_POINTS_DB, clean, cleaned, stripSuffix);
    const match = findByPlayerName(DYNASTY_DB, clean, cleaned, stripSuffix);
    const dizzleMatch = findByPlayerName(DIZZLE_DYNASTY_POINTS_DB, clean, cleaned, stripSuffix);

    if (!seasonMatch && !match && !dizzleMatch) return null;

    const dizzleRank = dizzleMatch?.rank || null;
    const hashtagRank = match?.rank || null;
    const effectiveRank = hashtagRank && dizzleRank
      ? Math.round((hashtagRank + dizzleRank) / 2)
      : (hashtagRank || dizzleRank);

    return {
      name: match?.name || dizzleMatch?.name || seasonMatch?.name,
      rank: effectiveRank,
      seasonRank: seasonMatch?.rank || null,
      seasonPoints: seasonMatch?.points || null,
      seasonGp: seasonMatch?.gp || null,
      hashtagRank,
      dizzleRank,
      age: match?.age || dizzleMatch?.age || 27,
      team: match?.team || dizzleMatch?.team || '',
      pos: match?.pos || dizzleMatch?.pos || '',
      rankLabel: hashtagRank && dizzleRank
        ? `#${effectiveRank} avg · Hashtag #${hashtagRank} / Dizzle #${dizzleRank}`
        : dizzleMatch && effectiveRank
          ? `#${effectiveRank} · Dizzle #${dizzleRank}`
          : (effectiveRank ? `#${effectiveRank}` : `Season #${seasonMatch.rank}`)
    };
  }

  const componentWeightsByWindow = {
    '1yr':  { topEnd: 0.45, depth: 0.55, youngStars: 0.00, winNow: 0.00 },
    '5yr':  { topEnd: 0.35, depth: 0.25, youngStars: 0.35, winNow: 0.05 }
  };

  function teamKey(team) {
    return String(team.roster_id || team.name);
  }

  function buildWindowScores(window) {
    const weights = componentWeightsByWindow[window];
    const clampScore = value => Math.max(0, Math.min(100, value));
    const youngStarValue = player => {
      if (player.age >= 25 || player.rank > 150) return 0;
      const youthBoost = player.age < 22 ? 1.2 : 1;
      return rankToValue(player.rank) * youthBoost;
    };
    const winNowValue = player => {
      // Win-now is current-season rank value, not raw projected PPG.
      return player.seasonRank ? rankToValue(player.seasonRank) : 0;
    };

    const scored = teams.map(t => {
      let topPlayers = [];
      let rankedRanks = [];
      let unrankedCount = 0;

      t.playerNames.forEach(pName => {
        const dynMatch = findRankedPlayer(pName, window);
        if (dynMatch) {
          const baseVal = dynMatch.rank ? rankToValue(dynMatch.rank) : 0;
          const mult = ageMultiplier(dynMatch.age, window);
          const dynastyValue = baseVal * mult;
          const seasonValue = dynMatch.seasonRank ? rankToValue(dynMatch.seasonRank) : 0;
          const val = window === '1yr' ? seasonValue : dynastyValue;
          if (dynMatch.rank) rankedRanks.push(dynMatch.rank);
          topPlayers.push({
            name: dynMatch.name,
            rank: dynMatch.rank,
            rankLabel: window === '1yr' && dynMatch.seasonRank
              ? `Season #${dynMatch.seasonRank}`
              : dynMatch.rankLabel,
            seasonRank: dynMatch.seasonRank,
            seasonPoints: dynMatch.seasonPoints,
            seasonGp: dynMatch.seasonGp,
            hashtagRank: dynMatch.hashtagRank,
            dizzleRank: dynMatch.dizzleRank,
            age: dynMatch.age,
            value: val,
            dynastyValue,
            seasonValue,
            baseValue: baseVal
          });
        } else {
          unrankedCount += 1;
        }
      });

      topPlayers.sort((a, b) => b.value - a.value);
      const topEndValue = topPlayers.slice(0, 3).reduce((sum, p) => sum + p.value, 0);
      const depthValue = topPlayers.slice(0, 12).reduce((sum, p) => sum + p.value, 0);
      const youngStarsValue = topPlayers.reduce((sum, p) => sum + youngStarValue(p), 0);
      const winNowValueTotal = topPlayers.reduce((sum, p) => sum + winNowValue(p), 0);
      const topEndScore = clampScore((topEndValue / (window === '1yr' ? 160 : 210)) * 100);
      const depthScore = clampScore((depthValue / (window === '1yr' ? 360 : 300)) * 100);
      const youngStarsScore = clampScore((youngStarsValue / 180) * 100);
      const winNowScore = clampScore((winNowValueTotal / 360) * 100);
      const powerScore =
        topEndScore * weights.topEnd +
        depthScore * weights.depth +
        youngStarsScore * weights.youngStars +
        winNowScore * weights.winNow;

      // Top-15 average dynasty rank (lower = better). Fall back to whatever is
      // available if a roster somehow has fewer than 15 ranked players.
      const best15 = rankedRanks.slice().sort((a, b) => a - b).slice(0, 15);
      const avgTop15 = best15.length ? (best15.reduce((s, r) => s + r, 0) / best15.length) : 460;
      const top100Count = rankedRanks.filter(r => r <= 100).length;
      const youngCoreCount = topPlayers.filter(p => p.rank && p.age < 25 && p.rank <= 150).length;
      const winNowCount = topPlayers.filter(p => p.seasonRank && p.seasonRank <= 120).length;
      const eliteCount = rankedRanks.filter(r => r <= 30).length;

      return {
        ...t,
        topEndValue,
        depthValue,
        youngStarsValue,
        winNowValue: winNowValueTotal,
        avgTop15,
        topEndScore,
        depthScore,
        youngStarsScore,
        winNowScore,
        starScore: topEndScore,
        talentScore: topEndScore,
        powerScore,
        topPlayers: topPlayers.slice(0, 10),
        top100Count,
        youngCoreCount,
        winNowCount,
        eliteCount,
        unrankedCount
      };
    });

    return scored.sort((a, b) => b.powerScore - a.powerScore);
  }

  function getRankMovement(t, window, ranksByTeam) {
    const ranks = ranksByTeam[teamKey(t)] || {};
    if (window === '1yr') {
      const fiveYearRank = ranks['5yr'];
      if (!fiveYearRank || fiveYearRank === ranks['1yr']) return { label: 'Same 5Y slot', cls: 'neutral' };
      const delta = fiveYearRank - ranks['1yr'];
      return delta > 0
        ? { label: `${delta} spot${delta === 1 ? '' : 's'} lower in 5Y`, cls: 'down' }
        : { label: `${Math.abs(delta)} spot${Math.abs(delta) === 1 ? '' : 's'} higher in 5Y`, cls: 'up' };
    }

    const oneYearRank = ranks['1yr'];
    if (!oneYearRank || oneYearRank === ranks[window]) return { label: 'No window movement', cls: 'neutral' };
    const delta = oneYearRank - ranks[window];
    return delta > 0
      ? { label: `${delta} spot${delta === 1 ? '' : 's'} up vs win-now`, cls: 'up' }
      : { label: `${Math.abs(delta)} spot${Math.abs(delta) === 1 ? '' : 's'} down vs win-now`, cls: 'down' };
  }

  function getTeamVerdict(t, window) {
    const lead = t.topPlayers[0] ? `${t.topPlayers[0].name} anchors it` : 'No ranked anchor found';
    if (window === '1yr') {
      if (t.talentScore >= 75 && t.depthScore >= 70) return `Real title profile. ${lead}, and the depth is strong enough to survive a normal bad week.`;
      if (t.talentScore >= 70) return `Star-driven contender. ${lead}, but depth is the pressure point.`;
      if (t.depthScore >= 70) return `Deep roster, lighter on nuclear top-end talent. Needs the whole group to hit.`;
      return `Needs either a star jump or a consolidation trade before it looks scary next season.`;
    }
    if (t.youngCoreCount >= 6 && t.top100Count >= 7) return `Clean dynasty core. ${lead}, with enough young top-150 assets to age well.`;
    if (t.top100Count >= 8) return `Good five-year build, though some of the value is already in its prime.`;
    if (t.youngCoreCount >= 5) return `Future-leaning roster. The upside is real, but the proven top-end is thinner.`;
    return `Five-year value is fragile unless a few younger pieces make a leap.`;
  }

  function scoreBar(label, value, cls = '') {
    const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
    return `<div class="signal-bar ${cls}">
      <div class="signal-bar-label"><span>${label}</span><strong>${pct}/100</strong></div>
      <div class="signal-bar-track"><i style="width:${pct}%"></i></div>
    </div>`;
  }

  function getRiskScore(t) {
    const shallowPenalty = Math.max(0, 6 - t.top100Count) * 10;
    const imbalancePenalty = Math.abs(t.talentScore - t.depthScore) * 0.45;
    const agePenalty = Math.max(0, t.winNowCount - t.youngCoreCount) * 8;
    return Math.min(100, shallowPenalty + imbalancePenalty + agePenalty + t.unrankedCount * 2);
  }

  function getTimelineLabel(t, ranks) {
    const one = ranks['1yr'];
    const five = ranks['5yr'];
    const avgRank = (one + five) / 2;
    if (one <= 2 && five <= 3) return 'Title Favorite';
    if (one <= 4 && five <= 5) return 'Contender';
    if (five <= 4 && one <= 6) return 'Dynasty Core';
    if (five <= 4 && one >= 7) return 'Future Build';
    if (one <= 4 && five >= 7) return 'Aging Win-Now';
    if (avgRank >= 8.5) return five <= 6 ? 'Deep Rebuild' : 'Bottom Tier';
    if (avgRank >= 7) return t.youngCoreCount >= 5 ? 'Rebuild Upside' : 'Retool Needed';
    if (avgRank >= 5.5) return t.youngCoreCount >= 5 && t.top100Count < 7 ? 'Upside Bet' : 'Playoff Fringe';
    return 'Solid Middle';
  }

  function getTier(rank) {
    if (rank <= 3) return { label: 'Tier 1: Title Contenders', cls: 'tier-one' };
    if (rank <= 7) return { label: 'Tier 2: Middle / Playoff Mix', cls: 'tier-two' };
    return { label: 'Tier 3: Rebuild / Bottom Tier', cls: 'tier-three' };
  }

  function getTeamWriteup(t, window, rank, ranksByTeam) {
    const ranks = ranksByTeam[teamKey(t)] || {};
    const lead = t.topPlayers[0]?.name || 'the top asset';
    const second = t.topPlayers[1]?.name;
    const core = second ? `${lead} and ${second}` : lead;
    const risk = getRiskScore(t);
    const rankLine = window === '1yr'
      ? `This is the win-now lens, where ${t.name} checks in at #${rank}.`
      : `This is the five-year dynasty lens, where ${t.name} checks in at #${rank}.`;
    const strength = t.talentScore >= t.depthScore
      ? `${core} drives the ranking with stronger star power than depth.`
      : `${core} gives the roster an anchor, but the broader depth is what really lifts the score.`;
    let concern = `The concern is risk: ${t.unrankedCount} roster spots are outside the current dynasty list, and the risk bar sits at ${Math.round(risk)}/100.`;
    if (t.youngCoreCount >= 6) concern = `The long-term floor is helped by ${t.youngCoreCount} young top-150 assets, which keeps the roster from being just a short-term build.`;
    if (window === '1yr' && t.winNowCount >= 4) concern = `The current-season profile is helped by ${t.winNowCount} useful win-now veterans, though that value fades in longer windows.`;
    const move = ranks['1yr'] && ranks['5yr'] && ranks['1yr'] !== ranks['5yr']
      ? `The window movement tells the story: #${ranks['1yr']} this year versus #${ranks['5yr']} in the 5-year view.`
      : `The ranking is fairly stable across windows, which usually means the roster is balanced instead of one-timeline dependent.`;
    return `${rankLine} ${strength} ${concern} ${move}`;
  }

  function renderDriverGroup(label, players, emptyText) {
    const content = players.length
      ? players.map(p => `<span class="player-pill"><strong>${p.name}</strong> <span>${p.rankLabel || `#${p.rank}`}</span></span>`).join(' ')
      : `<span class="driver-empty">${emptyText}</span>`;
    return `<div class="driver-group"><h4>${label}</h4><div class="player-pill-row">${content}</div></div>`;
  }

  function renderOverallIndex(scoredByWindow, ranksByTeam) {
    const container = document.getElementById('overall-index');
    if (!container) return;
    const byKey = {};
    Object.entries(scoredByWindow).forEach(([window, scored]) => {
      scored.forEach(t => {
        const key = teamKey(t);
        if (!byKey[key]) byKey[key] = { team: t, scores: {} };
        byKey[key].scores[window] = t.powerScore;
      });
    });
    const rows = Object.values(byKey).map(row => {
      const overall = row.scores['1yr'] * 0.45 + row.scores['5yr'] * 0.55;
      return { ...row, overall };
    }).sort((a, b) => b.overall - a.overall);

    let html = '<div class="overall-table-wrap"><table class="overall-table"><thead><tr><th>#</th><th>Team</th><th>Overall</th><th>This Year</th><th>5Y</th><th>Profile</th><th>Movement</th></tr></thead><tbody>';
    rows.forEach((row, i) => {
      const ranks = ranksByTeam[teamKey(row.team)] || {};
      const delta = ranks['5yr'] - ranks['1yr'];
      const movement = delta === 0 ? 'Stable' : delta > 0 ? `${delta} lower in 5Y` : `${Math.abs(delta)} higher in 5Y`;
      html += `<tr>
        <td><span class="rank-num">${i + 1}</span></td>
        <td><strong>${row.team.name}</strong></td>
        <td>${row.overall.toFixed(1)}</td>
        <td>${ranks['1yr'] || '-'}</td>
        <td>${ranks['5yr'] || '-'}</td>
        <td><span class="profile-pill">${getTimelineLabel(row.team, ranks)}</span></td>
        <td>${movement}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  const scoredByWindow = {};
  ['1yr', '5yr'].forEach(window => {
    scoredByWindow[window] = buildWindowScores(window);
  });

  const ranksByTeam = {};
  Object.entries(scoredByWindow).forEach(([window, scored]) => {
    scored.forEach((team, index) => {
      const key = teamKey(team);
      if (!ranksByTeam[key]) ranksByTeam[key] = {};
      ranksByTeam[key][window] = index + 1;
    });
  });

  // Power score = fixed-scale blend of current-roster signals only (no draft capital, no history):
  // The 1-year view uses Hashtag's current-season points rankings only.
  // The 5-year view uses dynasty rank. If a player appears on Hashtag and
  // Dizzle, the effective dynasty rank is a straight average: Hashtag #5 + Dizzle #7 = #6.
  //   1. Top-end talent — the best three players in the selected window
  //   2. Depth — the best twelve players in the selected window
  //   3. Young stars — under-25 top-150 dynasty assets
  //   4. Win-now pieces — current-season rank value
  renderOverallIndex(scoredByWindow, ranksByTeam);

  ['1yr', '5yr'].forEach(window => {
    const scored = scoredByWindow[window];
    const container = containers[window];
    if (!container) return;

    let html = '';
    scored.forEach((t, i) => {
      const rank = i + 1;
      const tier = getTier(rank);
      const movement = getRankMovement(t, window, ranksByTeam);
      const verdict = getTeamVerdict(t, window);
      const writeup = getTeamWriteup(t, window, rank, ranksByTeam);
      const ranks = ranksByTeam[teamKey(t)] || {};
      const profile = getTimelineLabel(t, ranks);
      const riskScore = getRiskScore(t);
      const topFive = t.topPlayers.slice(0, 5);
      const youngAssets = t.topPlayers.filter(p => p.rank && p.age < 25 && p.rank <= 150).slice(0, 5);
      const winNowPieces = t.topPlayers.filter(p => p.seasonRank && p.seasonRank <= 120).slice(0, 5);

      const cardId = `card-${window}-${i}`;

      if (rank === 1 || rank === 4 || rank === 8) {
        html += `<div class="tier-divider ${tier.cls}">${tier.label}</div>`;
      }

      html += `<div class="pr-card pr-card--ranking" onclick="document.getElementById('${cardId}').style.display = document.getElementById('${cardId}').style.display === 'none' ? 'block' : 'none'; this.querySelector('.expand-icon').textContent = document.getElementById('${cardId}').style.display === 'none' ? '▶' : '▼';">
        <div class="pr-card-main">
          <div class="pr-rank">${rank}</div>
          <div class="pr-team">
            <div class="pr-team-title">
              <h3>${t.name}</h3>
              <span class="profile-pill">${profile}</span>
              <span class="movement-badge ${movement.cls}">${movement.label}</span>
            </div>
            <p>${verdict}</p>
          </div>
          <div class="pr-score">
            <div>${t.powerScore.toFixed(1)}</div>
            <span>Power Score</span>
          </div>
          <span class="expand-icon">▶</span>
        </div>
        <div id="${cardId}" class="pr-card-detail">
          <p class="team-writeup">${writeup}</p>
          <div class="signal-bars">
            ${scoreBar('Star Power', t.starScore)}
            ${scoreBar('Depth', t.depthScore)}
            ${scoreBar('Young Stars', t.youngStarsScore)}
            ${scoreBar('Win-Now Value', t.winNowScore)}
            ${scoreBar('Risk', riskScore, 'risk')}
          </div>
          <div class="signal-grid">
            <div><span>Top-15 Avg</span><strong>${t.avgTop15.toFixed(1)}</strong></div>
            <div><span>Top End</span><strong>${t.topEndScore.toFixed(0)}/100</strong></div>
            <div><span>Depth</span><strong>${t.depthScore.toFixed(0)}/100</strong></div>
            <div><span>Top 100</span><strong>${t.top100Count}</strong></div>
            <div><span>Young Core</span><strong>${t.youngCoreCount}</strong></div>
            <div><span>Unranked</span><strong>${t.unrankedCount}</strong></div>
          </div>
          <div class="driver-grid">
            ${renderDriverGroup('Top 5 Drivers', topFive, 'No ranked players found')}
            ${renderDriverGroup('Young Assets', youngAssets, 'No young top-150 assets')}
            ${renderDriverGroup('Win-Now Pieces', winNowPieces, 'No top-120 current-season pieces')}
          </div>
        </div>
      </div>`;
    });

    container.innerHTML = html;
  });
}
