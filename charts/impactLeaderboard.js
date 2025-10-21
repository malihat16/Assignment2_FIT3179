// charts/impactLeaderboard.js
import { BASE_CONFIG, HIST_WIDTH as WIDTH, HIST_HEIGHT as HEIGHT } from './constants.js';

export const impactLeaderboardSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: WIDTH, height: HEIGHT + 40,
  title: { text: "Top Countries by Impact (2000–2025, NOAA)", subtitle: "Toggle: Deaths or Damage", ...BASE_CONFIG.title },
  config: { ...BASE_CONFIG, view: { stroke: null } },

  params: [
    { name: "metric",
      value: "Deaths",
      bind: { input: "select", options: ["Deaths","Damage (M)"], name: "Metric: " } }
  ],

  data: { url: "data/noaa_impact_2000_2025_m6.csv" },

  transform: [
    // Heuristic country extraction: take the bit before the first ':' and trim
    { calculate: "replace(split(datum['Location Name'], ':')[0], /^\\s+|\\s+$/g, '')", as: "countryGuess" },

    // Fold to long format so we can toggle the metric
    { fold: [
        { field: "Total Deaths", as: "Deaths" },
        { field: "Total Damage ($Mil)", as: "Damage (M)" }
      ], as: ["metricName","value"] },

    // Keep only the selected metric
    { filter: "datum.metricName == metric" },

    // Sum by country for the chosen metric
    { aggregate: [{ op: "sum", field: "value", as: "total" }], groupby: ["countryGuess"] },

    // Rank and keep top 15
    { window: [{ op: "rank", as: "rank" }], sort: [{ field: "total", order: "descending" }] },
    { filter: "datum.rank <= 15" }
  ],

  mark: { type: "bar", tooltip: true },

  encoding: {
    y: { field: "countryGuess", type: "nominal", sort: "-x", title: "" },
    x: { field: "total", type: "quantitative",
         title: { signal: "metric == 'Deaths' ? 'Deaths' : 'Damage (USD, M)'" } },
    color: { value: "#374151" },
    tooltip: [
      { field: "countryGuess", title: "Country" },
      { field: "total", title: { signal: "metric == 'Deaths' ? 'Deaths' : 'Damage (USD, M)'" } }
    ]
  }
};
