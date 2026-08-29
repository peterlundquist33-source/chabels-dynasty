// ============================================
// CHABELS DYNASTY — Dynamic Trade Valuation Engine
// Player values from DYNASTY_DB, pick values based on team record
// ============================================

// Team career records for pick valuation (from history page data)
const TEAM_RECORDS = {
  "Peter": { w: 77, l: 43 },
  "CJ": { w: 41, l: 79 },
  "Schommer": { w: 44, l: 76 },
  "Schu": { w: 19, l: 101 },
  "Noah": { w: 78, l: 42 },
  "Nolan": { w: 54, l: 66 },
  "Logan": { w: 80, l: 40 },
  "Kaleb": { w: 85, l: 35 },
  "Christian/Mitch": { w: 71, l: 49 },
  "Austin": { w: 51, l: 69 }
};

// ===== Accent normalization for player matching =====
function normalizeAccentsTrade(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function findPlayerValue(playerName) {
  if (!playerName || typeof DYNASTY_DB === 'undefined') return 0;
  const clean = normalizeAccentsTrade(playerName.toLowerCase().trim());
  const stripSuffix = s => s.replace(/\s+(jr\.?|sr\.?|ii|iii|iv)$/i, '').trim();
  
  let match = DYNASTY_DB.find(d => normalizeAccentsTrade(d.name.toLowerCase()) === clean);
  if (!match) {
    const cleaned = stripSuffix(clean);
    match = DYNASTY_DB.find(d => stripSuffix(normalizeAccentsTrade(d.name.toLowerCase())) === cleaned);
  }
  if (!match) return 0.5; // Unranked player
  return dynastyRankToTradeValue(match.rank);
}

// Convert dynasty rank to trade value — steep curve, top players are hugely valuable
function dynastyRankToTradeValue(rank) {
  if (!rank || rank > 450) return 0.5;
  if (rank <= 5) return 120 - (rank - 1) * 8;       // 120, 112, 104, 96, 88
  if (rank <= 15) return 85 - (rank - 5) * 4;        // 85 → 45
  if (rank <= 30) return 45 - (rank - 15) * 1.5;     // 45 → 22.5
  if (rank <= 60) return 22.5 - (rank - 30) * 0.4;   // 22.5 → 10.5
  if (rank <= 100) return 10.5 - (rank - 60) * 0.15; // 10.5 → 4.5
  if (rank <= 150) return 4.5 - (rank - 100) * 0.05; // 4.5 → 2
  if (rank <= 250) return 2 - (rank - 150) * 0.01;   // 2 → 1
  return 0.5;
}

// ===== Dynamic Pick Valuation =====
// Pick value based on: round + original team's record (worse team = higher pick = more value)
function getPickValue(round, origTeam) {
  const rec = TEAM_RECORDS[origTeam];
  if (!rec) return getBasePickValue(round) * 0.5; // Unknown team
  
  const totalGames = rec.w + rec.l || 1;
  const winPct = rec.w / totalGames;
  
  // Team strength multiplier: worse team = better pick
  // Schu 1st ~60, CJ 1st ~42, mid-team ~32, Kaleb 1st ~10
  const strengthMult = Math.max(0.35, 2.5 - (winPct * 3.0));
  
  return getBasePickValue(round) * strengthMult;
}

// Base pick values — 3rd and 4th rounders are nearly worthless
function getBasePickValue(round) {
  switch(round) {
    case 1: return 28;  // A 1st rounder before team adjustment
    case 2: return 8;   // Moderate
    case 3: return 1.5; // Dart throw
    case 4: return 0.5; // Basically nothing
    default: return 0.5;
  }
}

// ===== Grade Calculation =====
function getTradeGrade(diff) {
  const absDiff = Math.abs(diff);
  if (absDiff < 5)  return { label: "EVEN", color: "#888", bg: "rgba(136,136,136,0.1)", border: "#888" };
  if (absDiff < 15) return { label: "SLIGHT EDGE", color: "#aaa", bg: "rgba(170,170,170,0.1)", border: "#aaa" };
  if (absDiff < 35) return { label: "CLEAR WIN", color: "#ffd700", bg: "rgba(255,215,0,0.1)", border: "#ffd700" };
  if (absDiff < 60) return { label: "ROBBERY", color: "#ff8800", bg: "rgba(255,136,0,0.15)", border: "#ff8800" };
  return { label: "HEIST", color: "#ff4444", bg: "rgba(255,68,68,0.15)", border: "#ff4444" };
}

// ===== Render Trades =====
function renderDynamicTrades(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (typeof TRADES === 'undefined' || typeof DYNASTY_DB === 'undefined') {
    el.innerHTML = '<p style="color:#999;">Trade data not loaded.</p>';
    return;
  }

  // Value each trade
  const valued = TRADES.map(trade => {
    function assetValue(a) {
      if (a.type === 'player') return findPlayerValue(a.name);
      if (a.type === 'pick') {
        // If pick was used and we know the player, value as the player
        if (a.draftedPlayer) return findPlayerValue(a.draftedPlayer);
        // Future pick — use dynamic pick formula
        return getPickValue(a.pickRound, a.pickOrigTeam);
      }
      return 0;
    }
    const s1val = trade.side1.assets.reduce((sum, a) => sum + assetValue(a), 0);
    const s2val = trade.side2.assets.reduce((sum, a) => sum + assetValue(a), 0);
    
    const diff = s2val - s1val;
    const winner = diff > 2 ? trade.side2.team : (diff < -2 ? trade.side1.team : null);
    
    return { ...trade, s1val, s2val, diff, absDiff: Math.abs(diff), winner };
  });

  // Sort by most lopsided first
  valued.sort((a, b) => b.absDiff - a.absDiff);

  // Legend
  let html = `<div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
    <span style="background:rgba(136,136,136,0.1);border:1px solid #888;padding:0.3rem 0.75rem;border-radius:4px;font-size:0.8rem;color:#888;font-weight:700;">EVEN</span>
    <span style="background:rgba(170,170,170,0.1);border:1px solid #aaa;padding:0.3rem 0.75rem;border-radius:4px;font-size:0.8rem;color:#aaa;font-weight:700;">SLIGHT EDGE</span>
    <span style="background:rgba(255,215,0,0.1);border:1px solid #ffd700;padding:0.3rem 0.75rem;border-radius:4px;font-size:0.8rem;color:#ffd700;font-weight:700;">CLEAR WIN</span>
    <span style="background:rgba(255,136,0,0.15);border:1px solid #ff8800;padding:0.3rem 0.75rem;border-radius:4px;font-size:0.8rem;color:#ff8800;font-weight:700;">ROBBERY</span>
    <span style="background:rgba(255,68,68,0.15);border:1px solid #ff4444;padding:0.3rem 0.75rem;border-radius:4px;font-size:0.8rem;color:#ff4444;font-weight:700;">HEIST</span>
  </div>
  <p style="color:var(--gray-text);font-size:0.8rem;margin-bottom:1.5rem;font-style:italic;">
    Player values from Hashtag Basketball Points League Dynasty Rankings. Pick values weighted by round and original team's career record (worse team = higher pick = more value). 3rd/4th rounders valued as dart throws.
  </p>`;

  valued.forEach((t, i) => {
    const grade = getTradeGrade(t.diff);
    const cardId = `trade-card-${i}`;

    function assetHtml(asset) {
      if (asset.type === 'player') {
        const val = findPlayerValue(asset.name).toFixed(1);
        return `<span style="display:inline-block;background:rgba(212,175,55,0.1);padding:2px 8px;border-radius:4px;margin:2px;font-size:0.85rem;"><strong>${asset.name}</strong> <span style="color:var(--gold);font-size:0.75rem;">(${val})</span></span>`;
      } else {
        const val = asset.draftedPlayer ? findPlayerValue(asset.draftedPlayer).toFixed(1) : getPickValue(asset.pickRound, asset.pickOrigTeam).toFixed(1);
        const drafted = asset.draftedPlayer ? ` → <strong>${asset.draftedPlayer}</strong>` : '';
        return `<span style="display:inline-block;background:rgba(100,200,100,0.1);border:1px solid rgba(100,200,100,0.2);padding:2px 8px;border-radius:4px;margin:2px;font-size:0.8rem;color:#7ddf7d;">🎯 ${asset.pickSeason} Rd${asset.pickRound} (${asset.pickOrigTeam}'s)${drafted} <span style="opacity:0.7;">(${val})</span></span>`;
      }
    }

    const s1assets = t.side1.assets.map(assetHtml).join(' ');
    const s2assets = t.side2.assets.map(assetHtml).join(' ');
    
    const winnerText = t.winner 
      ? `<span style="color:${grade.color};font-weight:700;">Winner: ${t.winner}</span> <span style="color:var(--gray-text);font-size:0.8rem;">(+${t.absDiff.toFixed(1)})</span>`
      : `<span style="color:#888;font-weight:700;">Even Trade</span>`;

    html += `<div style="background:var(--dark);border:1px solid rgba(212,175,55,0.12);border-radius:12px;margin-bottom:1rem;overflow:hidden;cursor:pointer;" onclick="var d=document.getElementById('${cardId}');var ic=this.querySelector('.te');d.style.display=d.style.display==='none'?'block':'none';ic.textContent=d.style.display==='none'?'\\u25B6':'\\u25BC';">
      <div style="display:flex;align-items:center;gap:1rem;padding:1rem 1.5rem;">
        <div style="color:var(--gold);font-weight:700;font-size:1.3rem;min-width:35px;">#${i+1}</div>
        <div style="flex:1;"><div style="font-weight:600;margin-bottom:0.15rem;">${t.teams}</div>
          <div style="font-size:0.8rem;color:var(--gray-text);">${t.season} • ${t.date}</div></div>
        <div style="background:${grade.bg};border:1px solid ${grade.border};padding:0.25rem 0.75rem;border-radius:4px;font-size:0.75rem;font-weight:700;color:${grade.color};letter-spacing:1px;">${grade.label}</div>
        <span class="te" style="color:var(--gray-text);font-size:0.8rem;">▶</span></div>
      <div id="${cardId}" style="display:none;padding:0 1.5rem 1.25rem;border-top:1px solid rgba(255,255,255,0.05);">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
          <div><div style="font-weight:600;color:var(--white);margin-bottom:0.5rem;">${t.side1.team} received <span style="color:var(--gold);font-size:0.8rem;">(${t.s1val.toFixed(1)})</span></div>${s1assets}</div>
          <div><div style="font-weight:600;color:var(--white);margin-bottom:0.5rem;">${t.side2.team} received <span style="color:var(--gold);font-size:0.8rem;">(${t.s2val.toFixed(1)})</span></div>${s2assets}</div></div>
        <div style="margin-top:0.75rem;text-align:center;">${winnerText}</div></div></div>`;
  });

  el.innerHTML = html;
}
