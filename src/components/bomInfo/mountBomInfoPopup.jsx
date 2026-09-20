import { createRoot } from "react-dom/client";
import { BomInfoPopupBody } from "./BomInfoPopupBody.jsx";

let bomInfoPopupRoot = null;
let bomInfoPopupEl = null;

export function unmountBomInfoPopup() {
  if (!bomInfoPopupRoot) return;
  bomInfoPopupRoot.unmount();
  bomInfoPopupRoot = null;
  bomInfoPopupEl = null;
}

export function mountBomInfoPopup(element, model) {
  if (!element) return;
  if (bomInfoPopupRoot && bomInfoPopupEl !== element) {
    unmountBomInfoPopup();
  }
  if (!bomInfoPopupRoot) {
    bomInfoPopupRoot = createRoot(element);
    bomInfoPopupEl = element;
  }
  bomInfoPopupRoot.render(<BomInfoPopupBody model={model} />);
}
