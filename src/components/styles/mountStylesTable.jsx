import { createRoot } from "react-dom/client";
import { StylesTable } from "./StylesTable.jsx";

let stylesTableRoot = null;
let stylesTableEl = null;

export function unmountStylesTable() {
  if (!stylesTableRoot) return;
  stylesTableRoot.unmount();
  stylesTableRoot = null;
  stylesTableEl = null;
}

export function mountStylesTable(element, rows) {
  if (!element) return;
  if (stylesTableRoot && stylesTableEl !== element) {
    stylesTableRoot.unmount();
    stylesTableRoot = null;
    stylesTableEl = null;
  }
  if (!stylesTableRoot) {
    stylesTableRoot = createRoot(element);
    stylesTableEl = element;
  }
  stylesTableRoot.render(<StylesTable rows={rows} />);
}
