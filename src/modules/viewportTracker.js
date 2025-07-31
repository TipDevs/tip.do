import { asideToggler } from "./toggle";
export function viewportTracker() {
  const toggleAside = asideToggler();
  const mobileMediaQuery = window.matchMedia('(max-width: 760px)');
  function applyLayout(mediaQuery) {
    if (mediaQuery.matches) {
      toggleAside.hideAsideEvent(mobileMediaQuery);
    }
    else {
      toggleAside.showAsideEvent(mobileMediaQuery);
    }
    }
  document.addEventListener("DOMContentLoaded", () => {
    applyLayout(mobileMediaQuery);
  });
  mobileMediaQuery.addEventListener("change", () => {
    applyLayout(mobileMediaQuery);
  });
}
