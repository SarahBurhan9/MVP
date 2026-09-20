export function FormulaVariableRow({
  id,
  rowNumber,
  name,
  code,
  sheetArea,
  description,
  category,
  unit,
  dataType,
  defaultValue,
  isActive,
  sheetAreaDescription
}) {
  const statusLabel = isActive ? "Active" : "Inactive";

  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{name}</div>
      </td>
      <td className="mono fm-code">
        {code}
        {sheetArea ? (
          <>
            {" "}
            <span className="badge badge-muted">Fixed Calculation</span>
          </>
        ) : null}
      </td>
      <td>{description}</td>
      <td>
        <span className="badge badge-info">{category}</span>
      </td>
      <td>{unit}</td>
      <td>{dataType}</td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{defaultValue}</code>
      </td>
      <td>
        <span className={`badge ${isActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      {sheetArea ? (
        <td>
          <span className="formula-src" title={sheetAreaDescription}>
            Read only
          </span>
        </td>
      ) : (
        <td>
          <div className="row-actions">
            <button
              type="button"
              className="btn btn-sm btn-icon"
              data-edit-fvar={id}
              title="Edit"
            >
              <i data-lucide="pencil"></i>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-icon btn-danger"
              data-delete-fvar={id}
              title="Delete"
            >
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
