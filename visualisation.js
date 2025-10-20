import { mapSpec } from './charts/map.js';
import { lineSpec } from './charts/lineChart.js';
import { histSpec } from './charts/histMag.js';
import { areaMagClassSpec } from './charts/areaMagClass.js';
import { initTopCountries } from './charts/topCountries.js';

function safeEmbed(sel, spec) {
  return vegaEmbed(sel, spec, { actions:false })
    .catch(err => {
      console.error(`[embed error] ${sel}:`, err);
      const el = document.querySelector(sel);
      if (el) el.innerHTML = `<div style="padding:10px;border:1px solid #e00;background:#fee;color:#900;border-radius:8px">
        Failed to render <code>${sel}</code>: ${String(err.message || err)}
      </div>`;
    });
}

(async function () {
  // show menu with just PNG/SVG + open in editor
  const MENU = { actions: { export: true, source: true, compiled: true, editor: true } };

  await vegaEmbed('#map',  mapSpec,  MENU);
  await vegaEmbed('#line', lineSpec, MENU);
  await vegaEmbed('#hist', histSpec, MENU);
  await vegaEmbed('#areaMag', areaMagClassSpec, MENU);

  await initTopCountries('#top5'); // this one renders a nested embed; keep as is
})();
