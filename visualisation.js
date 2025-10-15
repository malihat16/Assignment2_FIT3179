// visualisation.js
import { mapSpec } from './visualisations/map.js';
import { lineSpec } from './visualisations/lineChart.js';
import { histSpec } from './visualisations/histMag.js';

const dashboard = {
  resolve: {legend: {color: "independent", size: "independent"}},
  spacing: 24,
  vconcat: [
    mapSpec,
    {"hconcat": [lineSpec, histSpec]}
  ],
  background: "transparent"
};

vegaEmbed('#vis', dashboard, {actions: false});
