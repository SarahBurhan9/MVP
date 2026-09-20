export function OtherRawMaterialRow({
  id,
  code,
  name,
  category,
  gsm,
  uom,
  qtyFormula,
  dimensions,
  status
}) {
  const statusLabel = status || "Inactive";
  const statusActive = status === "Active";

  return (
    <tr>
      <td className="mono">{code}</td>
      <td>{name}</td>
      <td>
        <span className="badge badge-info">{category}</span>
      </td>
      <td>{gsm}</td>
      <td>{uom}</td>
      <td className="mono">{qtyFormula}</td>
      <td>{dimensions}</td>
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
            data-edit-orm={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-icon btn-danger"
            data-delete-orm={id}
            title="Delete"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
