import { SidebarNavItem } from "./SidebarNavItem.jsx";

export function SidebarNav({ currentPage, items }) {
  return (
    <>
      {items.map((item) => (
        <SidebarNavItem
          key={item.page}
          page={item.page}
          label={item.label}
          icon={item.icon}
          sectionStart={item.sectionStart}
          active={item.page === currentPage}
        />
      ))}
    </>
  );
}
