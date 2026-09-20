import { createRoot } from "react-dom/client";

const mountNode = document.getElementById("react-migration-root");
if (!mountNode) {
  throw new Error("React migration mount #react-migration-root is missing.");
}

createRoot(mountNode).render(null);
mountNode.setAttribute("data-react-migration", "ready");
