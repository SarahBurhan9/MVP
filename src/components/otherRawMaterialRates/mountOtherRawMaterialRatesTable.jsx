import { createRoot } from "react-dom/client";
import { OtherRawMaterialRatesTable } from "./OtherRawMaterialRatesTable.jsx";

let otherRawMaterialRatesTableRoot = null;
let otherRawMaterialRatesTableEl = null;

export function unmountOtherRawMaterialRatesTable() {
  if (!otherRawMaterialRatesTableRoot) return;
  otherRawMaterialRatesTableRoot.unmount();
  otherRawMaterialRatesTableRoot = null;
  otherRawMaterialRatesTableEl = null;
}

export function mountOtherRawMaterialRatesTable(element, rows) {
  if (!element) return;
  if (otherRawMaterialRatesTableRoot && otherRawMaterialRatesTableEl !== element) {
    otherRawMaterialRatesTableRoot.unmount();
    otherRawMaterialRatesTableRoot = null;
    otherRawMaterialRatesTableEl = null;
  }
  if (!otherRawMaterialRatesTableRoot) {
    otherRawMaterialRatesTableRoot = createRoot(element);
    otherRawMaterialRatesTableEl = element;
  }
  otherRawMaterialRatesTableRoot.render(<OtherRawMaterialRatesTable rows={rows} />);
}
