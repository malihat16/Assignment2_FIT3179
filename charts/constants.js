// charts/constants.js
export const MAP_WIDTH = 1040;
export const MAP_HEIGHT = 520;

export const LINE_WIDTH = 980;
export const LINE_HEIGHT = 280;

export const HIST_WIDTH = 980;
export const HIST_HEIGHT = 260;

export const MAP_LEGEND_X = 60;
export const MAP_LEGEND_Y = 400;

export const DEFAULT_YEAR = 2011;

// All chart text (titles, axes, legends) = Arial
export const BASE_CONFIG = {
  title:  { font: "Figtree", fontSize: 20, fontWeight: "bold", anchor: "start", color: "#111" },
  axis:   { labelFont: "Figtree", titleFont: "Figtree", labelFontSize: 12, titleFontSize: 13, gridColor: "#e6edf3" },
  legend: { labelFont: "Figtree", titleFont: "Figtree", labelFontSize: 12, titleFontSize: 13 }
};
