import { createRoot } from "react-dom/client";
import { BomHeaderMeta } from "./BomHeaderMeta.jsx";

let bomHeaderMetaRoot = null;
let bomHeaderMetaEl = null;

export function unmountBomHeaderMeta() {
  if (!bomHeaderMetaRoot) return;
  bomHeaderMetaRoot.unmount();
  bomHeaderMetaRoot = null;
  bomHeaderMetaEl = null;
}

export function mountBomHeaderMeta(element, model) {
  if (!element) return;
  if (bomHeaderMetaRoot && bomHeaderMetaEl !== element) {
    bomHeaderMetaRoot.unmount();
    bomHeaderMetaRoot = null;
    bomHeaderMetaEl = null;
  }
  if (!bomHeaderMetaRoot) {
    bomHeaderMetaRoot = createRoot(element);
    bomHeaderMetaEl = element;
  }
  bomHeaderMetaRoot.render(
    <BomHeaderMeta
      bomNo={model.bomNo}
      version={model.version}
      statusLabel={model.statusLabel}
      statusActive={model.statusActive}
    />
  );
}
