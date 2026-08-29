// ============================================
// CHABELS DYNASTY — Rarity Gate
// Name the most obscure NBA player you can think of
// ============================================

function normalizeGateName(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function checkGate() {
  return sessionStorage.getItem('chabels_rarity_gate') === 'true';
}

function showGate() {
  const overlay = document.createElement('div');
  overlay.id = 'gate-overlay';
  overlay.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;padding:1rem;">
      <div style="max-width:440px;width:100%;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:0.75rem;">🏀</div>
        <h1 style="font-size:clamp(1.4rem,5vw,2rem);font-weight:700;color:#d4af37;letter-spacing:2px;margin-bottom:0.4rem;">CHABELS DYNASTY</h1>
        <p style="color:#999;font-size:0.75rem;letter-spacing:3px;text-transform:uppercase;margin-bottom:1.5rem;">Rebound &bull; Execute &bull; Defend</p>
        <div style="background:#1a1a1a;border:1px solid rgba(212,175,55,0.3);border-radius:12px;padding:1.25rem;margin-bottom:1rem;">
          <p style="color:#fff;font-size:1rem;font-weight:600;margin-bottom:0.4rem;">Name an NBA Player</p>
          <p style="color:#999;font-size:0.85rem;margin-bottom:1rem;">The more obscure, the better. All-time. Any era.</p>
          <div style="position:relative;">
            <input type="text" id="gate-input" placeholder="Type a player name..." style="width:100%;background:#0a0a0a;border:2px solid #333;color:#fff;padding:0.75rem 0.75rem;border-radius:8px;font-size:1rem;font-family:inherit;text-align:center;box-sizing:border-box;" autocomplete="off" autocapitalize="words">
            <div id="gate-suggestions" style="display:none;position:absolute;left:0;right:0;top:100%;background:#1a1a1a;border:1px solid #d4af37;border-top:none;border-radius:0 0 8px 8px;max-height:200px;overflow-y:auto;z-index:9999;"></div>
          </div>
          <div id="gate-result" style="margin-top:1rem;display:none;"></div>
          <button id="gate-btn" onclick="tryRarity()" style="margin-top:1.25rem;width:100%;padding:0.85rem;background:#d4af37;color:#000;border:none;border-radius:8px;font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all 0.3s;">Check Rarity</button>
        </div>
        <p style="color:#555;font-size:0.7rem;">5,000+ NBA players in the database. Can you find a 90+?</p>
      </div>
    </div>
  `;
  document.body.prepend(overlay);
  document.body.style.overflow = 'hidden';
  
  setTimeout(() => document.getElementById('gate-input').focus(), 100);
  
  const gateInput = document.getElementById('gate-input');
  const sugBox = document.getElementById('gate-suggestions');
  
  gateInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') { sugBox.style.display = 'none'; tryRarity(); }
  });
  
  // Autocomplete suggestions — use both input and keyup for maximum compatibility
  function handleAutocomplete() {
    var val = document.getElementById('gate-input').value.trim().toLowerCase();
    var sug = document.getElementById('gate-suggestions');
    if (!sug) return;
    if (val.length < 2) { sug.style.display = 'none'; return; }
    if (typeof NBA_ALL_TIME === 'undefined') { sug.style.display = 'none'; return; }
    
    // Build name list from keys each time (safe, no caching issues)
    var keys = Object.keys(NBA_ALL_TIME);
    if (keys.length === 0) { sug.style.display = 'none'; return; }
    
    var matches = [];
    // Search through keys directly
    for (var i = 0; i < keys.length && matches.length < 6; i++) {
      if (keys[i].indexOf(val) === 0) {
        // Title case it
        var tc = keys[i].replace(/\b\w/g, function(c){ return c.toUpperCase(); });
        matches.push(tc);
      }
    }
    if (matches.length < 6) {
      for (var j = 0; j < keys.length && matches.length < 6; j++) {
        if (keys[j].indexOf(val) > 0) {
          var tc2 = keys[j].replace(/\b\w/g, function(c){ return c.toUpperCase(); });
          if (matches.indexOf(tc2) === -1) matches.push(tc2);
        }
      }
    }
    
    if (matches.length === 0) { sug.style.display = 'none'; return; }
    
    sug.style.display = 'block';
    var html = '';
    for (var k = 0; k < matches.length; k++) {
      var m = matches[k];
      html += '<div style="padding:0.5rem 0.75rem;color:#ccc;font-size:0.9rem;cursor:pointer;text-align:left;border-bottom:1px solid #2a2a2a;" '
        + 'onmouseover="this.style.background=\'#2a2a2a\'" '
        + 'onmouseout="this.style.background=\'transparent\'" '
        + 'ontouchstart="this.style.background=\'#2a2a2a\'" '
        + 'data-name="' + m.replace(/"/g, '&quot;') + '"'
        + '>' + m + '</div>';
    }
    sug.innerHTML = html;
    
    // Add click handlers
    sug.querySelectorAll('div').forEach(function(el) {
      el.addEventListener('click', function() {
        document.getElementById('gate-input').value = this.getAttribute('data-name');
        document.getElementById('gate-suggestions').style.display = 'none';
      });
      el.addEventListener('touchend', function(e) {
        e.preventDefault();
        document.getElementById('gate-input').value = this.getAttribute('data-name');
        document.getElementById('gate-suggestions').style.display = 'none';
      });
    });
  }
  
  gateInput.addEventListener('input', handleAutocomplete);
  gateInput.addEventListener('keyup', handleAutocomplete);
  
  // Hide suggestions on outside click
  document.addEventListener('click', function(e) {
    if (e.target !== gateInput) { var s = document.getElementById('gate-suggestions'); if(s) s.style.display = 'none'; }
  });
}

function tryRarity() {
  const input = document.getElementById('gate-input');
  const result = document.getElementById('gate-result');
  const btn = document.getElementById('gate-btn');
  const name = input.value.trim();
  
  if (!name) {
    result.style.display = 'block';
    result.innerHTML = '<p style="color:#ff4444;font-size:0.9rem;">Type a name first.</p>';
    return;
  }
  
  const normalized = normalizeGateName(name);
  
  if (typeof NBA_ALL_TIME === 'undefined') {
    result.style.display = 'block';
    result.innerHTML = '<p style="color:#ff4444;font-size:0.9rem;">Player database still loading...</p>';
    return;
  }
  
  const player = NBA_ALL_TIME[normalized];
  
  if (!player) {
    result.style.display = 'block';
    result.innerHTML = `
      <p style="color:#ff4444;font-size:0.9rem;margin-bottom:0.5rem;">❌ "${name}" not found in the NBA database.</p>
      <p style="color:#666;font-size:0.8rem;">Try the full name (first and last).</p>
    `;
    input.style.borderColor = '#ff4444';
    return;
  }
  
  const pts = player[0];
  const score = player[1];
  
  // Determine reaction
  let reaction, emoji, color, barColor;
  if (score <= 5) {
    reaction = "Really? That's the best you got? Everyone knows that guy.";
    emoji = "😐"; color = "#ff4444"; barColor = "#ff4444";
  } else if (score <= 15) {
    reaction = "Casual. Your grandma could've named this player.";
    emoji = "😑"; color = "#ff6644"; barColor = "#ff6644";
  } else if (score <= 30) {
    reaction = "Decent pick. You watch some basketball.";
    emoji = "🤷"; color = "#ffaa44"; barColor = "#ffaa44";
  } else if (score <= 50) {
    reaction = "Not bad. You're getting into the weeds.";
    emoji = "👀"; color = "#ffdd44"; barColor = "#ffdd44";
  } else if (score <= 65) {
    reaction = "Okay, I see you. That's a deep pull.";
    emoji = "😏"; color = "#aadd44"; barColor = "#aadd44";
  } else if (score <= 80) {
    reaction = "Deep cut. You might actually know ball.";
    emoji = "🔥"; color = "#44cc44"; barColor = "#44cc44";
  } else if (score <= 90) {
    reaction = "Certified hooper historian. Respect.";
    emoji = "💀"; color = "#44ddaa"; barColor = "#44ddaa";
  } else if (score <= 95) {
    reaction = "WHO?! You're a basketball sicko.";
    emoji = "🤯"; color = "#44aaff"; barColor = "#44aaff";
  } else {
    reaction = "Absolutely unhinged. You win. Legend status.";
    emoji = "👑"; color = "#d4af37"; barColor = "#d4af37";
  }
  
  const ptsFormatted = pts.toLocaleString();
  
  input.style.borderColor = color;
  result.style.display = 'block';
  result.innerHTML = `
    <div style="margin:1rem 0;">
      <div style="font-size:2.5rem;margin-bottom:0.5rem;">${emoji}</div>
      <div style="display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-bottom:0.5rem;">
        <span style="color:${color};font-size:2.5rem;font-weight:700;">${score}</span>
        <span style="color:#666;font-size:1rem;">/100</span>
      </div>
      <div style="background:#333;border-radius:50px;height:12px;width:100%;margin:0.75rem 0;overflow:hidden;">
        <div style="background:${barColor};height:100%;width:${score}%;border-radius:50px;transition:width 1s ease;"></div>
      </div>
      <p style="color:${color};font-size:0.95rem;font-weight:600;margin-bottom:0.25rem;">${reaction}</p>
      <p style="color:#666;font-size:0.8rem;">${name} — ${ptsFormatted} career points</p>
    </div>
  `;
  
  // Change button to "Enter" or "Try Again"
  btn.innerHTML = score >= 50 ? "Enter the League 🏆" : "Try Again (or Enter Anyway)";
  btn.onclick = function() {
    // Always let them in
    sessionStorage.setItem('chabels_rarity_gate', 'true');
    sessionStorage.setItem('chabels_rarity_score', score);
    sessionStorage.setItem('chabels_rarity_player', name);
    showGrandEntrance();
  };
}

function showGrandEntrance() {
  const overlay = document.getElementById('gate-overlay');
  overlay.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden;padding:1rem;">
      <div style="text-align:center;position:relative;">
        <style>
          @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
          @keyframes goldPulse { 0%,100% { text-shadow: 0 0 20px rgba(212,175,55,0.3); } 50% { text-shadow: 0 0 40px rgba(212,175,55,0.8), 0 0 80px rgba(212,175,55,0.3); } }
          @keyframes lineExpand { from { width:0; } to { width:200px; } }
          @keyframes ringReveal { from { opacity:0; transform:scale(0.5) rotate(-10deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
          @keyframes statSlide { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
          .entrance-trophy { animation: ringReveal 0.8s ease-out forwards; font-size: 5rem; opacity:0; }
          .entrance-title { animation: fadeUp 0.8s ease-out 0.3s forwards; opacity:0; }
          .entrance-motto { animation: fadeUp 0.6s ease-out 0.6s forwards; opacity:0; }
          .entrance-line { animation: lineExpand 0.8s ease-out 0.8s forwards; width:0; }
          .entrance-stats { animation: fadeIn 0.6s ease-out 1.0s forwards; opacity:0; }
          .entrance-stat { animation: statSlide 0.4s ease-out forwards; opacity:0; }
          .entrance-stat:nth-child(1) { animation-delay: 1.2s; }
          .entrance-stat:nth-child(2) { animation-delay: 1.4s; }
          .entrance-stat:nth-child(3) { animation-delay: 1.6s; }
          .entrance-stat:nth-child(4) { animation-delay: 1.8s; }
          .entrance-champs { animation: fadeUp 0.6s ease-out 2.2s forwards; opacity:0; }
          .entrance-enter { animation: fadeUp 0.6s ease-out 2.8s forwards; opacity:0; }
          .entrance-title-text { animation: goldPulse 2s ease-in-out 1.2s infinite; }
        </style>
        
        <div class="entrance-trophy" style="line-height:1;">🏀</div>
        
        <div class="entrance-title" style="margin:1rem 0 0.25rem;">
          <h1 class="entrance-title-text" style="font-size:clamp(1.8rem,6vw,3.5rem);font-weight:700;color:#d4af37;letter-spacing:2px;">CHABELS DYNASTY</h1>
        </div>
        
        <div class="entrance-motto">
          <p style="color:#999;font-size:0.9rem;letter-spacing:4px;text-transform:uppercase;">Rebound &bull; Execute &bull; Defend</p>
        </div>
        
        <div style="display:flex;justify-content:center;margin:1.5rem 0;">
          <div class="entrance-line" style="height:2px;background:linear-gradient(90deg,transparent,#d4af37,transparent);"></div>
        </div>
        
        <div class="entrance-stats" style="display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;margin:1.25rem 0;">
          <div class="entrance-stat" style="text-align:center;min-width:60px;">
            <div style="font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:#d4af37;">10</div>
            <div style="font-size:0.6rem;color:#666;text-transform:uppercase;letter-spacing:1px;">Teams</div>
          </div>
          <div class="entrance-stat" style="text-align:center;min-width:60px;">
            <div style="font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:#d4af37;">3</div>
            <div style="font-size:0.6rem;color:#666;text-transform:uppercase;letter-spacing:1px;">Seasons</div>
          </div>
          <div class="entrance-stat" style="text-align:center;min-width:60px;">
            <div style="font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:#d4af37;">3</div>
            <div style="font-size:0.6rem;color:#666;text-transform:uppercase;letter-spacing:1px;">Champs</div>
          </div>
          <div class="entrance-stat" style="text-align:center;min-width:60px;">
            <div style="font-size:clamp(1.5rem,4vw,2rem);font-weight:700;color:#d4af37;">0</div>
            <div style="font-size:0.6rem;color:#666;text-transform:uppercase;letter-spacing:1px;">Repeats</div>
          </div>
        </div>
        
        <div class="entrance-champs">
          <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap;margin:0.75rem 0;">
            <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:0.5rem 0.8rem;text-align:center;flex:1;min-width:90px;max-width:150px;">
              <div style="font-size:0.55rem;color:#666;text-transform:uppercase;letter-spacing:1px;">2023-24</div>
              <div style="color:#d4af37;font-weight:700;font-size:clamp(0.75rem,2.5vw,0.9rem);">🏆 Chris/Mitch</div>
            </div>
            <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:0.5rem 0.8rem;text-align:center;flex:1;min-width:90px;max-width:150px;">
              <div style="font-size:0.55rem;color:#666;text-transform:uppercase;letter-spacing:1px;">2024-25</div>
              <div style="color:#d4af37;font-weight:700;font-size:clamp(0.75rem,2.5vw,0.9rem);">🏆 Nolan</div>
            </div>
            <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:0.5rem 0.8rem;text-align:center;flex:1;min-width:90px;max-width:150px;">
              <div style="font-size:0.55rem;color:#666;text-transform:uppercase;letter-spacing:1px;">2025-26</div>
              <div style="color:#d4af37;font-weight:700;font-size:clamp(0.75rem,2.5vw,0.9rem);">🏆 Logan</div>
            </div>
          </div>
          <p style="color:#555;font-size:0.8rem;margin-top:0.75rem;font-style:italic;">Three seasons. Three champions. No dynasty... yet.</p>
        </div>
        
        <div class="entrance-enter" style="margin-top:2rem;">
          <button onclick="dismissEntrance()" style="padding:0.85rem 2.5rem;background:transparent;color:#d4af37;border:2px solid #d4af37;border-radius:50px;font-size:1rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='#d4af37';this.style.color='#000';" onmouseout="this.style.background='transparent';this.style.color='#d4af37';">Enter the League</button>
        </div>
      </div>
    </div>
  `;
}

function dismissEntrance() {
  sessionStorage.setItem('chabels_rarity_gate', 'true');
  var overlay = document.getElementById('gate-overlay');
  overlay.style.transition = 'opacity 0.8s';
  overlay.style.opacity = '0';
  setTimeout(function() {
    overlay.remove();
    document.body.style.overflow = '';
  }, 800);
}

// On page load — skip rarity question, show grand entrance only
if (!checkGate()) {
  document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.createElement('div');
    overlay.id = 'gate-overlay';
    overlay.innerHTML = '<div></div>';
    document.body.prepend(overlay);
    document.body.style.overflow = 'hidden';
    showGrandEntrance();
  });
}
