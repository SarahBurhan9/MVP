export function BomCostMix({
  showCostMix,
  showColorCost,
  materialWidth,
  serviceWidth,
  finishingWidth,
  colorWidth,
  materialPctLabel,
  servicePctLabel,
  finishingPctLabel,
  colorPctLabel
}) {
  if (!showCostMix) {
    return (
      <p className="cost-mix-empty">Cost mix appears when rates are set and costs calculate.</p>
    );
  }

  return (
    <div className="cost-bars">
      <div className="cost-zone-label">Cost mix</div>
      <div className="cost-bar">
        <div className="cost-bar-mat" style={{ width: materialWidth }}></div>
        <div className="cost-bar-svc" style={{ width: serviceWidth }}></div>
        <div className="cost-bar-finishing" style={{ width: finishingWidth }}></div>
        {showColorCost ? (
          <div className="cost-bar-color" style={{ width: colorWidth }}></div>
        ) : null}
      </div>
      <div className="cost-legend cost-legend-wide">
        <span>
          <i className="cost-dot cost-dot-mat" aria-hidden="true"></i>
          Material {materialPctLabel}%
        </span>
        <span>
          <i className="cost-dot cost-dot-svc" aria-hidden="true"></i>
          Service {servicePctLabel}%
        </span>
        <span>
          <i className="cost-dot cost-dot-finishing" aria-hidden="true"></i>
          Finishing {finishingPctLabel}%
        </span>
        {showColorCost ? (
          <span>
            <i className="cost-dot cost-dot-color" aria-hidden="true"></i>
            Color {colorPctLabel}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
