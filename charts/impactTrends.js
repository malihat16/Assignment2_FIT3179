// charts/impactTrends.js
import { BASE_CONFIG, LINE_WIDTH as WIDTH, LINE_HEIGHT as HEIGHT } from './constants.js';

/**
 * Two stacked rows:
 *  A) Sum of Total Deaths per year (+ 3-yr moving average, dashed) + peak labels (2004, 2010, 2011)
 *  B) Sum of Total Damage ($Mil) per year (+ 3-yr moving average, dashed) + peak labels (2004, 2010, 2011)
 */
export const impactTrendsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  vconcat: [
    // ----- Deaths per year -----
    {
      width: WIDTH,
      height: HEIGHT,
      title: { text: "Deaths from Significant Earthquakes per Year (NOAA)", ...BASE_CONFIG.title },
      config: { ...BASE_CONFIG, view: { stroke: null } },
      data: { url: "data/noaa_impact_2000_2025_m6.csv" },
      transform: [
        { aggregate: [{ op: "sum", field: "Total Deaths", as: "deaths" }], groupby: ["Year"] },
        { calculate: "toNumber(datum.Year)", as: "Y" },
        { window: [{ op: "mean", field: "deaths", as: "ma3" }], frame: [-1, 1], sort: [{ field: "Y", order: "ascending" }] }
      ],
      layer: [
        // actual line
        {
          mark: { type: "line", strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "deaths", type: "quantitative", title: "Deaths" },
            color: { value: "#2b6cb0" }
          }
        },
        // moving average
        {
          mark: { type: "line", strokeDash: [6, 4], strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "ma3", type: "quantitative", title: "" },
            color: { value: "#1a202c" }
          }
        },
        // annotations at peak years
        {
          transform: [{ filter: "indexof([2004,2010,2011], toNumber(datum.Year)) >= 0" }],
          mark: { type: "text", dy: -8, fontSize: 11, fontWeight: "bold" },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "deaths", type: "quantitative" },
            text: { field: "Year" }
          }
        }
      ]
    },

    // ----- Damage per year -----
    {
      width: WIDTH,
      height: HEIGHT,
      title: { text: "Economic Damage per Year (USD Millions, NOAA)", ...BASE_CONFIG.title },
      config: { ...BASE_CONFIG, view: { stroke: null } },
      data: { url: "data/noaa_impact_2000_2025_m6.csv" },
      transform: [
        { aggregate: [{ op: "sum", field: "Total Damage ($Mil)", as: "damageM" }], groupby: ["Year"] },
        { calculate: "toNumber(datum.Year)", as: "Y" },
        { window: [{ op: "mean", field: "damageM", as: "ma3" }], frame: [-1, 1], sort: [{ field: "Y", order: "ascending" }] }
      ],
      layer: [
        // actual line
        {
          mark: { type: "line", strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "damageM", type: "quantitative", title: "Damage (USD, M)" },
            color: { value: "#c05621" }
          }
        },
        // moving average
        {
          mark: { type: "line", strokeDash: [6, 4], strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "ma3", type: "quantitative", title: "" },
            color: { value: "#1a202c" }
          }
        },
        // annotations at peak years
        {
          transform: [{ filter: "indexof([2004,2010,2011], toNumber(datum.Year)) >= 0" }],
          mark: { type: "text", dy: -8, fontSize: 11, fontWeight: "bold" },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "damageM", type: "quantitative" },
            text: { field: "Year" }
          }
        }
      ]
    }
  ]
};
