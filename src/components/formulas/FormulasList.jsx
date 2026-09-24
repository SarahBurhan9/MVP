import { useEffect } from "react";
import { FormulasTable } from "./FormulasTable.jsx";

function StyleGroupHeading({ group }) {
  return (
    <div className="section-head">
      <div className="fm-group-title">
        <span className="fm-group-icon">
          <i data-lucide="palette"></i>
        </span>
        <div>
          <div className="section-kicker">{group.kicker}</div>
          <div className="section-title">{group.name}</div>
        </div>
      </div>
      <span className="badge badge-muted">{group.rows.length}</span>
    </div>
  );
}

function StyleGroupCards({ styleGroups }) {
  if (!styleGroups.length) {
    return (
      <div className="card fm-group is-style">
        <FormulasTable rows={[]} emptyMessage="No formulas match this search or filter." />
      </div>
    );
  }

  return styleGroups.map((group) => (
    <div key={group.key} className="card fm-group is-style" style={{ marginBottom: 16 }}>
      <div className="card-body">
        <StyleGroupHeading group={group} />
        <FormulasTable rows={group.rows} emptyMessage="No formulas linked to this style." />
      </div>
    </div>
  ));
}

export function FormulasList({ grouped, groups, rows, styleGroups }) {
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  });

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
              {group.styleGroups ? (
                group.styleGroups.length ? (
                  group.styleGroups.map((styleGroup) => (
                    <div key={styleGroup.key} className="fm-style-block">
                      <StyleGroupHeading group={styleGroup} />
                      <FormulasTable rows={styleGroup.rows} emptyMessage="No formulas linked to this style." />
                    </div>
                  ))
                ) : (
                  <FormulasTable rows={[]} emptyMessage={group.emptyMessage} />
                )
              ) : (
                <FormulasTable rows={group.rows} emptyMessage={group.emptyMessage} />
              )}
            </div>
          </div>
        ))}
      </>
    );
  }

  if (Array.isArray(styleGroups)) {
    return <StyleGroupCards styleGroups={styleGroups} />;
  }

  return (
    <div className="card fm-group">
      <FormulasTable rows={rows} />
    </div>
  );
}
