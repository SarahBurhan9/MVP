import { useEffect, useState } from "react";
import { FormulasTable } from "./FormulasTable.jsx";

function GroupToggle({ icon, kicker, title, count, open, onClick }) {
  return (
    <button type="button" className="fm-group-toggle" aria-expanded={open} onClick={onClick}>
      <span className="fm-group-title">
        <span className="fm-group-icon">
          <i data-lucide={icon}></i>
        </span>
        <span>
          <span className="section-kicker">{kicker}</span>
          <span className="section-title">{title}</span>
        </span>
      </span>
      <span className="fm-group-toggle-side">
        <span className="badge badge-muted">{count}</span>
        <i data-lucide={open ? "chevron-down" : "chevron-right"}></i>
      </span>
    </button>
  );
}

function StyleGroupCards({ styleGroups, isOpen, onToggle }) {
  if (!styleGroups.length) {
    return (
      <div className="card fm-group is-style">
        <FormulasTable rows={[]} emptyMessage="No formulas match this search or filter." />
      </div>
    );
  }

  return styleGroups.map((group) => {
    const key = "style:" + group.key;
    const open = isOpen(key);
    return (
      <div key={group.key} className="card fm-group is-style" style={{ marginBottom: 10 }}>
        <div className="card-body">
          <GroupToggle
            icon="palette"
            kicker={group.kicker}
            title={group.name}
            count={group.rows.length}
            open={open}
            onClick={() => onToggle(key)}
          />
          {open ? (
            <div className="fm-group-body">
              <FormulasTable rows={group.rows} emptyMessage="No formulas linked to this style." />
            </div>
          ) : null}
        </div>
      </div>
    );
  });
}

export function FormulasList({ grouped, groups, rows, styleGroups, query }) {
  const [openKeys, setOpenKeys] = useState(() => new Set());
  const searchOpen = Boolean(String(query || "").trim());

  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  });

  function isOpen(key) {
    return searchOpen || openKeys.has(key);
  }

  function onToggle(key) {
    if (searchOpen) return;
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (grouped) {
    return (
      <>
        {groups.map((group) => {
          const key = "type:" + group.type;
          const open = isOpen(key);
          return (
            <div key={group.type} className={`card fm-group ${group.cls}`} style={{ marginBottom: 10 }}>
              <div className="card-body">
                <GroupToggle
                  icon={group.icon}
                  kicker={group.type + " formulas"}
                  title={group.type}
                  count={group.rows.length}
                  open={open}
                  onClick={() => onToggle(key)}
                />
                {open ? (
                  <div className="fm-group-body">
                    {group.styleGroups ? (
                      group.styleGroups.length ? (
                        group.styleGroups.map((styleGroup) => {
                          const styleKey = "style:" + styleGroup.key;
                          const styleOpen = isOpen(styleKey);
                          return (
                            <div key={styleGroup.key} className="fm-style-block">
                              <GroupToggle
                                icon="palette"
                                kicker={styleGroup.kicker}
                                title={styleGroup.name}
                                count={styleGroup.rows.length}
                                open={styleOpen}
                                onClick={() => onToggle(styleKey)}
                              />
                              {styleOpen ? (
                                <div className="fm-group-body">
                                  <FormulasTable rows={styleGroup.rows} emptyMessage="No formulas linked to this style." />
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <FormulasTable rows={[]} emptyMessage={group.emptyMessage} />
                      )
                    ) : (
                      <FormulasTable rows={group.rows} emptyMessage={group.emptyMessage} />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (Array.isArray(styleGroups)) {
    return <StyleGroupCards styleGroups={styleGroups} isOpen={isOpen} onToggle={onToggle} />;
  }

  return (
    <div className="card fm-group">
      <FormulasTable rows={rows} />
    </div>
  );
}
