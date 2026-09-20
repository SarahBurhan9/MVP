import { createRoot } from "react-dom/client";
import { FinishedGoodsTable } from "./FinishedGoodsTable.jsx";

let finishedGoodsTableRoot = null;
let finishedGoodsTableEl = null;

export function unmountFinishedGoodsTable() {
  if (!finishedGoodsTableRoot) return;
  finishedGoodsTableRoot.unmount();
  finishedGoodsTableRoot = null;
  finishedGoodsTableEl = null;
}

export function mountFinishedGoodsTable(element, rows) {
  if (!element) return;
  if (finishedGoodsTableRoot && finishedGoodsTableEl !== element) {
    finishedGoodsTableRoot.unmount();
    finishedGoodsTableRoot = null;
    finishedGoodsTableEl = null;
  }
  if (!finishedGoodsTableRoot) {
    finishedGoodsTableRoot = createRoot(element);
    finishedGoodsTableEl = element;
  }
  finishedGoodsTableRoot.render(<FinishedGoodsTable rows={rows} />);
}
