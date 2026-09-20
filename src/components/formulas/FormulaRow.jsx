export function FormulaRow({
  id,
  rowNumber,
  name,
  code,
  type,
  expression,
  dependencies,
  isActive
}) {
  const typeClass = type === "Service" ? "badge-warn" : type === "Style" ? "badge-success" : "badge-info";
  const statusLabel = isActive ? "Active" : "Inactive";

  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td>
        <div className="fm-name">{name}</div>
      </td>
      <td className="mono fm-code">{code}</td>
      <td>
        <span className={`badge ${typeClass}`}>{type}</span>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{expression}</code>
      </td>
      <td>
        {dependencies.length ? (
          <div className="dep-badges">
            {dependencies.map((dep) => (
              <span
                key={dep.code}
                className={`badge ${dep.isFormula ? "badge-info" : "badge-muted"}`}
              >
                {dep.code}
              </span>
            ))}
          </div>
        ) : (
          <span className="badge badge-muted">None</span>
        )}
      </td>
      <td>
        <span className={`badge ${isActive ? "badge-success" : "badge-muted"}`}>
          {statusLabel}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button className="btn btn-sm" type="button" data-edit-formula={id}>
            Edit
          </button>
          <button className="btn btn-sm" type="button" data-test-formula={id}>
            Test
          </button>
          <button
            className={`btn btn-sm${isActive ? " btn-danger" : ""}`}
            type="button"
            data-toggle-formula={id}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}
