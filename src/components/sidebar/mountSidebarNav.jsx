import { createRoot } from "react-dom/client";
import { SidebarNav } from "./SidebarNav.jsx";

let sidebarNavRoot = null;
let sidebarNavEl = null;

export function mountSidebarNav(element, model) {
  if (!element) return;
  if (sidebarNavRoot && sidebarNavEl !== element) {
    sidebarNavRoot.unmount();
    sidebarNavRoot = null;
    sidebarNavEl = null;
  }
  if (!sidebarNavRoot) {
    sidebarNavRoot = createRoot(element);
    sidebarNavEl = element;
  }
  sidebarNavRoot.render(<SidebarNav currentPage={model.currentPage} items={model.items} />);
}
