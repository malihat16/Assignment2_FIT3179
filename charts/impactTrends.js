// charts/impactTrends.js
import { BASE_CONFIG, LINE_WIDTH as WIDTH, LINE_HEIGHT as HEIGHT } from './constants.js';

// Two equal columns with a little gutter
const W2 = Math.round((WIDTH - 32) / 2);

export const impactTrendsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  padding: { bottom: 20 },
  config: {
    ...BASE_CONFIG,
    view: { stroke: null },
    axis: { labelFontSize: 11, titleFontSize: 12, gridOpacity: 0.25 }
  },

  hconcat: [
    // ===== Left: Deaths per year =====
    {
      width: W2,
      height: HEIGHT,
      title: {
        text: "Deaths from Significant Earthquakes per Year (NOAA)",
        subtitle:
          "Annual totals with a 3-year moving average (dashed). Labels mark 2004, 2010 and 2011 peaks."
      },
      data: { url: "data/noaa_impact_2000_2025_m6.csv" },
      transform: [
        { aggregate: [{ op: "sum", field: "Total Deaths", as: "deaths" }], groupby: ["Year"] },
        { calculate: "toNumber(datum.Year)", as: "Y" },
        {
          window: [{ op: "mean", field: "deaths", as: "ma3" }],
          frame: [-1, 1],
          sort: [{ field: "Y", order: "ascending" }]
        }
      ],
      layer: [
        // raw count
        {
          transform: [{ calculate: "'Count'", as: "series" }],
          mark: { type: "line", strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal", title: "" },
            y: { field: "deaths", type: "quantitative", title: "Deaths" },
            color: {
              field: "series",
              type: "nominal",
              scale: { domain: ["Count", "3-yr avg"], range: ["#2b6cb0", "#1a202c"] },
              legend: { orient: "bottom", title: "" }
            }
          }
        },
        // 3-yr moving average (dashed)
        {
          transform: [{ calculate: "'3-yr avg'", as: "series" }],
          mark: { type: "line", strokeDash: [6, 4], strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal", title: "" },
            y: { field: "ma3", type: "quantitative", title: "" },
            color: {
              field: "series",
              type: "nominal",
              scale: { domain: ["Count", "3-yr avg"], range: ["#2b6cb0", "#1a202c"] },
              legend: { orient: "bottom", title: "" }
            }
          }
        },
        // Peak year labels
        {
          transform: [{ filter: "indexof([2004,2010,2011], toNumber(datum.Year)) >= 0" }],
          mark: { type: "text", dy: -8, fontSize: 11, fontWeight: "bold" },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "deaths", type: "quantitative" },
            text: { field: "Year" },
            color: { value: "#000" }
          }
        }
      ]
    },

    // ===== Right: Damage per year =====
    {
      width: W2,
      height: HEIGHT,
      title: {
        text: "Economic Damage per Year (USD Millions, NOAA)",
        subtitle:
          "Annual economic losses (USD, M) with 3-year moving average (dashed). Labels mark 2004, 2010 and 2011 highlights."
      },
      data: { url: "data/noaa_impact_2000_2025_m6.csv" },
      transform: [
        { aggregate: [{ op: "sum", field: "Total Damage ($Mil)", as: "damageM" }], groupby: ["Year"] },
        { calculate: "toNumber(datum.Year)", as: "Y" },
        {
          window: [{ op: "mean", field: "damageM", as: "ma3" }],
          frame: [-1, 1],
          sort: [{ field: "Y", order: "ascending" }]
        }
      ],
      layer: [
        // raw damage
        {
          transform: [{ calculate: "'Count'", as: "series" }],
          mark: { type: "line", strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal", title: "" },
            y: { field: "damageM", type: "quantitative", title: "Damage (USD, M)" },
            color: {
              field: "series",
              type: "nominal",
              scale: { domain: ["Count", "3-yr avg"], range: ["#c05621", "#1a202c"] },
              legend: { orient: "bottom", title: "" }
            }
          }
        },
        // 3-yr moving average (dashed)
        {
          transform: [{ calculate: "'3-yr avg'", as: "series" }],
          mark: { type: "line", strokeDash: [6, 4], strokeWidth: 2 },
          encoding: {
            x: { field: "Year", type: "ordinal", title: "" },
            y: { field: "ma3", type: "quantitative", title: "" },
            color: {
              field: "series",
              type: "nominal",
              scale: { domain: ["Count", "3-yr avg"], range: ["#c05621", "#1a202c"] },
              legend: { orient: "bottom", title: "" }
            }
          }
        },
        // Peak labels (2011 prominent spike etc.)
        {
          transform: [{ filter: "indexof([2004,2010,2011], toNumber(datum.Year)) >= 0" }],
          mark: { type: "text", dy: -8, fontSize: 11, fontWeight: "bold" },
          encoding: {
            x: { field: "Year", type: "ordinal" },
            y: { field: "damageM", type: "quantitative" },
            text: { field: "Year" },
            color: { value: "#000" }
          }
        }
      ]
    }
  ]
};
