import { createRoot } from "react-dom/client";
import { BomListTable } from "./BomListTable.jsx";

let bomListTableRoot = null;
let bomListTableEl = null;

export function unmountBomListTable() {
  if (!bomListTableRoot) return;
  bomListTableRoot.unmount();
  bomListTableRoot = null;
  bomListTableEl = null;
}

export function mountBomListTable(element, rows) {
  if (!element) return;
  if (bomListTableRoot && bomListTableEl !== element) {
    bomListTableRoot.unmount();
    bomListTableRoot = null;
    bomListTableEl = null;
  }
  if (!bomListTableRoot) {
    bomListTableRoot = createRoot(element);
    bomListTableEl = element;
  }
  bomListTableRoot.render(<BomListTable rows={rows} />);
}
