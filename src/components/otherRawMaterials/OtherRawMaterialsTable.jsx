import { OtherRawMaterialRow } from "./OtherRawMaterialRow.jsx";

export function OtherRawMaterialsTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <OtherRawMaterialRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={9}>
            <div className="empty">No other raw materials match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Material</th>
          <th>Category</th>
          <th>GSM</th>
          <th>UOM</th>
          <th>Qty Formula</th>
          <th>Dimensions</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
