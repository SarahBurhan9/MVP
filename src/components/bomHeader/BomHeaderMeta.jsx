export function BomHeaderMeta({ bomNo, version, statusLabel, statusActive }) {
  return (
    <>
      <div className="section-kicker">BOM Actions</div>
      <div className="bom-meta" style={{ marginTop: 12 }}>
        <div>
          <div className="field-label">BOM No</div>
          <div className="field-value mono">{bomNo}</div>
        </div>
        <div>
          <div className="field-label">Version</div>
          <div className="field-value">{version}</div>
        </div>
        <div>
          <div className="field-label">Status</div>
          <div>
            <span className={`badge ${statusActive ? "badge-success" : "badge-muted"}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
