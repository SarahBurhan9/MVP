import { RawMaterialRow } from "./RawMaterialRow.jsx";

export function RawMaterialsTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <RawMaterialRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={9}>
            <div className="empty">No raw materials match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table" style={{ minWidth: 1100 }}>
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Material</th>
          <th>Code</th>
          <th>Category</th>
          <th>GSM</th>
          <th>UOM</th>
          <th>Qty Formula</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
