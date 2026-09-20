import { FormulaVariableRow } from "./FormulaVariableRow.jsx";

export function FormulaVariablesTable({ rows, emptyMessage }) {
  const body = rows.length
    ? rows.map((item) => (
        <FormulaVariableRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={10}>
            <div className="empty">{emptyMessage || "No formula variables match this search."}</div>
          </td>
        </tr>
      );

  return (
    <div className="table-wrap">
      <table className="data-table fm-table" style={{ minWidth: 1100 }}>
        <thead>
          <tr>
            <th className="fm-num">#</th>
            <th>Name</th>
            <th>Code</th>
            <th>Description</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Data Type</th>
            <th>Default Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
