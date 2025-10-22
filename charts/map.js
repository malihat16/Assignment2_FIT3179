import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG } from './constants.js';

export const mapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  projection: { type: "equirectangular" },
  config: { ...BASE_CONFIG, view: { stroke: null }, padding: { bottom: 1 } },

  /* add a helper slider to filter tiny quakes if you want */
  params: [
    { name: "yearSel", value: DEFAULT_YEAR,
      bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " } },
    { name: "magMin", value: 6,
      bind: { input: "range", min: 6, max: 9.2, step: 0.1, name: "Min Magnitude: " } }   // ← optional
  ],

  layer: [
    // oceans
    {
      data: { url: "data/ne_50m_ocean.json",
              format: { type: "topojson", feature: "ne_50m_ocean" } },
      mark: { type: "geoshape", fill: "#f3fdffff" }
    },
    // countries
    {
      data: { url: "data/ne_50m_admin_0_countries.json",
              format: { type: "topojson", feature: "ne_50m_admin_0_countries" } },
      mark: { type: "geoshape", fill: "#fff1d2ff", stroke: "#e9dbbdff" }
    },
    // graticule
    { data: { graticule: { step: [30, 30] } },
      mark: { type: "geoshape", stroke: "#DCDCDC" } },
    // ocean labels
    {
      data: { values: [
        { name: "Atlantic Ocean", longitude: -40, latitude:  15 },
        { name: "Pacific Ocean",  longitude: -140, latitude:   0 },
        { name: "Pacific Ocean",  longitude:  160, latitude: -10 },
        { name: "Indian Ocean",   longitude:   80, latitude: -20 },
        { name: "Southern Ocean", longitude:    0, latitude: -62 },
        { name: "Arctic Ocean",   longitude:    0, latitude:  72 }
      ]},
      mark: { type: "text", fontSize: 14, fontStyle: "italic", fill: "#3A59D1" },
      encoding: {
        longitude: { field: "longitude", type: "quantitative" },
        latitude:  { field: "latitude",  type: "quantitative" },
        text:      { field: "name" }
      }
    },

    // --- EARTHQUAKES (with color ramp by magnitude; dark = stronger) ---
    {
      data: { url: "data/earthquakes_2000_2025_m6.csv" },
      transform: [
        { calculate: "toNumber(datum.longitude)", as: "lon" },
        { calculate: "toNumber(datum.latitude)",  as: "lat" },
        { calculate: "toNumber(datum.mag)",       as: "magN" },
        { calculate: "toNumber(datum.depth)",     as: "depthN" },
        { calculate: "year(toDate(datum.time))",  as: "year" },
        { filter: "isValid(datum.lon) && isValid(datum.lat) && isValid(datum.year)" },
        { filter: "datum.year == yearSel" },
        { filter: "datum.magN >= magMin" }  // ← optional threshold slider
      ],
      mark: { type: "circle", strokeWidth: 0.8, opacity: 0.85 },
      encoding: {
        longitude: { field: "lon", type: "quantitative" },
        latitude:  { field: "lat", type: "quantitative" },

        // size still tied to magnitude (small = weaker, big = stronger)
        size: {
          field: "magN", type: "quantitative", title: "Magnitude (size)",
          domain: [6, 9.2], range: [18, 160],
          legend: null
        },

        // COLOR = magnitude with CVD-safe palette
        color: {
          field: "magN",
          type: "quantitative",
          title: "Magnitude (color)",
          scale: {
            type: "threshold",
            domain: [6.5, 7, 7.5, 8, 8.5],                  // bin edges
            range: ["#D3D3D3","#ffcccc","#ff9999","#ff6666","#cc0000","#990000"],
            clamp: true
          },
          legend: {
            orient: "right",
            labelFormat: ".1f"                              // labels will show bin ranges
          }
        }
,
        stroke: { value: "#ffffff" },  // thin white halo for contrast

        tooltip: [
          { field: "time",   title: "Time" },
          { field: "place",  title: "Location" },
          { field: "magN",   title: "Magnitude" },
          { field: "depthN", title: "Depth (km)" }
        ]
      }
    }
  ]
};
