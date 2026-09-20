import { ServiceRateRow } from "./ServiceRateRow.jsx";

export function ServiceRatesTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <ServiceRateRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={8}>
            <div className="empty">No service rates match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table" style={{ minWidth: 1100 }}>
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Service Name</th>
          <th>Service Code</th>
          <th>Rate (PKR)</th>
          <th>Rate UOM</th>
          <th>Formula</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
