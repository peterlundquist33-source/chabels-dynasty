/* ============================================
   CHABELS DYNASTY — Sleeper API Integration
   ============================================ */

// ===== LEAGUE CONFIG =====
// Replace with your actual Sleeper league ID
const LEAGUE_ID = '1354592185370034176';
const SLEEPER_BASE = 'https://api.sleeper.app/v1';

// ===== API Helpers =====
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Fetch failed: ${url}`, err);
    return null;
  }
}

// ===== Core Data Fetchers =====
async function getLeague() {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}`);
}

async function getRosters() {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}/rosters`);
}

async function getUsers() {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}/users`);
}

async function getMatchups(week) {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}/matchups/${week}`);
}

async function getTransactions(week) {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}/transactions/${week}`);
}

async function getDrafts() {
  return fetchJSON(`${SLEEPER_BASE}/league/${LEAGUE_ID}/drafts`);
}

async function getPlayerInfo(playerId) {
  return fetchJSON(`${SLEEPER_BASE}/players/nba/${playerId}`);
}

// ===== Owner Names =====
const OWNER_NAMES = {1:'Peter',2:'CJ',3:'Schommer',4:'Schu',5:'Noah',6:'Nolan',7:'Logan',8:'Kaleb',9:'Christian/Mitch',10:'Austin'};

// ===== Build Team Map (roster_id → owner name) =====
async function buildTeamMap() {
  const [rosters, users] = await Promise.all([getRosters(), getUsers()]);
  if (!rosters || !users) return {};

  const userMap = {};
  users.forEach(u => {
    userMap[u.user_id] = u.metadata?.team_name || u.display_name || u.username;
  });

  const teamMap = {};
  rosters.forEach(r => {
    teamMap[r.roster_id] = {
      name: OWNER_NAMES[r.roster_id] || userMap[r.owner_id] || `Team ${r.roster_id}`,
      wins: r.settings?.wins || 0,
      losses: r.settings?.losses || 0,
      pf: (r.settings?.fpts || 0) + (r.settings?.fpts_decimal || 0) / 100,
      pa: (r.settings?.fpts_against || 0) + (r.settings?.fpts_against_decimal || 0) / 100,
      roster_id: r.roster_id
    };
  });

  return teamMap;
}

// ===== Render Standings =====
async function renderStandings(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading standings</div>';

  const teamMap = await buildTeamMap();
  if (!Object.keys(teamMap).length) {
    el.innerHTML = '<p style="color:#999;">Unable to load standings. Check league ID.</p>';
    return;
  }

  const teams = Object.values(teamMap).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pf - a.pf;
  });

  let html = `<table class="data-table">
    <thead><tr>
      <th>#</th><th>Team</th><th>W</th><th>L</th><th>PF</th><th>PA</th>
    </tr></thead><tbody>`;

  teams.forEach((t, i) => {
    html += `<tr>
      <td><span class="rank-num">${i + 1}</span></td>
      <td style="font-weight:600;color:#fff;">${t.name}</td>
      <td>${t.wins}</td><td>${t.losses}</td>
      <td>${t.pf.toFixed(1)}</td><td>${t.pa.toFixed(1)}</td>
    </tr>`;
  });

  html += '</tbody></table>';
  el.innerHTML = html;
}

// ===== Render Matchups =====
async function renderMatchups(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading matchups</div>';

  const league = await getLeague();
  if (!league) { el.innerHTML = '<p style="color:#999;">Unable to load matchups.</p>'; return; }

  const week = league.settings?.leg || 1;
  const [matchups, teamMap] = await Promise.all([
    getMatchups(week),
    buildTeamMap()
  ]);

  if (!matchups || !matchups.length) {
    el.innerHTML = '<p style="color:#999;">No matchups this week.</p>';
    return;
  }

  // Group by matchup_id
  const groups = {};
  matchups.forEach(m => {
    const mid = m.matchup_id;
    if (!groups[mid]) groups[mid] = [];
    groups[mid].push(m);
  });

  let html = `<p style="color:#999;margin-bottom:1rem;font-size:0.85rem;">Week ${week}</p>`;
  Object.values(groups).forEach(pair => {
    if (pair.length < 2) return;
    const t1 = teamMap[pair[0].roster_id] || { name: 'Team ?' };
    const t2 = teamMap[pair[1].roster_id] || { name: 'Team ?' };
    const s1 = pair[0].points || 0;
    const s2 = pair[1].points || 0;

    html += `<div class="matchup-card" style="margin-bottom:0.75rem;">
      <div class="matchup-team">
        <div>${t1.name}</div>
        <div class="matchup-score">${s1.toFixed(1)} pts</div>
      </div>
      <div class="matchup-vs">VS</div>
      <div class="matchup-team right">
        <div>${t2.name}</div>
        <div class="matchup-score">${s2.toFixed(1)} pts</div>
      </div>
    </div>`;
  });

  el.innerHTML = html;
}

// ===== Render Transactions =====
async function renderTransactions(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading transactions</div>';

  const league = await getLeague();
  if (!league) { el.innerHTML = '<p style="color:#999;">Unable to load.</p>'; return; }

  const week = league.settings?.leg || 1;
  const teamMap = await buildTeamMap();

  // Fetch last few weeks of transactions
  let allTx = [];
  for (let w = week; w >= Math.max(1, week - 3); w--) {
    const tx = await getTransactions(w);
    if (tx) allTx = allTx.concat(tx);
  }

  allTx.sort((a, b) => b.created - a.created);
  allTx = allTx.slice(0, 10);

  if (!allTx.length) {
    el.innerHTML = '<p style="color:#999;">No recent transactions.</p>';
    return;
  }

  let html = '<div class="tx-list">';
  allTx.forEach(tx => {
    const type = tx.type || 'unknown';
    const typeClass = type === 'trade' ? 'trade' : type === 'waiver' ? 'waiver' : 'fa';
    const typeLabel = type === 'free_agent' ? 'FA' : type.charAt(0).toUpperCase() + type.slice(1);
    const rId = tx.roster_ids?.[0];
    const team = teamMap[rId]?.name || 'Unknown';
    const date = new Date(tx.created).toLocaleDateString();

    html += `<div class="tx-item">
      <span class="tx-type ${typeClass}">${typeLabel}</span>
      <span class="tx-text">${team}</span>
      <span class="tx-date">${date}</span>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

// ===== Render Power Rankings =====
async function renderPowerRankings(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading power rankings</div>';

  const teamMap = await buildTeamMap();
  if (!Object.keys(teamMap).length) {
    el.innerHTML = '<p style="color:#999;">Unable to load.</p>';
    return;
  }

  // Simple power score: 40% win%, 30% recent PF, 30% overall PF
  const teams = Object.values(teamMap).map(t => {
    const totalGames = t.wins + t.losses || 1;
    const winPct = t.wins / totalGames;
    const pfScore = t.pf / totalGames;
    t.power = (winPct * 0.4) + (pfScore / 200 * 0.3) + (pfScore / 200 * 0.3);
    return t;
  });

  teams.sort((a, b) => b.power - a.power);

  let html = '';
  teams.forEach((t, i) => {
    html += `<div class="pr-card">
      <div class="pr-rank">${i + 1}</div>
      <div class="pr-info">
        <h3>${t.name}</h3>
        <p>${t.wins}-${t.losses} &nbsp;|&nbsp; ${t.pf.toFixed(1)} PF &nbsp;|&nbsp; ${t.pa.toFixed(1)} PA</p>
      </div>
    </div>`;
  });

  el.innerHTML = html;
}

// ===== Nav Toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Active nav — top-level links
  const page = (window.location.pathname.split('/').pop() || 'index.html').split('#')[0];
  document.querySelectorAll('.nav-links > a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  // Active nav — dropdown items; if any match, also mark the toggle
  const dropdownPages = ['rankings.html', 'analytics.html', 'awards.html', 'history.html'];
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdownToggle && dropdown) {
    dropdownToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function() {
      dropdown.classList.remove('open');
    });
    dropdown.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  document.querySelectorAll('.nav-dropdown-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
      if (dropdownToggle) dropdownToggle.classList.add('active');
    }
  });
  // Also mark toggle active if current page is any dropdown page
  if (dropdownToggle && dropdownPages.includes(page)) {
    dropdownToggle.classList.add('active');
  }
});
