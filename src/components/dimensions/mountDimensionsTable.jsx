import { createRoot } from "react-dom/client";
import { DimensionTable } from "./DimensionTable.jsx";

let dimensionsTableRoot = null;
let dimensionsTableEl = null;

export function unmountDimensionsTable() {
  if (!dimensionsTableRoot) return;
  dimensionsTableRoot.unmount();
  dimensionsTableRoot = null;
  dimensionsTableEl = null;
}

export function mountDimensionsTable(element, rows) {
  if (!element) return;
  if (dimensionsTableRoot && dimensionsTableEl !== element) {
    dimensionsTableRoot.unmount();
    dimensionsTableRoot = null;
    dimensionsTableEl = null;
  }
  if (!dimensionsTableRoot) {
    dimensionsTableRoot = createRoot(element);
    dimensionsTableEl = element;
  }
  dimensionsTableRoot.render(<DimensionTable rows={rows} />);
}
