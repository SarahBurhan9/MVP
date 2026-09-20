import { createRoot } from "react-dom/client";
import { BomCostAlert } from "./BomCostAlert.jsx";
import { BomCostColorLine } from "./BomCostColorLine.jsx";
import { BomCostMetric } from "./BomCostMetrics.jsx";
import { BomCostMix } from "./BomCostMix.jsx";

const slots = {
  alert: { root: null, el: null },
  colorLine: { root: null, el: null },
  mix: { root: null, el: null },
  final: { root: null, el: null },
  sale: { root: null, el: null }
};

function unmountSlot(slot) {
  if (!slot.root) return;
  slot.root.unmount();
  slot.root = null;
  slot.el = null;
}

export function unmountBomCostSummary() {
  Object.keys(slots).forEach((key) => unmountSlot(slots[key]));
}

function renderSlot(slot, element, node) {
  if (!element) {
    unmountSlot(slot);
    return;
  }
  if (slot.root && slot.el !== element) {
    unmountSlot(slot);
  }
  if (!slot.root) {
    slot.root = createRoot(element);
    slot.el = element;
  }
  slot.root.render(node);
}

export function mountBomCostSummary(elements, model) {
  if (!elements) return;
  renderSlot(slots.alert, elements.alert, <BomCostAlert errors={model.errors} />);
  renderSlot(
    slots.colorLine,
    elements.colorLine,
    <BomCostColorLine visible={model.showColorCost} amount={model.colorAmount} />
  );
  renderSlot(
    slots.final,
    elements.final,
    <BomCostMetric label="Final Cost" value={model.finalCost} hasError={model.hasCalcErrors} />
  );
  renderSlot(
    slots.sale,
    elements.sale,
    <BomCostMetric label="Sale Cost" value={model.saleCost} hasError={model.hasCalcErrors} />
  );
  renderSlot(
    slots.mix,
    elements.mix,
    <BomCostMix
      showCostMix={model.showCostMix}
      showColorCost={model.showColorCost}
      materialWidth={model.materialWidth}
      serviceWidth={model.serviceWidth}
      finishingWidth={model.finishingWidth}
      colorWidth={model.colorWidth}
      materialPctLabel={model.materialPctLabel}
      servicePctLabel={model.servicePctLabel}
      finishingPctLabel={model.finishingPctLabel}
      colorPctLabel={model.colorPctLabel}
    />
  );
}
