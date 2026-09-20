export function FinishedGoodRow({
  id,
  rowNumber,
  product,
  style,
  variant,
  dimensions,
  ply,
  uom,
  status
}) {
  const statusLabel = status || "Inactive";
  const statusActive = status === "Active";

  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{product}</div>
      </td>
      <td>{style}</td>
      <td>{variant}</td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{dimensions}</code>
      </td>
      <td>
        <span className="badge badge-info">{ply}</span>
      </td>
      <td>
        <span className="badge badge-muted">{uom}</span>
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
            data-edit-fg={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-fg={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
