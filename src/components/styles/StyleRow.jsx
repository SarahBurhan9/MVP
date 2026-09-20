export function StyleRow({
  id,
  rowNumber,
  name,
  description,
  variablesLabel,
  formulasLabel,
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
      <td className="fm-desc-cell">{description}</td>
      <td>
        <span className="badge badge-info">{variablesLabel}</span>
      </td>
      <td>
        <span className="badge badge-muted">{formulasLabel}</span>
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
            data-edit-style={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-style={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
