// charts/areaMagClass.js
import { LINE_WIDTH, LINE_HEIGHT, BASE_CONFIG } from './constants.js';

export const areaMagClassSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: LINE_WIDTH,
  height: LINE_HEIGHT,
  config: BASE_CONFIG,
  title: { text: "Quakes by Magnitude Class (per year, M≥6.0)" },
  data: { url: "data/earthquakes_2000_2025_m6.csv" },
  transform: [
    { calculate: "year(datum.time)", as: "year" },
    {
      calculate:
        "datum.mag < 7 ? '6.0–6.9' : (datum.mag < 8 ? '7.0–7.9' : '≥8.0')",
      as: "mag_class"
    },
    { aggregate: [{ op: "count", as: "quakes" }], groupby: ["year", "mag_class"] }
  ],
  mark: { type: "area", interpolate: "monotone" },
  encoding: {
    x: { field: "year", type: "quantitative", title: "Year", sort: "ascending" },
    y: { field: "quakes", type: "quantitative", stack: "normalize", title: "Share of yearly quakes" },
    color: {
      field: "mag_class",
      type: "nominal",
      title: "Magnitude",
      scale: { domain: ["6.0–6.9", "7.0–7.9", "≥8.0"] }
    },
    tooltip: [
      { field: "year", title: "Year" },
      { field: "mag_class", title: "Magnitude class" },
      { field: "quakes", title: "Count" }
    ]
  }
};
