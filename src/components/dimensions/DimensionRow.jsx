export function DimensionRow({
  id,
  rowNumber,
  name,
  description,
  length,
  width,
  unit,
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
      <td>{description}</td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{length}</code>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{width}</code>
      </td>
      <td>
        <span className="badge badge-info">{unit}</span>
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
            data-edit-dim={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-dim={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
