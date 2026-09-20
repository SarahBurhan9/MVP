import { createRoot } from "react-dom/client";
import { DashboardStats } from "./DashboardStats.jsx";

let dashboardStatsRoot = null;

export function unmountDashboardStats() {
  if (!dashboardStatsRoot) return;
  dashboardStatsRoot.unmount();
  dashboardStatsRoot = null;
}

export function mountDashboardStats(element, stats) {
  if (!element) return;
  if (dashboardStatsRoot) {
    dashboardStatsRoot.unmount();
    dashboardStatsRoot = null;
  }
  dashboardStatsRoot = createRoot(element);
  dashboardStatsRoot.render(<DashboardStats {...stats} />);
}
