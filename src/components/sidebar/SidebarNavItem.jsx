export function SidebarNavItem({ page, label, icon, sectionStart, active }) {
  const className = ["nav-item", sectionStart ? "nav-section-start" : "", active ? "active" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={className} data-page={page}>
      <i data-lucide={icon}></i> {label}
    </button>
  );
}
