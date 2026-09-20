import { createRoot } from "react-dom/client";
import { FormulaVariablesList } from "./FormulaVariablesList.jsx";

let formulaVariablesListRoot = null;
let formulaVariablesListEl = null;

export function unmountFormulaVariablesTable() {
  if (!formulaVariablesListRoot) return;
  formulaVariablesListRoot.unmount();
  formulaVariablesListRoot = null;
  formulaVariablesListEl = null;
}

export function mountFormulaVariablesTable(element, model) {
  if (!element) return;
  if (formulaVariablesListRoot && formulaVariablesListEl !== element) {
    formulaVariablesListRoot.unmount();
    formulaVariablesListRoot = null;
    formulaVariablesListEl = null;
  }
  if (!formulaVariablesListRoot) {
    formulaVariablesListRoot = createRoot(element);
    formulaVariablesListEl = element;
  }
  formulaVariablesListRoot.render(
    <FormulaVariablesList fixedRows={model.fixedRows} groups={model.groups} />
  );
}
