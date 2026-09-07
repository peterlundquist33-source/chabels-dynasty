/* Chabels Dynasty — render the win-now power board from data/power.json.
   The board is built by tools/power.py on a schedule: a best-lineup roster
   projection (Hashtag 2026-27 points projections, scored with league rules)
   blended with the manager's track record and, once games are played, this
   season's real results. This file only draws what that job produced. */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function movementBadge(m) {
    if (!m) return '<span class="movement-badge neutral">&mdash;</span>';
    var up = m > 0;
    return '<span class="movement-badge ' + (up ? "up" : "down") + '">' +
      '<svg class="icon" aria-hidden="true"><use href="#i-trend-' + (up ? "up" : "down") + '"></use></svg> ' +
      Math.abs(m) + "</span>";
  }

  function slotRow(s) {
    var thin = s.rank == null || s.rank > 115;
    return '<tr' + (thin ? ' class="thin"' : "") + ">" +
      '<td class="lu-slot">' + esc(s.slot) + "</td>" +
      '<td class="lu-name">' + (s.name ? esc(s.name) : "&mdash; empty &mdash;") + "</td>" +
      '<td class="lu-rank">' + (s.rank ? "#" + s.rank : "unranked") + "</td>" +
      '<td class="lu-val">' + (s.value != null ? Math.round(s.value) : "&ndash;") + "</td>" +
      "</tr>";
  }

  // the three inputs behind the number, with this week's weights
  function components(t) {
    var w = t.weights || {};
    var parts = [
      { k: "Roster", v: t.roster_score, w: w.roster },
      { k: "Track record", v: t.history_score, w: w.history },
      { k: "This season", v: t.results_score, w: w.results }
    ];
    var rows = parts.map(function (p) {
      var live = p.w > 0.001 && p.v != null;
      return '<div class="pw-cmp' + (live ? "" : " off") + '">' +
        '<span class="pw-cmp-k">' + p.k + "</span>" +
        '<span class="pw-cmp-v">' + (p.v != null ? p.v : "&mdash;") + "</span>" +
        '<span class="pw-cmp-w">' + Math.round((p.w || 0) * 100) + "%</span>" +
        "</div>";
    }).join("");
    return '<div class="pw-cmps">' + rows + "</div>";
  }

  function resume(t) {
    if (!t.career) return "";
    var bits = ["career " + esc(t.career)];
    if (t.titles) bits.push(t.titles + (t.titles === 1 ? " title" : " titles"));
    if (t.runner_ups) bits.push(t.runner_ups + " finals loss" + (t.runner_ups === 1 ? "" : "es"));
    return '<span class="pw-resume">' + bits.join(" \u00b7 ") + "</span>";
  }

  function card(t, i) {
    var id = "pw-" + i;
    var lineupTotal = (t.lineup || []).reduce(function (a, s) { return a + (s.value || 0); }, 0);
    var lineup = (t.lineup || []).map(slotRow).join("");
    var bench = (t.bench_top || []).length
      ? '<p class="pw-bench"><span>Depth</span> ' + t.bench_top.map(esc).join(" &middot; ") + "</p>"
      : "";
    var gaps = (t.gaps || []).length
      ? '<p class="pw-gaps"><span>Thin at</span> ' + t.gaps.map(esc).join(", ") + "</p>"
      : "";

    return '<div class="pr-card pr-card--ranking" onclick="var d=document.getElementById(\'' + id +
      "');var o=d.style.display==='block';d.style.display=o?'none':'block';this.querySelector('.expand-icon').textContent=o?'\\u25B6':'\\u25BC';\">" +
      '<div class="pr-card-main">' +
        '<div class="pr-rank">' + t.rank + "</div>" +
        '<div class="pr-team">' +
          '<div class="pr-team-title"><h3>' + esc(t.name) + "</h3>" +
            (t.handle ? '<span class="profile-pill">@' + esc(t.handle) + "</span>" : "") +
            movementBadge(t.movement) + resume(t) + "</div>" +
          "<p>" + esc(t.blurb || "") + "</p>" +
        "</div>" +
        '<div class="pr-score"><div>' + t.score + "</div><span>Power</span></div>" +
        '<span class="expand-icon">\u25B6</span>' +
      "</div>" +
      '<div id="' + id + '" class="pr-card-detail">' +
        components(t) +
        gaps + bench +
        '<table class="pw-lineup"><thead><tr><th>Slot</th><th>Best available</th><th>Rank</th><th>Value</th></tr></thead><tbody>' +
        lineup +
        '<tr class="pw-lineup-total"><td></td><td>Starting lineup</td><td></td><td>' +
        Math.round(lineupTotal) + "</td></tr>" +
        "</tbody></table>" +
        '<p class="pw-note">Value = each player\u2019s projected fantasy output in league scoring. ' +
        "The lineup plus bench depth is the Roster score above.</p>" +
      "</div>" +
    "</div>";
  }

  function subtitle(d) {
    var w = d.weights || {};
    if (!d.games_per_team) {
      return "Preseason \u2014 each team\u2019s number is half best-lineup roster projection, " +
        "half manager track record. Real results take over once games tip off.";
    }
    return d.games_per_team + " games in \u00b7 this season\u2019s results now drive " +
      Math.round((w.results || 0) * 100) + "% of each score, roster projection " +
      Math.round((w.roster || 0) * 100) + "%, track record " +
      Math.round((w.history || 0) * 100) + "%.";
  }

  async function render() {
    var el = document.getElementById("power-board");
    if (!el) return;
    var d = window.CD ? await CD.load("power") : null;
    if (!d || !d.board || !d.board.length) {
      el.innerHTML = '<p class="loading">Power board unavailable \u2014 the ranking job has not run yet.</p>';
      return;
    }
    el.innerHTML = '<p class="pw-lede">' + esc(subtitle(d)) + "</p>" +
      d.board.map(card).join("");

    var asof = document.getElementById("power-asof");
    if (asof) {
      var when = (d.generated || "").slice(0, 10);
      asof.textContent = "Roster values: " + (d.as_of || "2026-27 projections, league scoring") +
        (when ? " \u00b7 board refreshed " + when : "") +
        (d.games_per_team ? " \u00b7 week " + d.week : "");
    }
  }

  render();
})();
