import { createRoot } from "react-dom/client";
import { FormulasList } from "./FormulasList.jsx";

let formulasListRoot = null;
let formulasListEl = null;

export function unmountFormulasTable() {
  if (!formulasListRoot) return;
  formulasListRoot.unmount();
  formulasListRoot = null;
  formulasListEl = null;
}

export function mountFormulasTable(element, model) {
  if (!element) return;
  if (formulasListRoot && formulasListEl !== element) {
    formulasListRoot.unmount();
    formulasListRoot = null;
    formulasListEl = null;
  }
  if (!formulasListRoot) {
    formulasListRoot = createRoot(element);
    formulasListEl = element;
  }
  formulasListRoot.render(
    <FormulasList
      grouped={model.grouped}
      groups={model.groups}
      rows={model.rows}
      styleGroups={model.styleGroups}
    />
  );
}
