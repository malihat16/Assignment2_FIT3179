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
  title: { text: "Magnitude Distribution (2000–2025, M≥6.0)" },
  config: {
    ...BASE_CONFIG,
    axis: { labelFont: "Aldrich", titleFont: "Aldrich", gridColor: "#eef2f6" }
  },
  data: { url: "data/earthquakes_2000_2025_m6.csv" },

  layer: [
    // 1) BARS — this layer OWNS the axes
    {
      mark: { type: "bar", color: "#446b99", stroke: "#2c4a6e", strokeWidth: 0.5 },
      encoding: {
        x: {
          bin: { step: 0.2 },
          field: "mag",
          type: "quantitative",
          title: "Magnitude",
          axis: {
            values: [6, 6.5, 7, 7.5, 8, 8.5, 9],
            format: ".1f",
            labelAngle: 0,
            labelOverlap: "greedy",
            tickCount: 7,
            domain: true,
            ticks: true,
            grid: true
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

    // 2) 7.0 threshold (annotation only; never owns an axis)
    {
      data: { values: [{ x: 7.0, label: "≥7.0 often considered major" }] },
      layer: [
        {
          mark: { type: "rule", strokeDash: [4,4], stroke: "#7a869a" },
          encoding: { x: { field: "x", type: "quantitative", axis: null } } // <- won't steal the x-axis
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

    // 3) Peak bin label (auto) — keeps axes from layer 1
    {
      transform: [
        { bin: { step: 0.2 }, field: "mag", as: "mag_bin" },
        { aggregate: [{ op: "count", as: "cnt" }], groupby: ["mag_bin"] },
        { joinaggregate: [{ op: "sum", field: "cnt", as: "tot" }] },
        { joinaggregate: [{ op: "max", field: "cnt", as: "maxCnt" }] },
        { filter: "datum.cnt == datum.maxCnt" },
        { calculate: "(datum.mag_bin.start + datum.mag_bin.end)/2", as: "xmid" },
        { calculate: "round(datum.cnt*100/datum.tot)", as: "pct" },
        { calculate: "format(datum.mag_bin.start, '.1f') + '–' + format(datum.mag_bin.end, '.1f') + ': ' + datum.cnt + ' (' + datum.pct + '%)'", as: "label" }
      ],
      mark: { type: "text", dy: -6, align: "center", font: "Aldrich", fontSize: 12, fill: "#2b7a0b" },
      encoding: {
        x: { field: "xmid", type: "quantitative" },   // shares the same x scale -> axes from layer 1 stay
        y: { field: "cnt", type: "quantitative" },
        text: { field: "label" }
      }
    }
  ]
};
