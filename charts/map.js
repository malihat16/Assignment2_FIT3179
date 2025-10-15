// charts/map.js
import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG } from './constants.js';
import { volcanoLayer } from './volcanoLayer.js';

export const mapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: MAP_WIDTH, height: MAP_HEIGHT, config: BASE_CONFIG,
  title: {text: "Global Earthquakes (2000–2025, M≥6.0)"},
  projection: {type: "equalEarth"},
  params: [
    {
      name: "yearSel",
      value: DEFAULT_YEAR,
      bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " }
    }
  ],
  layer: [
    {
      data: { url: "data/countries-110m.json", format: { type: "topojson", feature: "countries" } },
      mark: { type: "geoshape", fill: "#f7f7f7", stroke: "#ddd" }
    },
    {
      data: { url: "data/plate_boundaries.geojson", format: { type: "geojson" } },
      mark: { type: "geoshape", fill: null, stroke: "#cc3b3b", strokeWidth: 1 },
      encoding: { tooltip: [{ field: "TYPE", title: "Boundary" }] }
    },

    // 🔹 Volcano points (new)
    volcanoLayer,

    {
      data: { url: "data/earthquakes_2000_2025_m6.csv" },
      transform: [
        { calculate: "year(datum.time)", as: "year" },
        { filter: "datum.year == yearSel" }
      ],
      mark: { type: "circle", opacity: 0.75, stroke: "#111", strokeWidth: 0.2 },
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude:  { field: "latitude",  type: "quantitative" },
        size:   { field: "mag",   type: "quantitative", title: "Magnitude", scale: { range: [10, 1000] } },
        color:  { field: "depth", type: "quantitative", title: "Depth (km)", scale: { scheme: "turbo" } },
        tooltip: [
          { field: "time",  title: "Time" },
          { field: "mag",   title: "Magnitude" },
          { field: "depth", title: "Depth (km)" },
          { field: "place", title: "Location" }
        ]
      }
    }
  ]
};
