import { createRoot } from "react-dom/client";
import { HeaderTitle } from "./HeaderTitle.jsx";
import { HeaderSubtitle } from "./HeaderSubtitle.jsx";

let headerTitleRoot = null;
let headerTitleEl = null;
let headerSubtitleRoot = null;
let headerSubtitleEl = null;

export function unmountHeaderTitles() {
  if (headerTitleRoot) {
    headerTitleRoot.unmount();
    headerTitleRoot = null;
    headerTitleEl = null;
  }
  if (headerSubtitleRoot) {
    headerSubtitleRoot.unmount();
    headerSubtitleRoot = null;
    headerSubtitleEl = null;
  }
}

export function mountHeaderTitles(titleElement, subtitleElement, model) {
  if (titleElement) {
    if (headerTitleRoot && headerTitleEl !== titleElement) {
      headerTitleRoot.unmount();
      headerTitleRoot = null;
      headerTitleEl = null;
    }
    if (!headerTitleRoot) {
      headerTitleRoot = createRoot(titleElement);
      headerTitleEl = titleElement;
    }
    headerTitleRoot.render(<HeaderTitle title={model.title} />);
  }
  if (subtitleElement) {
    if (headerSubtitleRoot && headerSubtitleEl !== subtitleElement) {
      headerSubtitleRoot.unmount();
      headerSubtitleRoot = null;
      headerSubtitleEl = null;
    }
    if (!headerSubtitleRoot) {
      headerSubtitleRoot = createRoot(subtitleElement);
      headerSubtitleEl = subtitleElement;
    }
    headerSubtitleRoot.render(<HeaderSubtitle subtitle={model.subtitle} />);
  }
}
