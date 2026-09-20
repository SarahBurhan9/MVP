import { createRoot } from "react-dom/client";
import { OtherRawMaterialsTable } from "./OtherRawMaterialsTable.jsx";

let otherRawMaterialsTableRoot = null;
let otherRawMaterialsTableEl = null;

export function unmountOtherRawMaterialsTable() {
  if (!otherRawMaterialsTableRoot) return;
  otherRawMaterialsTableRoot.unmount();
  otherRawMaterialsTableRoot = null;
  otherRawMaterialsTableEl = null;
}

export function mountOtherRawMaterialsTable(element, rows) {
  if (!element) return;
  if (otherRawMaterialsTableRoot && otherRawMaterialsTableEl !== element) {
    otherRawMaterialsTableRoot.unmount();
    otherRawMaterialsTableRoot = null;
    otherRawMaterialsTableEl = null;
  }
  if (!otherRawMaterialsTableRoot) {
    otherRawMaterialsTableRoot = createRoot(element);
    otherRawMaterialsTableEl = element;
  }
  otherRawMaterialsTableRoot.render(<OtherRawMaterialsTable rows={rows} />);
}
