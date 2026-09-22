function FormulaHelpButton({ kind, line, ariaLabel }) {
  return (
    <button
      type="button"
      className="formula-help-btn"
      data-explain-kind={kind}
      data-explain-line={line}
      title="How this value was calculated"
      aria-label={ariaLabel}
    >
      ?
    </button>
  );
}

function FormulaRow({ row }) {
  if (!row) return null;
  return (
    <div className={row.className}>
      <div>
        <div>
          {row.stepLabel ? <span className="style-formula-step">{row.stepLabel}</span> : null}
          <span className="mono">{row.code}</span>: {row.title}
        </div>
        <div className="stat-hint mono">{row.expression}</div>
        {row.hint ? <div className="stat-hint mono">{row.hint}</div> : null}
      </div>
      <div className="style-formula-value">
        <span className="formula-cell">
          {row.success ? (
            <strong>= {row.valueText}</strong>
          ) : (
            <span className="field-error">{row.errorText}</span>
          )}
          <FormulaHelpButton
            kind={row.explainKind}
            line={row.explainLine}
            ariaLabel={row.explainAriaLabel}
          />
        </span>
      </div>
    </div>
  );
}

export function BomMaterialFormula({ styleName, materialLabel, layerLabel, lengthRow, widthRow, coveredGroup, qtyRow }) {
  return (
    <>
      <p className="stat-hint" style={{ margin: "0 0 12px" }}>
        Quantity formula for <strong>{materialLabel}</strong>
        {layerLabel ? <> on <strong>{layerLabel}</strong></> : null}.
        Linked to style <strong>{styleName}</strong>. L, W, and covered area are the values used in this line.
      </p>
      <div className="style-formula-results">
        <FormulaRow row={lengthRow} />
        <FormulaRow row={widthRow} />
        {coveredGroup ? (
          coveredGroup.hasNested ? (
            <div className="style-formula-group">
              <div className="style-formula-group-head">Covered Area calculation</div>
              <p className="stat-hint style-formula-group-note">
                These formulas are used, in order, to derive Covered Area for this layer.
              </p>
              {coveredGroup.rows.map((row) => (
                <FormulaRow key={row.key} row={row} />
              ))}
            </div>
          ) : (
            coveredGroup.rows.map((row) => (
              <FormulaRow key={row.key} row={row} />
            ))
          )
        ) : null}
        <FormulaRow row={qtyRow} />
      </div>
    </>
  );
}
