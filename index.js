/* =========================================================
   JP Peng — index.js (Static, professional)
   Keeps only:
   (1) Keyboard-only focus outlines (accessibility standard)
   (2) Back-to-top button show/hide (minimal + smooth)
   (3) Footer year auto-update
   No scroll/section transition animations.
   ========================================================= */

(() => {
  "use strict";

  /* -----------------------------------------
     1) Focus outline only for keyboard users
  ------------------------------------------ */
  function enableKeyboardFocus() {
    document.body.classList.add("user-is-tabbing");
  }

  function disableKeyboardFocus() {
    document.body.classList.remove("user-is-tabbing");
  }

  function onKeyDown(e) {
    // Show focus rings only when user starts navigating via keyboard.
    // Cover Tab + arrow keys for better accessibility behavior.
    const keysThatSuggestKeyboardNav = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (keysThatSuggestKeyboardNav.includes(e.key)) enableKeyboardFocus();
  }

  function onMouseDown() {
    disableKeyboardFocus();
  }

  window.addEventListener("keydown", onKeyDown, { passive: true });
  window.addEventListener("mousedown", onMouseDown, { passive: true });
  window.addEventListener("touchstart", onMouseDown, { passive: true });

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

  // show after a modest scroll; a bit lower than before to match the new top hero layout
  const SHOW_AFTER_PX = 420;

  function onScroll() {
    setBackToTopVisible(window.scrollY > SHOW_AFTER_PX);
  }

  if (backToTopButton) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initialize state
  }

  /* -----------------------------------------
     3) Footer year (auto)
  ------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
