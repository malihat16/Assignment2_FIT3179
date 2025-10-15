// charts/topCountries.js
// Requires: <script src="https://cdn.jsdelivr.net/npm/d3-geo@3"></script>
//           <script src="https://unpkg.com/topojson-client@3"></script>

export async function initTopCountries(containerId = '#top5') {
  // 1) Load data
  const [topology, eqCsv] = await Promise.all([
    fetch('data/countries-110m.json').then(r => r.json()),
    fetch('data/earthquakes_2000_2025_m6.csv').then(r => r.text())
  ]);

  const countries = topojson.feature(topology, topology.objects.countries).features;
  // Use a country name property if present; otherwise number id (depends on the world-atlas version)
  const nameOf = f => (f.properties && (f.properties.name || f.properties.ADMIN || f.properties.name_long)) || String(f.id);

  // Parse CSV manually (fast + tiny)
  const rows = eqCsv.trim().split(/\r?\n/);
  const hdr = rows.shift().split(',');
  const idx = {
    time: hdr.indexOf('time'),
    lat: hdr.indexOf('latitude'),
    lon: hdr.indexOf('longitude')
  };

  // 2) Build year -> country -> count
  const byYear = new Map(); // year -> Map(country -> count)
  for (const line of rows) {
    if (!line) continue;
    const cols = splitCSV(line);
    const t = new Date(cols[idx.time]);
    if (isNaN(t)) continue;
    const year = t.getUTCFullYear();
    const lat = +cols[idx.lat], lon = +cols[idx.lon];
    if (!isFinite(lat) || !isFinite(lon)) continue;

    // find containing country (first hit wins)
    let country = null;
    for (const f of countries) {
      if (d3.geoContains(f, [lon, lat])) { country = nameOf(f); break; }
    }
    if (!country) continue; // fell in ocean or Antarctica polygon mismatch

    if (!byYear.has(year)) byYear.set(year, new Map());
    const m = byYear.get(year);
    m.set(country, (m.get(country) || 0) + 1);
  }

  // 3) UI: year slider + label
  const wrap = document.querySelector(containerId);
  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
      <label for="yearTop">Year:</label>
      <input id="yearTop" type="range" min="2000" max="2025" step="1" value="2011"/>
      <span id="yearTopVal">2011</span>
    </div>
    <div id="top5Chart"></div>
  `;
  const slider = wrap.querySelector('#yearTop');
  const label  = wrap.querySelector('#yearTopVal');

  async function render(year) {
    label.textContent = year;
    const m = byYear.get(+year) || new Map();
    const arr = [...m.entries()].map(([country, count]) => ({ country, count }));
    arr.sort((a, b) => b.count - a.count);
    const top5 = arr.slice(0, 5);

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 460, height: 260,
      title: { text: `Top 5 Countries by Quakes (M≥6.0) — ${year}` },
      data: { values: top5 },
      mark: "bar",
      encoding: {
        x: { field: "count", type: "quantitative", title: "Count" },
        y: { field: "country", type: "nominal", sort: "-x", title: null },
        tooltip: [{ field: "country" }, { field: "count" }]
      }
    };
    await vegaEmbed('#top5Chart', spec, { actions: false });
  }

  slider.addEventListener('input', e => render(e.target.value));
  await render(slider.value);
}

// Tiny CSV splitter that respects simple quoted fields
function splitCSV(line) {
  const out = [];
  let s = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"' && line[i+1] === '"') { s += '"'; i++; continue; }
    if (c === '"') { q = !q; continue; }
    if (c === ',' && !q) { out.push(s); s = ''; continue; }
    s += c;
  }
  out.push(s);
  return out;
}
