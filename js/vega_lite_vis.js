(async function(){
  try {
    console.log("Embedding charts…");
    await vegaEmbed("#map", "charts/map_eq.vg.json", {actions:false});
    await vegaEmbed("#line", "charts/line_year.vg.json", {actions:false});
    await vegaEmbed("#hist", "charts/hist_mag.vg.json", {actions:false});
    console.log("All charts embedded.");
  } catch (err) {
    console.error("Vega-Embed error:", err);
    const pre = document.createElement("pre");
    pre.textContent = String(err);
    document.body.appendChild(pre);
  }
})();
