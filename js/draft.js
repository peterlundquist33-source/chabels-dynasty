/* Chabels Dynasty — render the rookie board from data/rookies.json.
   The prospect list is hand-maintained: update data/rookies.json (one paste
   from the Dizzle sheet) and bump its "as_of". */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function card(p) {
    var stats = Object.keys(p.stats || {}).map(function (k) {
      return '<div class="stat-item"><span class="stat-value">' + esc(p.stats[k]) +
             '</span><span class="stat-label">' + esc(k) + "</span></div>";
    }).join("");
    return '<div class="prospect-card">' +
      '<div class="prospect-header">' +
        '<div class="prospect-pick">' + esc(p.pick_badge) + "</div>" +
        "<div>" +
          '<span class="pick-number">Pick ' + esc(p.pick_no) + "</span>" +
          '<div class="prospect-name">' + esc(p.name) + "</div>" +
          '<div class="prospect-meta">' + esc(p.meta) + "</div>" +
        "</div>" +
        (p.team ? '<span class="pick-team">' + esc(p.team) + "</span>" : "") +
        (p.grade ? '<div class="prospect-grade">' + esc(p.grade) + "</div>" : "") +
      "</div>" +
      (stats ? '<div class="prospect-stats">' + stats + "</div>" : "") +
      (p.analysis ? '<p class="prospect-analysis"><strong>Dizzle rank:</strong> ' + esc(p.analysis) + "</p>" : "") +
      (p.outlook ? '<p class="prospect-note"><strong>Dizzle outlook:</strong> ' + esc(p.outlook) + "</p>" : "") +
    "</div>";
  }

  async function render() {
    var el = document.getElementById("rookie-board");
    if (!el) return;
    var data = window.CD ? await CD.load("rookies") : null;
    if (!data || !data.rounds) {
      el.innerHTML = '<p class="loading">Prospect board unavailable.</p>';
      return;
    }
    el.innerHTML = data.rounds.map(function (r) {
      return '<div class="draft-round-title">' + esc(r.title) + "</div>" +
             (r.picks || []).map(card).join("");
    }).join("");
    var asof = document.getElementById("rookie-asof");
    if (asof && data.as_of) asof.textContent = "Base: " + data.as_of + " · shared by Peter.";
  }

  render();
})();
