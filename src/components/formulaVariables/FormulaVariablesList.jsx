import { FormulaVariablesTable } from "./FormulaVariablesTable.jsx";

function FixedVariableRow({
  id,
  rowNumber,
  code,
  valueOrFormula,
  description,
  currentValue
}) {
  return (
    <tr>
      <td className="fm-num">{rowNumber}</td>
      <td className="mono fm-code">
        {code} <span className="badge badge-muted">Fixed</span>
      </td>
      <td className="fm-expr-cell">
        <code className="fm-expr">{valueOrFormula}</code>
      </td>
      <td>{description}</td>
      <td className="fm-name">{currentValue}</td>
      <td>
        <div className="row-actions">
          <button
            type="button"
            className="btn btn-sm btn-icon"
            data-edit-fixed-variable={id}
            title="Edit"
          >
            <i data-lucide="pencil"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}

export function FormulaVariablesList({ fixedRows, groups }) {
  return (
    <>
      <div className="card fm-group is-fixed" style={{ marginBottom: 16 }}>
        <div className="card-body">
          <div className="section-head">
            <div className="fm-group-title">
              <span className="fm-group-icon">
                <i data-lucide="lock"></i>
              </span>
              <div>
                <div className="section-kicker">Fixed variables</div>
                <div className="section-title">System</div>
              </div>
            </div>
            <div className="row-actions" style={{ alignItems: "center", gap: 8 }}>
              <button type="button" className="btn btn-primary btn-sm" id="btn-add-fixed-variable">
                <i data-lucide="plus"></i> Add Fixed Variable
              </button>
              <span className="badge badge-muted">{fixedRows.length}</span>
            </div>
          </div>
          <p className="fm-group-hint">
            These values are part of the calculation engine. Values can be edited but fixed variables cannot be deleted.
          </p>
          <div className="table-wrap">
            <table className="data-table fm-table">
              <thead>
                <tr>
                  <th className="fm-num">#</th>
                  <th>Code</th>
                  <th>Value / Formula</th>
                  <th>Description</th>
                  <th>Current Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fixedRows.map((item) => (
                  <FixedVariableRow key={item.id} {...item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {groups.map((group) => (
        <div key={group.category} className={`card fm-group ${group.cls}`} style={{ marginBottom: 16 }}>
          <div className="card-body">
            <div className="section-head">
              <div className="fm-group-title">
                <span className="fm-group-icon">
                  <i data-lucide={group.icon}></i>
                </span>
                <div>
                  <div className="section-kicker">{group.category} variables</div>
                  <div className="section-title">{group.category}</div>
                </div>
              </div>
              <span className="badge badge-muted">{group.rows.length}</span>
            </div>
            <FormulaVariablesTable rows={group.rows} emptyMessage={group.emptyMessage} />
          </div>
        </div>
      ))}
    </>
  );
}
