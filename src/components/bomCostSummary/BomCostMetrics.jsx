export function BomCostMetric({ label, value, hasError }) {
  return (
    <>
      <span className="cost-metric-label">{label}</span>
      <strong className="cost-metric-value">
        {hasError ? (
          <span className="cost-metric-error">Error calculating cost</span>
        ) : (
          value
        )}
      </strong>
    </>
  );
}
