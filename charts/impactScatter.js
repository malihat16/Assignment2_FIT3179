// charts/impactScatter.js
import { BASE_CONFIG, HIST_WIDTH as WIDTH, HIST_HEIGHT as HEIGHT } from './constants.js';

/**
 * Magnitude vs Fatalities (NOAA significant events)
 * - Y (log) = fatalities
 * - Size = Total Damage (USD, B)
 * - Color = MMI Intensity (HORIZONTAL gradient)
 * - Legends: both under the chart with generous spacing
 *   - Color legend: bottom (horizontal)
 *   - Size legend: absolute positioned to the right, horizontal symbols
 */
export const impactScatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: WIDTH,
  height: HEIGHT,

  // extra room for the two legends
  padding: { bottom: 10 },

  title: {
    subtitle: "Size = Damage (USD, B); Color = MMI Int",
    ...BASE_CONFIG.title
  },

  config: {
    ...BASE_CONFIG,
    view: { stroke: null },
    axis: { gridOpacity: 0.25 }
  },

  data: { url: "data/noaa_impact_2000_2025_m6.csv" },

  transform: [
    { filter: "isValid(datum['Mag']) && isValid(datum['Total Deaths'])" },
    { filter: "toNumber(datum['Total Deaths']) > 0" },
    { calculate: "toNumber(datum['Mag'])", as: "mag" },
    { calculate: "toNumber(datum['Total Deaths'])", as: "deaths" },
    { calculate: "toNumber(datum['Total Damage ($Mil)'])/1000", as: "damageB" },
    { calculate: "toNumber(datum['MMI Int'])", as: "mmi" }
  ],

  layer: [
    {
      mark: { type: "circle", opacity: 0.85, tooltip: true },
      encoding: {
        x: {
          field: "mag", type: "quantitative", title: "Magnitude",
          axis: { format: ".1f" },
          scale: { domain: [5.8, 9.2], nice: false, clamp: true }
        },
        y: {
          field: "deaths", type: "quantitative",
          title: "Fatalities (log scale)",
          scale: { type: "log", domain: [1, 300000], clamp: true },
          axis: { format: "~s" }
        },

        // COLOR legend — keep HORIZONTAL by using orient:"bottom"
// COLOR legend (keep as-is, but add titlePadding for consistent height)
        color: {
        field: "mmi", type: "quantitative",
        title: "MMI Int",
        scale: { scheme: "blues", domain: [4, 10], clamp: true },
        legend: {
            orient: "bottom",
            offset: 10,              // baseline = HEIGHT + 28
            gradientLength: 300,
            gradientThickness: 12,
            labelOverlap: "greedy",
            titlePadding: 6          // ← ensures title height matches the size legend
        }
        },

        // SIZE legend (absolute — match the same baseline and title padding)
        size: {
        field: "damageB", type: "quantitative",
        title: "Damage (USD, B)",
        scale: { range: [20, 900] },
        legend: {
            orient: "none",
            legendX: Math.round(WIDTH * 0.7),
            legendY: HEIGHT + 40,    // ← align with color legend’s offset baseline
            direction: "horizontal",
            format: "~s",
            symbolType: "circle",
            symbolOpacity: 0.9,
            values: [0, 20, 40, 60, 80],
            labelPadding: 6,
            titlePadding: 6          // ← match the color legend title spacing
        }
        },


        tooltip: [
          { field: "Year" },
          { field: "Location Name" },
          { field: "mag", title: "Magnitude" },
          { field: "mmi", title: "MMI" },
          { field: "deaths", title: "Deaths", format: "~s" },
          { field: "damageB", title: "Damage (B USD)", format: "~s" }
        ]
      }
    }
  ]
};
