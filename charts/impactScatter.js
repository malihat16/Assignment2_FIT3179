// charts/impactScatter.js
import { BASE_CONFIG, HIST_WIDTH as WIDTH, HIST_HEIGHT as HEIGHT } from './constants.js';

/**
 * Magnitude vs Fatalities (NOAA significant events)
 * - log Y for fatalities
 * - size = Damage (USD, M), color = MMI Int
 * - labels: Top-5 by deaths (short country names), staggered to reduce overlap
 */
export const impactScatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: WIDTH,
  height: HEIGHT,
  title: {
    text: "Magnitude vs Fatalities (NOAA significant events)",
    subtitle: "Size = Damage (USD, M); Color = MMI Int",
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

    // numeric fields used by BOTH layers
    { calculate: "toNumber(datum['Mag'])", as: "mag" },
    { calculate: "toNumber(datum['Total Deaths'])", as: "deaths" },
    { calculate: "toNumber(datum['Total Damage ($Mil)'])", as: "damageM" },
    { calculate: "toNumber(datum['Total Damage ($Mil)'])/1000", as: "damageB" },
    { calculate: "toNumber(datum['MMI Int'])", as: "mmi" },

    // shorter label = country (part before ':')
    { calculate: "split(datum['Location Name'], ':')[0]", as: "country" }
  ],

  layer: [
    // --- circles ---
    {
      mark: { type: "circle", opacity: 0.85, tooltip: true },
      encoding: {
        x: {
          field: "mag", type: "quantitative", title: "Magnitude",
          axis: { format: ".1f" },
          scale: { domain: [6, 9.6], nice: false, clamp: true }
        },
        y: {
          field: "deaths", type: "quantitative",
          title: "Fatalities (log scale)",
          scale: { type: "log", domain: [1, 300000], clamp: true },
          axis: { format: "~s" }
        },
        size: {
            field: "damageB", type: "quantitative",
            title: "Damage (USD, B)", legend: { format: "~s" },
            // optional: keep it readable across the range
            scale: { range: [20, 900] }
        },

        color: { field: "mmi", type: "quantitative", title: "MMI Int" },
        tooltip: [
          { field: "Year" },
          { field: "Location Name" },
          { field: "mag", title: "Magnitude" },
          { field: "mmi", title: "MMI" },
          { field: "deaths", title: "Deaths", format: "~s" },
          { field: "damageB", title: "Damage (B USD)", format: "~s" }
        ]
      }
    },

    // --- pick Top-5 by deaths and stagger label positions ---
    {
      transform: [
        { window: [{ op: "rank", as: "rk" }], sort: [{ field: "deaths", order: "descending" }] },
        { filter: "datum.rk <= 5" },
        // stagger labels: rk 1..5 → dy -6, -14, -22, -30, -38
        { calculate: "-6 - (datum.rk-1)*8", as: "labelDy" }
      ],
      // halo (white outline) for legibility
      mark: { type: "text", dy: { expr: "datum.labelDy" }, fontSize: 11, fontWeight: "bold", fill: "#fff" },
      encoding: {
        x: { field: "mag", type: "quantitative", scale: { domain: [6, 9.6] } },
        y: { field: "deaths", type: "quantitative", scale: { type: "log", domain: [1, 300000] } },
        text: { field: "country" }
      }
    },
    {
      transform: [
        { window: [{ op: "rank", as: "rk" }], sort: [{ field: "deaths", order: "descending" }] },
        { filter: "datum.rk <= 5" },
        { calculate: "-6 - (datum.rk-1)*8", as: "labelDy" }
      ],
      mark: { type: "text", dy: { expr: "datum.labelDy" }, fontSize: 11, fontWeight: "bold", fill: "#111" },
      encoding: {
        x: { field: "mag", type: "quantitative", scale: { domain: [6, 9.6] } },
        y: { field: "deaths", type: "quantitative", scale: { type: "log", domain: [1, 300000] } },
        text: { field: "country" }
      }
    }
  ]
};
