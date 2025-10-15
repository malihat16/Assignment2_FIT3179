import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG } from './constants.js';
import { volcanoLayer } from './volcanoLayer.js';

export const mapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: MAP_WIDTH,
  height: MAP_HEIGHT,

  // soft ocean + no view border (keeps your existing BASE_CONFIG)
  config: { 
    ...BASE_CONFIG,
    background: "#EAF3F8",         // light ocean
    view: { stroke: null }
  },

  title: { text: "Global Earthquakes (2000–2025, M≥6.0)" },
  projection: { type: "equalEarth" },

  params: [
    {
      name: "yearSel",
      value: DEFAULT_YEAR,
      bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " }
    }
  ],

  layer: [
    // 1) Graticules — gentle blue-grey lines
    {
      data: { graticule: true },
      mark: { type: "geoshape", stroke: "#C9D6E2", strokeWidth: 1, opacity: 0.65, fill: null }
    },

    // 2) Countries — sandy land with a subtle outline
    {
      data: { url: "data/countries-110m.json",
              format: { type: "topojson", feature: "countries" } },
      mark: { type: "geoshape", filled: true, stroke: "#D7C7A0", strokeWidth: 0.6 },
      encoding: { color: { value: "#F3E5C7" } } // sand/beige
    },

    // 3) Plate boundaries — muted warm red
    {
      data: { url: "data/plate_boundaries.geojson", format: { type: "geojson" } },
      mark: { type: "geoshape", fill: null, stroke: "#C46A6A", strokeWidth: 1 },
      encoding: { opacity: { value: 0.45 } }
    },

    // 4) Volcano points (your existing layer)
    volcanoLayer,

    // 5) Earthquakes — keep your encodings; add a touch more contrast
    {
      data: { url: "data/earthquakes_2000_2025_m6.csv" },
      transform: [
        { calculate: "year(datum.time)", as: "year" },
        { filter: "datum.year == yearSel" }
      ],
      mark: { type: "circle", opacity: 0.85, stroke: "#ffffff", strokeWidth: 0.7 },
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude:  { field: "latitude",  type: "quantitative" },
        size: {
          field: "mag", type: "quantitative", title: "Magnitude",
          domain: [6, 9.2], range: [20, 900] // keep your sizing
        },
        color: {
          field: "depth", type: "quantitative", title: "Depth (km)",
          scale: { scheme: "viridis" } // keep depth palette (works well on sand)
        },
        tooltip: [
          { field: "time",  title: "Time" },
          { field: "mag",   title: "Magnitude" },
          { field: "depth", title: "Depth (km)" },
          { field: "place", title: "Location" }
        ]
      }
    }
  ],

  resolve: { scale: { size: "independent" } },
  encoding: {
    color: { legend: { orient: "right" } },
    size:  { legend: { orient: "right" } }
  }
};
