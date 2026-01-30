/* =========================================================
   JP Peng — index.js (Static, professional)
   Per your latest requirement:
   - REMOVE all scroll/page transition animations
   - Keep only:
     (1) Keyboard-only focus outlines (accessibility standard)
     (2) Back-to-top button show/hide (clean + minimal)
     (3) Footer year auto-update
   ========================================================= */

/* -----------------------------------------
   1) Focus outline only for keyboard users
------------------------------------------ */
function handleFirstTab(e) {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  }
}

function handleMouseDownOnce() {
  document.body.classList.remove("user-is-tabbing");
  window.removeEventListener("mousedown", handleMouseDownOnce);
  window.addEventListener("keydown", handleFirstTab);
}

window.addEventListener("keydown", handleFirstTab);

/* -----------------------------------------
   2) Back to top button toggle
------------------------------------------ */
const backToTopButton = document.querySelector(".back-to-top");

function setBackToTopVisible(visible) {
  if (!backToTopButton) return;
  backToTopButton.style.visibility = visible ? "visible" : "hidden";
  backToTopButton.style.opacity = visible ? "1" : "0";
  backToTopButton.style.transform = visible ? "scale(1)" : "scale(0.92)";
}

function onScroll() {
  // show after a modest scroll; tuned for your layout
  const show = window.scrollY > 520;
  setBackToTopVisible(show);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll(); // initialize state

/* -----------------------------------------
   3) Footer year (auto)
------------------------------------------ */
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
