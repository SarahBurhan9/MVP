import { createRoot } from "react-dom/client";
import { BomLineCost } from "./BomLineCost.jsx";
import { BomSectionTotal } from "./BomSectionTotal.jsx";

const lineSlots = new Map();
const totalSlots = new Map();

function unmountStored(map, key) {
  const slot = map.get(key);
  if (!slot) return;
  if (slot.root) slot.root.unmount();
  map.delete(key);
}

function keyHasPrefix(key, prefixes) {
  return prefixes.some((prefix) => key === prefix || String(key).startsWith(prefix + ":"));
}

export function unmountBomCostCells(linePrefixes, totalIds) {
  const prefixes = Array.isArray(linePrefixes) ? linePrefixes : [];
  Array.from(lineSlots.keys()).forEach((key) => {
    if (keyHasPrefix(key, prefixes)) unmountStored(lineSlots, key);
  });
  (Array.isArray(totalIds) ? totalIds : []).forEach((id) => unmountStored(totalSlots, id));
}

export function unmountAllBomCostCells() {
  Array.from(lineSlots.keys()).forEach((key) => unmountStored(lineSlots, key));
  Array.from(totalSlots.keys()).forEach((key) => unmountStored(totalSlots, key));
}

function renderInto(map, key, element, node) {
  if (!element) {
    unmountStored(map, key);
    return;
  }
  let slot = map.get(key);
  if (slot && slot.el !== element) {
    unmountStored(map, key);
    slot = null;
  }
  if (!slot) {
    slot = { root: createRoot(element), el: element };
    map.set(key, slot);
  }
  slot.root.render(node);
}

export function mountBomLineCostCells(scope, modelsByHost) {
  if (!scope || !modelsByHost) return;
  const hosts = scope.querySelectorAll("[data-bom-line-cost]");
  hosts.forEach((element) => {
    const key = element.getAttribute("data-bom-line-cost");
    if (!key) return;
    const model = modelsByHost[key];
    if (!model) return;
    renderInto(
      lineSlots,
      key,
      element,
      <BomLineCost hasError={model.hasError} displayValue={model.displayValue} />
    );
  });
}

export function mountBomSectionTotal(totalId, model) {
  if (!totalId) return;
  const element = document.getElementById(totalId);
  if (!element || !model) {
    unmountStored(totalSlots, totalId);
    return;
  }
  renderInto(totalSlots, totalId, element, <BomSectionTotal displayValue={model.displayValue} />);
}
