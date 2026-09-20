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

function StyleFormulaRow({ row }) {
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

function StylePerimeterRow({ perimeter }) {
  return (
    <div className="style-formula-row">
      <div>
        <div>Perimeter:</div>
        <div className="stat-hint mono">{perimeter.expression}</div>
      </div>
      <div className="style-formula-value">
        <span className="formula-cell">
          {perimeter.success ? (
            <strong>= {perimeter.valueText}</strong>
          ) : (
            <span className="field-error">{perimeter.errorText}</span>
          )}
          <FormulaHelpButton
            kind={perimeter.explainKind}
            line={perimeter.explainLine}
            ariaLabel={perimeter.explainAriaLabel}
          />
        </span>
      </div>
    </div>
  );
}

export function BomStyleFormulas({ styleName, empty, independent, coveredGroup, perimeter }) {
  return (
    <>
      <p className="stat-hint" style={{ margin: "0 0 12px" }}>
        Linked to style <strong>{styleName}</strong>. Values update when the finished good or style variables change.
      </p>
      <div className="style-formula-results">
        {empty ? (
          <p className="stat-hint" style={{ margin: 0 }}>
            No style formulas linked to this style.
          </p>
        ) : (
          <>
            {independent.map((row) => (
              <StyleFormulaRow key={row.key} row={row} />
            ))}
            {coveredGroup ? (
              coveredGroup.hasNested ? (
                <div className="style-formula-group">
                  <div className="style-formula-group-head">Covered Area calculation</div>
                  <p className="stat-hint style-formula-group-note">
                    These formulas are used, in order, to derive Covered Area.
                  </p>
                  {coveredGroup.rows.map((row) => (
                    <StyleFormulaRow key={row.key} row={row} />
                  ))}
                </div>
              ) : (
                coveredGroup.rows.map((row) => (
                  <StyleFormulaRow key={row.key} row={row} />
                ))
              )
            ) : null}
          </>
        )}
        <StylePerimeterRow perimeter={perimeter} />
      </div>
    </>
  );
}
