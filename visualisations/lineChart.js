// visualisations/lineChart.js
import { LINE_WIDTH, LINE_HEIGHT, BASE_CONFIG } from './constants.js';

export const lineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: LINE_WIDTH, height: LINE_HEIGHT, config: BASE_CONFIG,
  title: {text: "Earthquakes per Year (M≥6.0)"},
  data: {url: "data/earthquakes_2000_2025_m6.csv"},
  transform: [
    {calculate: "year(datum.time)", as: "year"},
    {aggregate: [{op: "count", as: "quakes"}], groupby: ["year"]},
    {window: [{op: "mean", field: "quakes", as: "ma_3yr"}], frame: [-1, 1], sort: [{field: "year"}]}
  ],
  layer: [
    {mark: {type: "line", color: "#888"},
     encoding: {x: {field: "year", type: "temporal", timeUnit: "year"}, y: {field: "quakes", type: "quantitative", title: "Count"}}},
    {mark: {type: "line", strokeDash: [4,2], strokeWidth: 2, color: "#2c7fb8"},
     encoding: {x: {field: "year", type: "temporal", timeUnit: "year"}, y: {field: "ma_3yr", type: "quantitative", title: "3-yr moving average"}}}
  ]
};
