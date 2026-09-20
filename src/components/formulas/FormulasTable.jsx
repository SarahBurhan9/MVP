import { FormulaRow } from "./FormulaRow.jsx";

export function FormulasTable({ rows, emptyMessage }) {
  const body = rows.length
    ? rows.map((item) => (
        <FormulaRow key={item.id} {...item} />
      ))
    : (
        <tr>
          <td colSpan={8}>
            <div className="empty">{emptyMessage || "No formulas match this search or filter."}</div>
          </td>
        </tr>
      );

  return (
    <div className="table-wrap">
      <table className="data-table fm-table" style={{ minWidth: 1100 }}>
        <thead>
          <tr>
            <th className="fm-num">#</th>
            <th>Formula Name</th>
            <th>Code</th>
            <th>Type</th>
            <th>Expression</th>
            <th>Dependencies</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
