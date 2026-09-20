import { BomProductInfo } from "./BomProductInfo.jsx";
import { BomStyleFormulas } from "./BomStyleFormulas.jsx";

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
