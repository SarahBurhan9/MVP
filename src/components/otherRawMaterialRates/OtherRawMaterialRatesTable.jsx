import { OtherRawMaterialRateRow } from "./OtherRawMaterialRateRow.jsx";

export function OtherRawMaterialRatesTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <OtherRawMaterialRateRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={7}>
            <div className="empty">No material rates match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
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
