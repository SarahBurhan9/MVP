import { Fragment } from "react";

export function BomProductInfo({
  productName,
  variant,
  style,
  plyDisplay,
  plyStructureTitle,
  uom,
  dimensions,
  plyAriaLabel,
  plyLayers
}) {
  return (
    <>
      <div className="section-kicker">Finished Good</div>
      <div className="product-name">{productName}</div>
      <div className="pi-grid" style={{ marginTop: 12 }}>
        <div>
          <div className="pi-fields">
            <div>
              <div className="field-label">Variant</div>
              <div className="field-value">{variant}</div>
            </div>
            <div>
              <div className="field-label">Style</div>
              <div className="field-value">{style}</div>
            </div>
            <div>
              <div className="field-label">Ply</div>
              <div className="field-value">{plyDisplay}</div>
            </div>
            <div>
              <div className="field-label">UOM</div>
              <div className="field-value">{uom}</div>
            </div>
            <div>
              <div className="field-label">Dimensions</div>
              <div className="field-value">{dimensions}</div>
            </div>
          </div>
        </div>
        <div>
          <div className="section-kicker" style={{ marginBottom: 8 }}>
            {plyStructureTitle}
          </div>
          <div className="ply-stack" aria-label={plyAriaLabel}>
            {plyLayers.map((item, index) => (
              <Fragment key={`${item.layer}-${index}`}>
                <div className={`ply-layer${item.className ? ` ${item.className}` : ""}`}>
                  {item.layer}
                  {item.name ? <span className="ply-name">{item.name}</span> : null}
                </div>
                {item.showArrow ? <div className="ply-arrow">↓</div> : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
