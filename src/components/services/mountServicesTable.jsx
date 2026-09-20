import { createRoot } from "react-dom/client";
import { ServicesTable } from "./ServicesTable.jsx";

let servicesTableRoot = null;
let servicesTableEl = null;

export function unmountServicesTable() {
  if (!servicesTableRoot) return;
  servicesTableRoot.unmount();
  servicesTableRoot = null;
  servicesTableEl = null;
}

export function mountServicesTable(element, rows) {
  if (!element) return;
  if (servicesTableRoot && servicesTableEl !== element) {
    unmountServicesTable();
  }
  if (!servicesTableRoot) {
    servicesTableRoot = createRoot(element);
    servicesTableEl = element;
  }
  servicesTableRoot.render(<ServicesTable rows={rows} />);
}
