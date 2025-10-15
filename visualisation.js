// visualisation.js
import { mapSpec } from './charts/map.js';
import { lineSpec } from './charts/lineChart.js';
import { histSpec } from './charts/histMag.js';
import { areaMagClassSpec } from './charts/areaMagClass.js';
import { initTopCountries } from './charts/topCountries.js';

(async function(){
  await vegaEmbed('#map',  mapSpec,  {actions:false});
  await vegaEmbed('#line', lineSpec, {actions:false});
  await vegaEmbed('#hist', histSpec, {actions:false});
  await vegaEmbed('#areaMag', areaMagClassSpec, {actions:false});
  await initTopCountries('#top5'); // renders slider + bar chart
})();
