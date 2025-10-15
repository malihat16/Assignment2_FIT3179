// charts/topCountries.js (ESM version—no globals needed)
import { geoContains } from "https://cdn.jsdelivr.net/npm/d3-geo@3/+esm";
import { feature as topoFeature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

export async function initTopCountries(containerId = '#top5') {
  const root = document.querySelector(containerId);
  if (!root) return;

  const showError = (msg) => {
    console.error('[Top5]', msg);
    root.innerHTML = `<div style="padding:12px;border:1px solid #e00;background:#fee;color:#900;border-radius:8px">
      <strong>Top-5 Countries:</strong> ${msg}
    </div>`;
  };

  try {
    const [topology, eqTxt] = await Promise.all([
      fetch('data/countries-110m.json').then(r => { if (!r.ok) throw new Error('countries-110m.json not found'); return r.json(); }),
      fetch('data/earthquakes_2000_2025_m6.csv').then(r => { if (!r.ok) throw new Error('earthquakes_2000_2025_m6.csv not found'); return r.text(); })
    ]);

    const firstLine = (eqTxt.split(/\r?\n/)[0] || '').trim();
    const DELIM = firstLine.includes('\t') ? '\t' : ',';

    const lines = eqTxt.trim().split(/\r?\n/);
    if (!lines.length) return showError('Earthquake file is empty.');
    const header = lines.shift().split(DELIM).map(s => s.trim());
    const iTime = header.indexOf('time');
    const iLat  = header.indexOf('latitude');
    const iLon  = header.indexOf('longitude');
    if (iTime < 0 || iLat < 0 || iLon < 0) {
      return showError(`Missing headers. Saw [${header.join(', ')}]; need time, latitude, longitude.`);
    }

    const countriesObj =
      topology.objects.countries ||
      topology.objects.countries110m ||
      topology.objects.ne_110m_admin_0_countries;
    if (!countriesObj) return showError('No "countries" object in countries-110m.json.');
    const countries = topoFeature(topology, countriesObj).features;

    const nameOf = f =>
      (f.properties && (f.properties.name || f.properties.ADMIN || f.properties.name_long)) ||
      String(f.id);

    const byYear = new Map();

    for (const line of lines) {
      if (!line) continue;
      const cols = splitDSV(line, DELIM);
      const t = new Date(cols[iTime]); if (isNaN(t.getTime())) continue;
      const year = t.getUTCFullYear();

      const lat = +cols[iLat], lon = +cols[iLon];
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

      let country = null;
      for (const f of countries) {
        const nm = nameOf(f);
        if (nm === 'Antarctica') continue;
        if (geoContains(f, [lon, lat])) { country = nm; break; }  // <-- geoContains
      }
      if (!country) continue;

      if (!byYear.has(year)) byYear.set(year, new Map());
      const m = byYear.get(year);
      m.set(country, (m.get(country) || 0) + 1);
    }

    root.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
        <label for="yearTop">Year:</label>
        <input id="yearTop" type="range" min="2000" max="2025" step="1" value="2011"/>
        <span id="yearTopVal" style="min-width:3ch;display:inline-block;text-align:right;">2011</span>
      </div>
      <div class="chart" id="top5Chart"></div>
      <div class="sub" id="top5Note" style="margin-top:6px;"></div>
    `;
    const slider = root.querySelector('#yearTop');
    const label  = root.querySelector('#yearTopVal');
    const chartEl = root.querySelector('#top5Chart');
    const noteEl  = root.querySelector('#top5Note');

    async function render(year) {
      label.textContent = year;
      const m = byYear.get(+year) || new Map();
      const arr = [...m.entries()].map(([country, count]) => ({ country, count }))
                                  .sort((a,b) => b.count - a.count)
                                  .slice(0, 5);

      if (!arr.length) { chartEl.innerHTML = ''; noteEl.textContent = 'No country-level matches for this year.'; return; }
      noteEl.textContent = '';

      const spec = {
        $schema: "https://vega.github.io/schema/vega-lite/v5.json",
        width: 520, height: 280,
        title: { text: `Top 5 Countries by Quakes (M≥6.0) — ${year}` },
        data: { values: arr },
        mark: "bar",
        encoding: {
          x: { field: "count", type: "quantitative", title: "Count" },
          y: { field: "country", type: "nominal", sort: "-x", title: null },
          tooltip: [{ field: "country" }, { field: "count" }]
        }
      };
      await vegaEmbed(chartEl, spec, { actions: false });
    }

    slider.addEventListener('input', e => render(e.target.value));
    await render(slider.value);
  } catch (err) {
    showError(err.message || String(err));
  }
}

function splitDSV(line, delim) {
  if (delim === ',') {
    const out = []; let s = '', q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"' && line[i+1] === '"') { s += '"'; i++; continue; }
      if (c === '"') { q = !q; continue; }
      if (c === ',' && !q) { out.push(s); s = ''; continue; }
      s += c;
    }
    out.push(s); return out;
  }
  return line.split('\t');
}
