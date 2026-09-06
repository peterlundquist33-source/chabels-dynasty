/* Chabels Dynasty — snapshot loader.
   Pages read the committed data/*.json first (fast, and works when Sleeper is
   down); render code falls back to a live Sleeper fetch when a file is missing.
   Snapshots are refreshed by .github/workflows/snapshot.yml (tools/snapshot.py). */
window.CD = window.CD || {};
CD._cache = CD._cache || {};

CD.load = async function (name) {
  if (name in CD._cache) return CD._cache[name];
  try {
    const r = await fetch("data/" + name + ".json", { cache: "no-cache" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return (CD._cache[name] = await r.json());
  } catch (e) {
    console.warn("snapshot " + name + " unavailable, falling back to live", e);
    return (CD._cache[name] = null);
  }
};

/* owner name -> Sleeper handle, from data/owners.json (for the "handle" line) */
CD.handles = async function () {
  if (CD._handles) return CD._handles;
  const o = await CD.load("owners");
  const map = {};
  if (o && o.rosters) {
    Object.values(o.rosters).forEach(function (r) { map[r.name] = r.handle; });
  }
  return (CD._handles = map);
};
