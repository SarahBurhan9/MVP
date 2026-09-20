export function RawMaterialRow({
  id,
  rowNumber,
  name,
  code,
  category,
  gsm,
  uom,
  qtyFormula,
  status
}) {
  const statusLabel = status || "Inactive";
  const statusActive = status === "Active";

  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{name}</div>
      </td>
      <td className="mono fm-code">{code}</td>
      <td>
        <span className="badge badge-info">{category}</span>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{gsm}</code>
      </td>
      <td>
        <span className="badge badge-muted">{uom}</span>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{qtyFormula}</code>
      </td>
      <td>
        <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-sm btn-icon"
            data-edit-rm={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-rm={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
