// charts/constants.js
export const MAP_WIDTH = 1040;
export const MAP_HEIGHT = 520;

export const LINE_WIDTH = 980;
export const LINE_HEIGHT = 280;

export const HIST_WIDTH = 980;
export const HIST_HEIGHT = 260;

// On-map legend position for the map
export const MAP_LEGEND_X = 60;
export const MAP_LEGEND_Y = 400; // with MAP_HEIGHT=520 this sits bottom-left nicely

// default year on slider
export const DEFAULT_YEAR = 2011;

// common config (font sizes etc.)
export const BASE_CONFIG = {
  title: { font: "Bree Serif", fontSize: 20, anchor: "start", color: "#111" },
  axis:  { labelFont: "Aldrich", titleFont: "Aldrich", labelFontSize: 12, titleFontSize: 13, gridColor: "#e6edf3" },
  legend:{ labelFont: "Aldrich", titleFont: "Aldrich", labelFontSize: 12, titleFontSize: 13 }
};
