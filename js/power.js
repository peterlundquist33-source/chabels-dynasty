/* Chabels Dynasty — render the win-now power board from data/power.json.
   The board is built by tools/power.py on a schedule (roster strength from
   Hashtag's current-season points ranks, blended with real league results as
   games are played). This file only draws what that job produced. */
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
      "</tr>";
  }

  function card(t, i) {
    var id = "pw-" + i;
    var lineup = (t.lineup || []).map(slotRow).join("");
    var bench = (t.bench_top || []).length
      ? '<p class="pw-bench"><span>Depth</span> ' + t.bench_top.map(esc).join(" &middot; ") + "</p>"
      : "";
    var gaps = (t.gaps || []).length
      ? '<p class="pw-gaps"><span>Thin at</span> ' + t.gaps.map(esc).join(", ") + "</p>"
      : "";
    var rs = (t.results_score != null)
      ? '<div class="pw-split"><b>' + t.roster_score + "</b><span>roster</span></div>" +
        '<div class="pw-split"><b>' + t.results_score + "</b><span>results</span></div>"
      : "";

    return '<div class="pr-card pr-card--ranking" onclick="var d=document.getElementById(\'' + id +
      "');var o=d.style.display==='block';d.style.display=o?'none':'block';this.querySelector('.expand-icon').textContent=o?'\\u25B6':'\\u25BC';\">" +
      '<div class="pr-card-main">' +
        '<div class="pr-rank">' + t.rank + "</div>" +
        '<div class="pr-team">' +
          '<div class="pr-team-title"><h3>' + esc(t.name) + "</h3>" +
            (t.handle ? '<span class="profile-pill">@' + esc(t.handle) + "</span>" : "") +
            movementBadge(t.movement) + "</div>" +
          "<p>" + esc(t.blurb || "") + "</p>" +
        "</div>" +
        '<div class="pr-score"><div>' + t.score + "</div><span>Power</span></div>" +
        '<span class="expand-icon">\u25B6</span>' +
      "</div>" +
      '<div id="' + id + '" class="pr-card-detail">' +
        (rs ? '<div class="pw-splits">' + rs + "</div>" : "") +
        gaps + bench +
        '<table class="pw-lineup"><thead><tr><th>Slot</th><th>Best available</th><th>Rank</th></tr></thead><tbody>' +
        lineup + "</tbody></table>" +
      "</div>" +
    "</div>";
  }

  function subtitle(d) {
    if (!d.games_per_team) {
      return "Preseason \u2014 a pure roster projection. Once games tip off, real results start bending the board.";
    }
    var pct = Math.round((d.results_weight || 0) * 100);
    return d.games_per_team + " games in \u00b7 real results now carry " + pct +
      "% of each score, roster strength the rest.";
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
      asof.textContent = "Roster values: " + (d.as_of || "current-season points ranks") +
        (when ? " \u00b7 board refreshed " + when : "") +
        (d.games_per_team ? " \u00b7 week " + d.week : "");
    }
  }

  render();
})();
