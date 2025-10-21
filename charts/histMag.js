// charts/histMag.js
// import { HIST_WIDTH, HIST_HEIGHT, BASE_CONFIG } from './constants.js';

// export const histSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   width: HIST_WIDTH, height: HIST_HEIGHT,
//   config: BASE_CONFIG,
//   title: { text: "Magnitude Distribution (2000–2025, M≥6.0)" },
//   data: { url: "data/earthquakes_2000_2025_m6.csv" },
//   layer: [
//     // bars
//     {
//       mark: "bar",
//       encoding: {
//         x: { bin: { step: 0.2 }, field: "mag", type: "quantitative", title: "Magnitude" },
//         y: { aggregate: "count", type: "quantitative", title: "Count" },
//         tooltip: [{ aggregate: "count", title: "Quakes" }]
//       }
//     },
//     // peak-bin label (fixed)
//     {
//       transform: [
//         { bin: { step: 0.2 }, field: "mag", as: "mag_bin" },
//         { aggregate: [{ op: "count", as: "cnt" }], groupby: ["mag_bin"] },
//         { joinaggregate: [{ op: "max", field: "cnt", as: "maxCnt" }] },
//         { filter: "datum.cnt == datum.maxCnt" },
//         { calculate: "(datum.mag_bin.start + datum.mag_bin.end)/2", as: "xmid" }
//       ],
//       mark: { type: "text", dy: -6, align: "center", fontStyle: "italic" },
//       encoding: {
//         x: { field: "xmid", type: "quantitative" },
//         y: { field: "cnt", type: "quantitative" },
//         text: { value: "Peak bin" }
//       }
//     }
//   ]
// };

// charts/histMag.js
import { HIST_WIDTH, HIST_HEIGHT, BASE_CONFIG } from './constants.js';

export const histSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: HIST_WIDTH,
  height: HIST_HEIGHT,
  title: { text: " " },
  config: {
    ...BASE_CONFIG,
    axis: {
      labelFont: "Aldrich",
      titleFont: "Aldrich",
      gridColor: "#eef2f6"
    }
  },
  data: { url: "data/earthquakes_2000_2025_m6.csv" },

  layer: [
    // 1) BARS — this layer OWNS the axes (ensures x-axis shows)
    {
      mark: { type: "bar", color: "#446b99", stroke: "#2c4a6e", strokeWidth: 0.5 },
      encoding: {
        x: {
          bin: { step: 0.2 },
          field: "mag",
          type: "quantitative",
          title: "Magnitude",
          scale: { domain: [6, 9.4], nice: false }, // keep 0.2 alignment
          axis: {
            tickMinStep: 0.2,      // <= ask for 0.2 spacing
            format: ".1f",
            labelAngle: 0,
            labelOverlap: "greedy",
            domain: true, ticks: true, grid: true
          }
        },

        y: {
          aggregate: "count",
          type: "quantitative",
          title: "Count",
          axis: { domain: true, ticks: true, grid: true }
        },
        tooltip: [
          { aggregate: "count", type: "quantitative", title: "Quakes" },
          { bin: { step: 0.2 }, field: "mag", type: "quantitative", title: "Bin start" }
        ]
      }
    },

    // 2) Subtle tail band for rare ≥8.0 events (does NOT own axes)
    {
      data: { values: [{ x0: 8.0, x1: 9.6 }] },
      mark: { type: "rect", color: "#b4530940", opacity: 0.14, clip: true },
      encoding: {
        x:  { field: "x0", type: "quantitative", axis: null },
        x2: { field: "x1" }
      }
    },
    {
      data: { values: [{ x: 9.35, note: "Rare 'great' earthquakes (≥8.0)" }] },
      mark: { type: "text", align: "right", dy: -6, font: "Aldrich", fontSize: 11, fill: "#6b7280" },
      encoding: {
        x:    { field: "x", type: "quantitative", axis: null },
        y:    { value: 0 },
        text: { field: "note" }
      }
    },

    // 3) 7.0 threshold (annotation only; never owns an axis)
    {
      data: { values: [{ x: 7.0, label: "≥7.0 often considered major" }] },
      layer: [
        {
          mark: { type: "rule", strokeDash: [4,4], stroke: "#7a869a" },
          encoding: { x: { field: "x", type: "quantitative", axis: null } }
        },
        {
          mark: { type: "text", dy: -6, align: "center", font: "Aldrich", fontSize: 11, fill: "#4b5563" },
          encoding: {
            x: { field: "x", type: "quantitative", axis: null },
            y: { value: 0 },
            text: { field: "label" }
          }
        }
      ]
    },

    // 4) Peak bin label (auto) — shares the x/y from layer 1 so axes stay
    {
      transform: [
        { bin: { step: 0.2 }, field: "mag", as: "mag_bin" },
        { aggregate: [{ op: "count", as: "cnt" }], groupby: ["mag_bin"] },
        { joinaggregate: [{ op: "sum", field: "cnt", as: "tot" }] },
        { joinaggregate: [{ op: "max", field: "cnt", as: "maxCnt" }] },
        { filter: "datum.cnt == datum.maxCnt" },
        { calculate: "(datum.mag_bin.start + datum.mag_bin.end)/2", as: "xmid" },
        { calculate: "round(datum.cnt*100/datum.tot)", as: "pct" },
        {
          calculate:
            "format(datum.mag_bin.start, '.1f') + '–' + format(datum.mag_bin.end, '.1f') + ': ' + datum.cnt + ' (' + datum.pct + '%)'",
          as: "label"
        }
      ],
      mark: { type: "text", dy: -6, align: "center", font: "Aldrich", fontSize: 12, fill: "#2b7a0b" },
      encoding: {
        x: { field: "xmid", type: "quantitative" },
        y: { field: "cnt",  type: "quantitative" },
        text: { field: "label" }
      }
    }
  ]
};
