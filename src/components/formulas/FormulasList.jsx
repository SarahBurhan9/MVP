import { FormulasTable } from "./FormulasTable.jsx";

export function FormulasList({ grouped, groups, rows }) {
  if (grouped) {
    return (
      <>
        {groups.map((group) => (
          <div key={group.type} className={`card fm-group ${group.cls}`} style={{ marginBottom: 16 }}>
            <div className="card-body">
              <div className="section-head">
                <div className="fm-group-title">
                  <span className="fm-group-icon">
                    <i data-lucide={group.icon}></i>
                  </span>
                  <div>
                    <div className="section-kicker">{group.type} formulas</div>
                    <div className="section-title">{group.type}</div>
                  </div>
                </div>
                <span className="badge badge-muted">{group.rows.length}</span>
              </div>
              <FormulasTable rows={group.rows} emptyMessage={group.emptyMessage} />
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="card fm-group">
      <FormulasTable rows={rows} />
    </div>
  );
}
