import { DimensionRow } from "./DimensionRow.jsx";

export function DimensionTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <DimensionRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={8}>
            <div className="empty">No dimensions match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table">
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Length</th>
          <th>Width</th>
          <th>Unit</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
