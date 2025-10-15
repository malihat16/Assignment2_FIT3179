// charts/topCountries.js
// Renders a Top-5 countries bar chart with a year slider.
// Needs d3-geo and topojson-client loaded in the page.

export async function initTopCountries(containerId = '#top5') {
  // 0) Guards
  if (typeof d3 === 'undefined' || !d3.geoContains) {
    throw new Error('d3-geo not loaded. Add <script src="https://cdn.jsdelivr.net/npm/d3-geo@3"></script> before visualisation.js');
  }
  if (typeof topojson === 'undefined' || !topojson.feature) {
    throw new Error('topojson-client not loaded. Add <script src="https://unpkg.com/topojson-client@3"></script> before visualisation.js');
  }

  // 1) Load data
  const [topology, eqCsv] = await Promise.all([
    fetch('data/countries-110m.json').then(r => r.json()),
    fetch('data/earthquakes_2000_2025_m6.csv').then(r => r.text())
  ]);

  // 2) Build country features
  const countriesObj = topology.objects.countries || topology.objects.countries110m || topology.objects.ne_110m_admin_0_countries;
  if (!countriesObj) {
    throw new Error('Could not find "countries" object in countries-110m.json');
  }
  const countries = topojson.feature(topology, countriesObj).features;

  // Helper: choose a readable country name if available (world-atlas often has only id)
  const nameOf = f =>
    (f.properties && (f.properties.name || f.properties.ADMIN || f.properties.name_long)) ||
    String(f.id);

  // 3) Parse quake CSV quickly
  const rows = eqCsv.trim().split(/\r?\n/);
  const hdr = rows.shift().split(',');
  const iTime = hdr.indexOf('time');
  const iLat  = hdr.indexOf('latitude');
  const iLon  = hdr.indexOf('longitude');
  if (iTime < 0 || iLat < 0 || iLon < 0) {
    throw new Error('CSV must contain headers: time, latitude, longitude');
  }

  // 4) Count by year & country via point-in-polygon
  //    (We skip quakes in oceans — OK for a “countries struck” view.)
  const byYear = new Map(); // year -> Map(country -> count)

  for (const line of rows) {
    if (!line) continue;
    const cols = splitCSV(line);
    const t = new Date(cols[iTime]);
    if (Number.isNaN(t)) continue;
    const year = t.getUTCFullYear();

    const lat = +cols[iLat], lon = +cols[iLon];
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    // find the first country polygon containing the point
    let country = null;
    for (const f of countries) {
      // Skip Antarctica (optional)
      const n = nameOf(f);
      if (n === 'Antarctica') continue;
      if (d3.geoContains(f, [lon, lat])) { country = n; break; }
    }
    if (!country) continue;

    if (!byYear.has(year)) byYear.set(year, new Map());
    const m = byYear.get(year);
    m.set(country, (m.get(country) || 0) + 1);
  }

  // 5) UI container
  const root = document.querySelector(containerId);
  root.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
      <label for="yearTop">Year:</label>
      <input id="yearTop" type="range" min="2000" max="2025" step="1" value="2011"/>
      <span id="yearTopVal" style="min-width:3ch;display:inline-block;text-align:right;">2011</span>
    </div>
    <div id="top5Chart"></div>
  `;
  const slider = root.querySelector('#yearTop');
  const label  = root.querySelector('#yearTopVal');

  async function render(year) {
    label.textContent = year;
    const m = byYear.get(+year) || new Map();
    const arr = [...m.entries()].map(([country, count]) => ({ country, count }));
    arr.sort((a,b) => b.count - a.count);
    const top5 = arr.slice(0, 5);

    const spec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      width: 520, height: 280,
      title: { text: `Top 5 Countries by Quakes (M≥6.0) — ${year}` },
      data: { values: top5 },
      mark: "bar",
      encoding: {
        x: { field: "count", type: "quantitative", title: "Count" },
        y: { field: "country", type: "nominal", sort: "-x", title: null },
        tooltip: [{ field: "country" }, { field: "count" }]
      }
    };
    await vegaEmbed('#top5Chart', spec, {actions:false});
  }

  slider.addEventListener('input', e => render(e.target.value));
  await render(slider.value);
}

// CSV splitter that tolerates simple quoted fields
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
