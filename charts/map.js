import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG } from './constants.js';
import { volcanoLayer } from './volcanoLayer.js';

export const mapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: MAP_WIDTH, height: MAP_HEIGHT, config: BASE_CONFIG,
  title: { text: "Global Earthquakes (2000–2025, M≥6.0)" },
  projection: { type: "equalEarth" },
  params: [
    { name: "yearSel", value: DEFAULT_YEAR,
      bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " } }
  ],
  layer: [
    // Graticules for subtle structure
    {
      data: { graticule: true },
      mark: { type: "geoshape", stroke: "#e9ecef", fill: null }
    },
    // Basemap
    {
      data: { url: "data/countries-110m.json",
              format: { type: "topojson", feature: "countries" } },
      mark: { type: "geoshape", fill: "#f8f9fb", stroke: "#dcdcdc", strokeWidth: 0.8 }
    },
    // Plate boundaries (slightly softer red)
    {
      data: { url: "data/plate_boundaries.geojson", format: { type: "geojson" } },
      mark: { type: "geoshape", fill: null, stroke: "#e45756", strokeWidth: 1 }
    },
    // Volcano points (already created)
    volcanoLayer,
    // Earthquakes
    {
      data: { url: "data/earthquakes_2000_2025_m6.csv" },
      transform: [
        { calculate: "year(datum.time)", as: "year" },
        { filter: "datum.year == yearSel" }
      ],
      mark: { type: "circle", opacity: 0.85, stroke: "white", strokeWidth: 0.6 },
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude:  { field: "latitude",  type: "quantitative" },
        size: {
          field: "mag", type: "quantitative", title: "Magnitude",
          // cap both ends so sizes feel balanced
          domain: [6, 9.2], range: [20, 900]
        },
        color: {
          field: "depth", type: "quantitative", title: "Depth (km)",
          scale: { scheme: "viridis" } // calmer than turbo, still readable
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
    // move legends together, out of the way
    color: { legend: { orient: "right" } },
    size:  { legend: { orient: "right" } }
  }
};
