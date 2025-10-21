// // charts/lineChart.js
// import { LINE_WIDTH, LINE_HEIGHT, BASE_CONFIG } from './constants.js';

// export const lineSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   width: LINE_WIDTH,
//   height: LINE_HEIGHT,
//   title: { text: " " },

//   config: {
//     ...BASE_CONFIG,
//     axis: {
//       labelFont: "Aldrich",
//       titleFont: "Aldrich",
//       grid: true,
//       gridColor: "#e9edf2",
//       tickColor: "#ccd6e0"
//     },
//     legend: { orient: "right", offset: 16, title: null, labelFont: "Aldrich", titleFont: "Aldrich" }
//   },

//   // raw file only; all transforms live inside layers
//   data: { url: "data/earthquakes_2000_2025_m6.csv" },

//   layer: [
//     // 1) LINES (this layer OWNS the axes)
//     {
//       transform: [
//         { calculate: "year(toDate(datum.time))", as: "year" },
//         { aggregate: [{ op: "count", as: "count" }], groupby: ["year"] },
//         { window: [{ op: "mean", field: "count", as: "ma3" }], frame: [-1, 1], sort: [{ field: "year" }] },
//         { fold: ["count","ma3"], as: ["series","value"] },
//         { calculate: "datum.series=='count' ? 'Count' : '3-yr avg'", as: "seriesLabel" }
//       ],
//       mark: { type: "line", interpolate: "monotone" },
//       encoding: {
//         x: { field: "year", type: "quantitative",
//              axis: { format: "d", title: "Year" } },
//         y: { field: "value", type: "quantitative",
//              axis: { title: "Earthquakes" } },
//         color: {
//           field: "seriesLabel", type: "nominal",
//           scale: { domain: ["3-yr avg", "Count"], range: ["#365e8d", "#f39c5a"] }
//         },
//         strokeWidth: {
//           condition: { test: "datum.seriesLabel=='Count'", value: 2 },
//           value: 3
//         },
//         opacity: {
//           condition: { test: "datum.seriesLabel=='Count'", value: 0.55 },
//           value: 0.95
//         }
//       }
//     },

//     // 2) POINTS on Count (no axes here)
//     {
//       transform: [
//         { calculate: "year(toDate(datum.time))", as: "year" },
//         { aggregate: [{ op: "count", as: "count" }], groupby: ["year"] }
//       ],
//       mark: { type: "point", filled: true, size: 26, opacity: 0.6, color: "#f39c5a" },
//       encoding: {
//         x: { field: "year", type: "quantitative", axis: null },
//         y: { field: "count", type: "quantitative", axis: null },
//         tooltip: [{ field: "year", format: "d" }, { field: "count", title: "Count" }]
//       }
//     },

//     // 3) EVENT RULES + LABELS (own data; labels sit LOW to avoid clutter)
//     {
//       data: { values: [
//         { year: 2004, note: "2004 Sumatra" },
//         { year: 2011, note: "2011 Tōhoku" }
//       ]},
//       layer: [
//         {
//           mark: { type: "rule", strokeDash: [4,4], stroke: "#7a869a" },
//           encoding: { x: { field: "year", type: "quantitative", axis: null } }
//         },
//         // Place labels near the bottom axis so they never hit the lines/legend
//         {
//           mark: { type: "text", dy: 14, baseline: "top", font: "Aldrich", fontSize: 11, fill: "#4b5563" },
//           encoding: {
//             x: { field: "year", type: "quantitative", axis: null },
//             // y=0 anchors at the horizontal baseline; dy pushes into the plot area
//             y: { value: 0 },
//             text: { field: "note" },
//             align: { value: "center" }
//           }
//         }
//       ]
//     },

//     // 4) AUTO PEAK & LOW labels (computed from Count)
//     {
//       transform: [
//         { calculate: "year(toDate(datum.time))", as: "year" },
//         { aggregate: [{ op: "count", as: "cnt" }], groupby: ["year"] },
//         { joinaggregate: [
//             { op: "max", field: "cnt", as: "maxCnt" },
//             { op: "min", field: "cnt", as: "minCnt" }
//           ]
//         },
//         { calculate: "datum.cnt==datum.maxCnt ? 'peak' : (datum.cnt==datum.minCnt ? 'trough' : null)", as: "which" },
//         { filter: "datum.which != null" }
//       ],
//       layer: [
//         { mark: { type: "point", filled: true, size: 64, color: "#2b7a0b" },
//           encoding: {
//             x: { field: "year", type: "quantitative", axis: null },
//             y: { field: "cnt",  type: "quantitative", axis: null }
//           }
//         },
//         {
//           transform: [
//             { calculate: "datum.which=='peak' ? 'Peak '+datum.cnt : 'Low '+datum.cnt", as: "label" },
//             { calculate: "datum.year >= 2022", as: "isRight" }
//           ],
//           mark: { type: "text", dy: -8, font: "Aldrich", fontSize: 11, color: "#2b7a0b" },
//           encoding: {
//             x:     { field: "year", type: "quantitative", axis: null },
//             y:     { field: "cnt",  type: "quantitative", axis: null },
//             text:  { field: "label" },
//             align: { field: "isRight", type: "nominal",
//                      scale: { domain: [true, false], range: ["right","left"] } },
//             dx:    { field: "isRight", type: "nominal",
//                      scale: { domain: [true, false], range: [-6, 6] } }
//           }
//         }
//       ]
//     }
//   ]
// };

// charts/lineChart.js
// charts/lineChart.js
import { LINE_WIDTH, LINE_HEIGHT, BASE_CONFIG } from './constants.js';

export const lineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: LINE_WIDTH,
  height: LINE_HEIGHT,
  title: { text: " " },

  config: {
    ...BASE_CONFIG,
    axis: {
      labelFont: "Aldrich",
      titleFont: "Aldrich",
      grid: true,
      gridColor: "#e9edf2",
      tickColor: "#ccd6e0",
      labelColor: "#2b3642",
      titleColor: "#2b3642"
    },
    legend: { orient: "right", offset: 12, title: null, labelFont: "Aldrich", titleFont: "Aldrich" }
  },

  data: { url: "data/earthquakes_2000_2025_m6.csv" },

  layer: [
    // 1) LINES — OWNS THE AXES
    {
      transform: [
        { calculate: "year(toDate(datum.time))", as: "year" },
        { aggregate: [{ op: "count", as: "count" }], groupby: ["year"] },
        { window: [{ op: "mean", field: "count", as: "ma3" }], frame: [-1, 1], sort: [{ field: "year" }] },
        { fold: ["count","ma3"], as: ["series","value"] },
        { calculate: "datum.series==='ma3' ? '3-yr avg' : 'Count'", as: "seriesLabel" }
      ],
      mark: { type: "line", interpolate: "monotone", clip: true },
      encoding: {
        x: {
          field: "year", type: "quantitative",
          axis: { title: "Year", format: "d", labelAngle: 0, tickCount: 14 },
          scale: { domain: [2000, 2025] }
        },
        y: {
          field: "value", type: "quantitative",
          axis: { title: "Earthquakes (M≥6.0)" }
        },
        color: {
          field: "seriesLabel", type: "nominal",
          scale: { domain: ["3-yr avg", "Count"], range: ["#365e8d", "#f39c5a"] }
        },
        strokeWidth: {
          condition: { test: "datum.seriesLabel==='Count'", value: 2 },
          value: 3.5
        },
        opacity: {
          condition: { test: "datum.seriesLabel==='Count'", value: 0.45 },
          value: 0.95
        }
      }
    },

    // 2) POINTS ON COUNT — DO NOT DEFINE axis
    {
      transform: [
        { calculate: "year(toDate(datum.time))", as: "year" },
        { aggregate: [{ op: "count", as: "count" }], groupby: ["year"] }
      ],
      mark: { type: "point", filled: true, size: 18, color: "#f39c5a", opacity: 0.6, clip: true },
      encoding: {
        x: { field: "year", type: "quantitative" },
        y: { field: "count", type: "quantitative" },
        tooltip: [{ field: "year", format: "d" }, { field: "count", title: "Count" }]
      }
    },

    // 3) EVENT RULES + LABELS (labels below the plot) — NO axis props
    {
      data: { values: [
        { year: 2004, note: "2004 Sumatra" },
        { year: 2011, note: "2011 Tōhoku" }
      ]},
      layer: [
        { mark: { type: "rule", strokeDash: [4,4], stroke: "#7a869a" },
          encoding: { x: { field: "year", type: "quantitative" } } },
        { mark: { type: "text", dy: 14, baseline: "top", font: "Aldrich", fontSize: 11, fill: "#4b5563" },
          encoding: { x: { field: "year", type: "quantitative" }, y: { value: 0 }, text: { field: "note" }, align: { value: "center" } } }
      ]
    },

    // 4) PEAK & LOW — NO axis props
    {
      transform: [
        { calculate: "year(toDate(datum.time))", as: "year" },
        { aggregate: [{ op: "count", as: "cnt" }], groupby: ["year"] },
        { joinaggregate: [
            { op: "max", field: "cnt", as: "maxCnt" },
            { op: "min", field: "cnt", as: "minCnt" }
          ]},
        { calculate: "datum.cnt===datum.maxCnt ? 'peak' : (datum.cnt===datum.minCnt ? 'trough' : null)", as: "which" },
        { filter: "datum.which != null" }
      ],
      layer: [
        { mark: { type: "point", filled: true, size: 46, color: "#2b7a0b", clip: true },
          encoding: { x: { field: "year", type: "quantitative" }, y: { field: "cnt", type: "quantitative" } } },
        { transform: [
            { calculate: "datum.which==='peak' ? 'Peak '+datum.cnt : 'Low '+datum.cnt", as: "label" },
            { calculate: "datum.year >= 2022", as: "isRight" }
          ],
          mark: { type: "text", dy: -6, font: "Aldrich", fontSize: 11, color: "#2b7a0b", clip: true },
          encoding: {
            x: { field: "year", type: "quantitative" },
            y: { field: "cnt", type: "quantitative" },
            text: { field: "label" },
            align: { field: "isRight", type: "nominal",
                     scale: { domain: [true, false], range: ["right","left"] } },
            dx: { field: "isRight", type: "nominal",
                  scale: { domain: [true, false], range: [-6, 6] } }
          }
        }
      ]
    }
  ]
};
