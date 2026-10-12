export function BomLineCost({ hasError, displayValue, explainKind, explainLine }) {
  const help = explainKind != null && explainLine != null ? (
    <button
      type="button"
      className="formula-help-btn"
      data-explain-kind={explainKind}
      data-explain-line={explainLine}
      title="How this value was calculated"
      aria-label="How cost per piece was calculated"
    >
      ?
    </button>
  ) : null;
  if (hasError) {
    return (
      <>
        <span className="calc-error-cost">Error</span>
        {help}
      </>
    );
  }
  return (
    <>
      {displayValue}
      {help}
    </>
  );
}
