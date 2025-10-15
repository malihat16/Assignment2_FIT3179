// visualisations/histMag.js
import { HIST_WIDTH, HIST_HEIGHT, BASE_CONFIG } from './constants.js';

export const histSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: HIST_WIDTH, height: HIST_HEIGHT, config: BASE_CONFIG,
  title: {text: "Magnitude Distribution (2000–2025, M≥6.0)"},
  data: {url: "data/earthquakes_2000_2025_m6.csv"},
  mark: "bar",
  encoding: {
    x: {bin: {step: 0.2}, field: "mag", type: "quantitative", title: "Magnitude"},
    y: {aggregate: "count", type: "quantitative", title: "Count"},
    tooltip: [{aggregate: "count", title: "Quakes"}]
  }
};
