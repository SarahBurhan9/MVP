import { createRoot } from "react-dom/client";
import { RawMaterialRatesTable } from "./RawMaterialRatesTable.jsx";

let rawMaterialRatesTableRoot = null;
let rawMaterialRatesTableEl = null;

export function unmountRawMaterialRatesTable() {
  if (!rawMaterialRatesTableRoot) return;
  rawMaterialRatesTableRoot.unmount();
  rawMaterialRatesTableRoot = null;
  rawMaterialRatesTableEl = null;
}

export function mountRawMaterialRatesTable(element, rows) {
  if (!element) return;
  if (rawMaterialRatesTableRoot && rawMaterialRatesTableEl !== element) {
    rawMaterialRatesTableRoot.unmount();
    rawMaterialRatesTableRoot = null;
    rawMaterialRatesTableEl = null;
  }
  if (!rawMaterialRatesTableRoot) {
    rawMaterialRatesTableRoot = createRoot(element);
    rawMaterialRatesTableEl = element;
  }
  rawMaterialRatesTableRoot.render(<RawMaterialRatesTable rows={rows} />);
}
