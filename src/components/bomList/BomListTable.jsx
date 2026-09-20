import { BomListRow } from "./BomListRow.jsx";

export function BomListTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <BomListRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={9}>
            <div className="empty">No saved BOMs match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table" style={{ minWidth: 1100 }}>
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>BOM Number</th>
          <th>Finished Good</th>
          <th>Variant</th>
          <th>Version</th>
          <th>Status</th>
          <th>Final Cost / Piece</th>
          <th>Updated Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
