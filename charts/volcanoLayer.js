// charts/volcanoLayer.js
// A small point layer you can import into map.js

export const volcanoLayer = {
  data: { url: "data/volcanoes.csv" },
  mark: { type: "circle", opacity: 0.85 },
  encoding: {
    longitude: { field: "longitude", type: "quantitative" },
    latitude:  { field: "latitude",  type: "quantitative" },
    size:      { value: 20 },
    color:     { value: "#2aa876" }, // green-ish; distinct from quake & plate colors
    tooltip:   [{ field: "name", title: "Volcano" }]
  }
};

// --- If you instead have GeoJSON (e.g., converted from KML), use this export ---
// export const volcanoLayer = {
//   data: { url: "data/volcanoes.geojson", format: { type: "geojson" } },
//   mark: { type: "geoshape", fill: "#2aa876", stroke: "#2aa876" }
// };
