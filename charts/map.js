// import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG } from './constants.js';
// import { volcanoLayer } from './volcanoLayer.js';

// export const mapSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   width: MAP_WIDTH,
//   height: MAP_HEIGHT,
//   config: {
//     ...BASE_CONFIG,
//     background: "#EAF3F8",
//     view: { stroke: null }
//   },
//   title: { text: "Global Earthquakes (2000–2025, M≥6.0)" },
//   projection: { type: "equalEarth" },

//   params: [
//     {
//       name: "yearSel",
//       value: DEFAULT_YEAR,
//       bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " }
//     }
//   ],

//   layer: [
//     // 1) Graticules
//     {
//       data: { graticule: true },
//       mark: { type: "geoshape", stroke: "#C9D6E2", strokeWidth: 1, opacity: 0.65, fill: null }
//     },

//     // 2) Countries (sand)
//     {
//       data: { url: "data/countries-110m.json", format: { type: "topojson", feature: "countries" } },
//       mark: { type: "geoshape", filled: true, stroke: "#D7C7A0", strokeWidth: 0.6 },
//       encoding: { color: { value: "#F3E5C7" } }
//     },

//     // 3) Plate boundaries (muted)
//     {
//       data: { url: "data/plate_boundaries.geojson", format: { type: "geojson" } },
//       mark: { type: "geoshape", fill: null, stroke: "#C46A6A", strokeWidth: 1 },
//       encoding: { opacity: { value: 0.45 } }
//     },

//     // 4) OCEAN LABELS (italic blue)
//     {
//       data: { values: [
//         { name: "Pacific Ocean", lon: -150, lat: -8 },
//         { name: "Pacific Ocean", lon:  160, lat: -15 },
//         { name: "Atlantic Ocean", lon:  -30, lat:   0 },
//         { name: "Indian Ocean",   lon:   85, lat: -20 },
//         { name: "Arctic Ocean",   lon:   40, lat:  72 },
//         { name: "Southern Ocean", lon:    0, lat: -55 }
//       ]},
//       mark: { type: "text", font: "Bree Serif", fontStyle: "italic", fontSize: 16, opacity: 0.8 },
//       encoding: {
//         longitude: { field: "lon", type: "quantitative" },
//         latitude:  { field: "lat", type: "quantitative" },
//         text:      { field: "name" },
//         color:     { value: "#1B5DB0" }
//       }
//     },

//     // 5) CONTINENT LABELS (soft grey)
//     {
//       data: { values: [
//         { name: "North America", lon: -100, lat:  43 },
//         { name: "South America", lon:  -60, lat: -15 },
//         { name: "Europe",        lon:   15, lat:  50 },
//         { name: "Africa",        lon:   20, lat:   5 },
//         { name: "Asia",          lon:   90, lat:  35 },
//         { name: "Oceania",       lon:  140, lat: -25 }
//       ]},
//       mark: { type: "text", font: "Bree Serif", fontSize: 14, opacity: 0.75 },
//       encoding: {
//         longitude: { field: "lon", type: "quantitative" },
//         latitude:  { field: "lat", type: "quantitative" },
//         text:      { field: "name" },
//         color:     { value: "#6B6B6B" }
//       }
//     },

//     // 6) Volcano points (your existing layer)
//     volcanoLayer,

//     // 7) Earthquakes (by magnitude size, depth colour)
//     {
//       data: { url: "data/earthquakes_2000_2025_m6.csv" },
//       transform: [
//         { calculate: "year(datum.time)", as: "year" },
//         { filter: "datum.year == yearSel" }
//       ],
//       mark: { type: "circle", opacity: 0.85, stroke: "#ffffff", strokeWidth: 0.7 },
//       encoding: {
//         longitude: { field: "longitude", type: "quantitative" },
//         latitude:  { field: "latitude",  type: "quantitative" },
//         size: {
//           field: "mag", type: "quantitative", title: "Magnitude",
//           domain: [6, 9.2], range: [20, 900]
//         },
//         color: {
//           field: "depth", type: "quantitative", title: "Depth (km)",
//           scale: { scheme: "viridis" }
//         },
//         tooltip: [
//           { field: "time",  title: "Time" },
//           { field: "mag",   title: "Magnitude" },
//           { field: "depth", title: "Depth (km)" },
//           { field: "place", title: "Location" }
//         ]
//       }
//     },

//     // 8) Biggest quake annotation (for selected year)
//     {
//       data: { url: "data/earthquakes_2000_2025_m6.csv" },
//       transform: [
//         { calculate: "year(datum.time)", as: "year" },
//         { filter: "datum.year == yearSel" },
//         { window: [{ op: "rank", as: "rk" }], sort: [{ field: "mag", order: "descending" }] },
//         { filter: "datum.rk == 1" },
//         { calculate: "'Biggest quake: M' + format(datum.mag, '.1f')", as: "anno" }
//       ],
//       layer: [
//         { mark: { type: "point", filled: true, shape: "star", size: 120, color: "#7A3B2B", opacity: 0.9 },
//           encoding: { longitude: { field: "longitude" }, latitude: { field: "latitude" } } },
//         { mark: { type: "text", dx: 8, dy: -8, fontStyle: "italic" },
//           encoding: { longitude: { field: "longitude" }, latitude: { field: "latitude" }, text: { field: "anno" } } }
//       ]
//     }
//   ],

//   resolve: { scale: { size: "independent" } },
//   encoding: {
//     color: { legend: { orient: "right" } },
//     size:  { legend: { orient: "right" } }
//   }
// };



import { MAP_WIDTH, MAP_HEIGHT, DEFAULT_YEAR, BASE_CONFIG, MAP_LEGEND_X, MAP_LEGEND_Y } from './constants.js';
// volcano layer removed as requested

export const mapSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: MAP_WIDTH,
  height: MAP_HEIGHT,
  title: { text: "Global Earthquakes (2000–2025, M≥6.0)", fontSize: 24 },
  projection: { type: "equirectangular" },
  config: { ...BASE_CONFIG, view: { stroke: null } },

  params: [
    { name: "yearSel", value: DEFAULT_YEAR,
      bind: { input: "range", min: 2000, max: 2025, step: 1, name: "Year: " } }
  ],

  layer: [
    // Oceans
    {
      data: { url: "data/ne_50m_ocean.json",
              format: { type: "topojson", feature: "ne_50m_ocean" } },
      mark: { type: "geoshape", fill: "#f3fdffff" }
    },

    // Countries
    {
      data: { url: "data/ne_50m_admin_0_countries.json",
              format: { type: "topojson", feature: "ne_50m_admin_0_countries" } },
      mark: { type: "geoshape", fill: "#fff1d2ff", stroke: "#e9dbbdff" }
    },

    // Graticule (30°)
    { data: { graticule: { step: [30, 30] } },
      mark: { type: "geoshape", stroke: "#DCDCDC" } },

    // Ocean labels
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

// --- EARTHQUAKES (TSV parsed correctly, legend outside) ---
    {
      data: {
        url: "data/earthquakes_2000_2025_m6.csv"   // keep your path
        // no format block: we’ll coerce fields ourselves below so TSV/CSV both work
      },
      transform: [
        // hard-cast fields so bad parsing can’t nuke the data
        { calculate: "toNumber(datum.longitude)", as: "lon" },
        { calculate: "toNumber(datum.latitude)",  as: "lat" },
        { calculate: "toNumber(datum.mag)",       as: "magN" },
        { calculate: "toNumber(datum.depth)",     as: "depthN" },
        { calculate: "year(toDate(datum.time))",  as: "year" },
        // drop any rows that failed casts
        { filter: "isValid(datum.lon) && isValid(datum.lat) && isValid(datum.year)" },
        { filter: "datum.year == yearSel" }
      ],
      mark: { type: "circle", strokeWidth: 1, opacity: 0.6 },
      encoding: {
        longitude: { field: "lon",  type: "quantitative" },
        latitude:  { field: "lat",  type: "quantitative" },

        // size by magnitude
        size: {
          field: "magN", type: "quantitative", title: "Magnitude",
          domain: [6, 9.2], range: [20, 160],
          legend: { orient: "right" }  // legend OUTSIDE the map
        },

        // styling to match your reference
        stroke: { value: "#6d1d11ff" },
        color:  { value: "#cc3f29ff" },

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
