import { RawMaterialRateRow } from "./RawMaterialRateRow.jsx";

export function RawMaterialRatesTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <RawMaterialRateRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={8}>
            <div className="empty">No material rates match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table" style={{ minWidth: 1100 }}>
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Name</th>
          <th>Code</th>
          <th>Rate (PKR)</th>
          <th>Rate UOM</th>
          <th>Dimensions</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
