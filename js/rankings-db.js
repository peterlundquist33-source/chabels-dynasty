/* Chabels Dynasty — shared hand-maintained player ranking tables.
   Loaded from data/rankings-*.json (dated snapshots, one paste to update).

   Consumed by the trade analyzer (js/trades-engine.js) and the analytics
   age / value views. The power-rankings board does NOT use this — it is built
   server-side by tools/power.py. */
var DYNASTY_DB = [];                 // data/rankings-dynasty.json  (Hashtag points-league dynasty)
var CURRENT_SEASON_POINTS_DB = [];   // data/rankings-season.json   (Hashtag current-season points)
var DIZZLE_DYNASTY_POINTS_DB = [];   // data/rankings-dizzle.json    (Dizzle dynasty points)

// rank -> value points (higher = better). Kept for anything still valuing a
// player straight off a dynasty rank.
function rankToValue(rank) {
  if (!rank || rank > 450) return 0.5;
  if (rank <= 10) return 100 - (rank - 1) * 5;
  if (rank <= 30) return 55 - (rank - 10) * 1.5;
  if (rank <= 60) return 25 - (rank - 30) * 0.5;
  if (rank <= 120) return 10 - (rank - 60) * 0.1;
  if (rank <= 160) return 4 - (rank - 120) * 0.05;
  if (rank <= 220) return 2 - (rank - 160) * 0.02;
  if (rank <= 450) return 0.8 - (rank - 220) * 0.002;
  return 0.5;
}

(function () {
  if (!window.CD) return;
  CD.rankingDbs = (async function () {
    const [s, d, z] = await Promise.all([
      CD.load("rankings-season"), CD.load("rankings-dynasty"), CD.load("rankings-dizzle")
    ]);
    if (s && s.players) CURRENT_SEASON_POINTS_DB = s.players;
    if (d && d.players) DYNASTY_DB = d.players;
    if (z && z.players) DIZZLE_DYNASTY_POINTS_DB = z.players;
    const asof = document.getElementById("rankings-asof");
    if (asof && d && d.as_of) asof.textContent = "Player values as of " + d.as_of + ".";
    return { season: CURRENT_SEASON_POINTS_DB, dynasty: DYNASTY_DB, dizzle: DIZZLE_DYNASTY_POINTS_DB };
  })();
})();
