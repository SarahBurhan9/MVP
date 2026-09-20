import { createRoot } from "react-dom/client";
import { RawMaterialsTable } from "./RawMaterialsTable.jsx";

let rawMaterialsTableRoot = null;
let rawMaterialsTableEl = null;

export function unmountRawMaterialsTable() {
  if (!rawMaterialsTableRoot) return;
  rawMaterialsTableRoot.unmount();
  rawMaterialsTableRoot = null;
  rawMaterialsTableEl = null;
}

export function mountRawMaterialsTable(element, rows) {
  if (!element) return;
  if (rawMaterialsTableRoot && rawMaterialsTableEl !== element) {
    rawMaterialsTableRoot.unmount();
    rawMaterialsTableRoot = null;
    rawMaterialsTableEl = null;
  }
  if (!rawMaterialsTableRoot) {
    rawMaterialsTableRoot = createRoot(element);
    rawMaterialsTableEl = element;
  }
  rawMaterialsTableRoot.render(<RawMaterialsTable rows={rows} />);
}
