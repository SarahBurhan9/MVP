import { ServiceRow } from "./ServiceRow.jsx";

export function ServicesTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <ServiceRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={7}>
            <div className="empty">No services match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table">
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Service</th>
          <th>Code</th>
          <th>UOM</th>
          <th>Category</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
