import { BomProductInfo } from "./BomProductInfo.jsx";
import { BomStyleFormulas } from "./BomStyleFormulas.jsx";
import { BomMaterialFormula } from "./BomMaterialFormula.jsx";

export function BomInfoPopupBody({ model }) {
  if (!model) return null;
  if (model.kind === "product") {
    return (
      <BomProductInfo
        productName={model.productName}
        variant={model.variant}
        style={model.style}
        plyDisplay={model.plyDisplay}
        plyStructureTitle={model.plyStructureTitle}
        uom={model.uom}
        dimensions={model.dimensions}
        plyAriaLabel={model.plyAriaLabel}
        plyLayers={model.plyLayers}
      />
    );
  }
  if (model.kind === "material-formula") {
    return (
      <BomMaterialFormula
        styleName={model.styleName}
        materialLabel={model.materialLabel}
        layerLabel={model.layerLabel}
        lengthRow={model.lengthRow}
        widthRow={model.widthRow}
        coveredGroup={model.coveredGroup}
        qtyRow={model.qtyRow}
      />
    );
  }
  return (
    <BomStyleFormulas
      styleName={model.styleName}
      empty={model.empty}
      independent={model.independent}
      coveredGroup={model.coveredGroup}
      perimeter={model.perimeter}
    />
  );
}
