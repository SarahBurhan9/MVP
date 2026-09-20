export function StatCard({ label, value, hint, page }) {
  return (
    <article
      className="stat-card stat-card-nav"
      role="button"
      tabIndex={0}
      data-dashboard-nav={page}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-hint">{hint}</div>
    </article>
  );
}
