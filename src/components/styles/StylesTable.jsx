import { StyleRow } from "./StyleRow.jsx";

export function StylesTable({ rows }) {
  const body = rows.length
    ? rows.map((item) => (
        <StyleRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={7}>
            <div className="empty">No styles match this search.</div>
          </td>
        </tr>
      );

  return (
    <table className="data-table fm-table">
      <thead>
        <tr>
          <th className="fm-num">#</th>
          <th>Style Name</th>
          <th className="fm-desc-cell">Description</th>
          <th>Variables</th>
          <th>Formulas</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
    </table>
  );
}
