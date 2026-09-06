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
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }

async function renderStandings(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading standings</div>';

  let rows;
  const snap = window.CD ? await CD.load('standings') : null;
  if (snap && snap.rows && snap.rows.length) {
    rows = snap.rows;
  } else {
    const teamMap = await buildTeamMap();
    if (!Object.keys(teamMap).length) { el.innerHTML = '<p class="loading">Standings unavailable.</p>'; return; }
    rows = Object.values(teamMap).map(t => ({ name: t.name, handle: '', wins: t.wins, losses: t.losses, pf: t.pf, pa: t.pa }))
      .sort((a, b) => (b.wins - a.wins) || (b.pf - a.pf));
  }
  const handles = window.CD ? await CD.handles() : {};

  const played = rows.some(r => r.wins || r.losses);
  let html = `<div class="table-scroll"><table class="data-table">
    <thead><tr><th>#</th><th>Owner</th><th>W</th><th>L</th><th>PF</th><th>PA</th></tr></thead><tbody>`;
  rows.forEach((t, i) => {
    const h = t.handle || handles[t.name] || '';
    html += `<tr>
      <td><span class="rank-num">${i + 1}</span></td>
      <td class="strong">${esc(t.name)}${h ? `<span class="handle">${esc(h)}</span>` : ''}</td>
      <td>${t.wins}</td><td>${t.losses}</td>
      <td>${played ? Number(t.pf).toFixed(1) : '&ndash;'}</td>
      <td>${played ? Number(t.pa).toFixed(1) : '&ndash;'}</td>
    </tr>`;
  });
  el.innerHTML = html + '</tbody></table></div>';
}

// ===== Render Matchups =====
async function renderMatchups(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading matchups</div>';

  let week, games;
  const snap = window.CD ? await CD.load('matchups') : null;
  if (snap && snap.games && snap.games.length) {
    week = snap.week;
    games = snap.games.map(g => ({ n1: g.a.name, s1: g.a.pts, n2: g.b.name, s2: g.b.pts }));
  } else {
    const league = await getLeague();
    if (!league) { el.innerHTML = '<p class="loading">Matchups unavailable.</p>'; return; }
    week = league.settings?.leg || 1;
    const [matchups, teamMap] = await Promise.all([getMatchups(week), buildTeamMap()]);
    if (!matchups || !matchups.length) { el.innerHTML = '<p class="loading">No matchups this week.</p>'; return; }
    const groups = {};
    matchups.forEach(m => { (groups[m.matchup_id] = groups[m.matchup_id] || []).push(m); });
    games = Object.values(groups).filter(p => p.length === 2).map(p => ({
      n1: (teamMap[p[0].roster_id] || {}).name || 'Team ?', s1: p[0].points || 0,
      n2: (teamMap[p[1].roster_id] || {}).name || 'Team ?', s2: p[1].points || 0,
    }));
  }

  const played = games.some(g => g.s1 || g.s2);
  let html = `<p class="section-sub">Week ${week}</p>`;
  games.forEach(g => {
    html += `<div class="matchup-card">
      <div class="matchup-team"><div>${esc(g.n1)}</div>${played ? `<div class="matchup-score">${Number(g.s1).toFixed(1)}</div>` : ''}</div>
      <div class="matchup-vs">vs</div>
      <div class="matchup-team right"><div>${esc(g.n2)}</div>${played ? `<div class="matchup-score">${Number(g.s2).toFixed(1)}</div>` : ''}</div>
    </div>`;
  });
  el.innerHTML = html;
}

// ===== Render Transactions =====
async function renderTransactions(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<div class="loading">Loading transactions</div>';

  let items;
  const snap = window.CD ? await CD.load('transactions') : null;
  if (snap && snap.trades && snap.trades.length) {
    items = snap.trades.slice(0, 8).map(t => ({
      label: 'Trade', cls: 'trade',
      text: (t.parties || []).join(' &harr; '),
      date: t.created ? new Date(t.created).toLocaleDateString() : (t.season + '')
    }));
  } else {
    const league = await getLeague();
    if (!league) { el.innerHTML = '<p class="loading">Transactions unavailable.</p>'; return; }
    const week = league.settings?.leg || 1;
    const teamMap = await buildTeamMap();
    let all = [];
    for (let w = week; w >= Math.max(1, week - 3); w--) {
      const tx = await getTransactions(w);
      if (tx) all = all.concat(tx);
    }
    all.sort((a, b) => b.created - a.created);
    items = all.slice(0, 8).map(tx => {
      const type = tx.type || 'unknown';
      return {
        label: type === 'free_agent' ? 'FA' : type.charAt(0).toUpperCase() + type.slice(1),
        cls: type === 'trade' ? 'trade' : type === 'waiver' ? 'waiver' : 'fa',
        text: (tx.roster_ids || []).map(r => (teamMap[r] || {}).name || '?').join(' &harr; '),
        date: new Date(tx.created).toLocaleDateString()
      };
    });
  }

  if (!items.length) { el.innerHTML = '<p class="loading">No recent transactions.</p>'; return; }
  el.innerHTML = '<div class="tx-list">' + items.map(t =>
    `<div class="tx-item"><span class="tx-type ${t.cls}">${t.label}</span>` +
    `<span class="tx-text">${t.text}</span><span class="tx-date">${t.date}</span></div>`
  ).join('') + '</div>';
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
