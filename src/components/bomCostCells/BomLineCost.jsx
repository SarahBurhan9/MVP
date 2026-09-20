export function BomLineCost({ hasError, displayValue }) {
  if (hasError) {
    return <span className="calc-error-cost">Error</span>;
  }
  return displayValue;
}
