import { createRoot } from "react-dom/client";
import { ServiceRatesTable } from "./ServiceRatesTable.jsx";

let serviceRatesTableRoot = null;
let serviceRatesTableEl = null;

export function unmountServiceRatesTable() {
  if (!serviceRatesTableRoot) return;
  serviceRatesTableRoot.unmount();
  serviceRatesTableRoot = null;
  serviceRatesTableEl = null;
}

export function mountServiceRatesTable(element, rows) {
  if (!element) return;
  if (serviceRatesTableRoot && serviceRatesTableEl !== element) {
    unmountServiceRatesTable();
  }
  if (!serviceRatesTableRoot) {
    serviceRatesTableRoot = createRoot(element);
    serviceRatesTableEl = element;
  }
  serviceRatesTableRoot.render(<ServiceRatesTable rows={rows} />);
}
