/* =========================================================
   JP Peng — Portfolio JS
   - Keyboard focus outline only for keyboard users
   - Back-to-top visibility
   - PDF modal viewer (open/close, ESC, overlay click, focus management)
   - Footer year auto-update
   ========================================================= */

/* -----------------------------------------
  Focus outline only for keyboard users
---------------------------------------- */
const handleFirstTab = (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
    window.removeEventListener("keydown", handleFirstTab);
    window.addEventListener("mousedown", handleMouseDownOnce);
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove("user-is-tabbing");
  window.removeEventListener("mousedown", handleMouseDownOnce);
  window.addEventListener("keydown", handleFirstTab);
};

window.addEventListener("keydown", handleFirstTab);

/* -----------------------------------------
  Footer year
---------------------------------------- */
(() => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* -----------------------------------------
  Back to top
---------------------------------------- */
const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

const alterBackToTopStyles = (visible) => {
  if (!backToTopButton) return;
  backToTopButton.style.visibility = visible ? "visible" : "hidden";
  backToTopButton.style.opacity = visible ? "1" : "0";
  backToTopButton.style.transform = visible ? "scale(1)" : "scale(.92)";
};

window.addEventListener("scroll", () => {
  if (!backToTopButton) return;
  isBackToTopRendered = window.scrollY > 700;
  alterBackToTopStyles(isBackToTopRendered);
});

/* -----------------------------------------
  PDF Modal Viewer
  Buttons: .js-open-pdf with data-pdf="path/to.pdf"
  Modal:   #pdf-modal
  Frame:   #pdf-frame
  Close:   .js-close-pdf or overlay click
---------------------------------------- */
const modal = document.getElementById("pdf-modal");
const pdfFrame = document.getElementById("pdf-frame");
const openNewTabLink = document.getElementById("pdf-open-newtab");

const openButtons = document.querySelectorAll(".js-open-pdf");
const closeButtons = document.querySelectorAll(".js-close-pdf");

let lastFocusedEl = null;

const isModalOpen = () => modal && modal.getAttribute("aria-hidden") === "false";

const setPdfSrc = (src) => {
  if (!pdfFrame) return;
  // Make sure src is non-empty; if empty, clear.
  pdfFrame.src = src || "";
  if (openNewTabLink) openNewTabLink.href = src || "#";
};

const openModal = (pdfPath) => {
  if (!modal) return;
  lastFocusedEl = document.activeElement;

  // Update PDF
  setPdfSrc(pdfPath);

  // Show modal
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus the first close button for accessibility
  const focusTarget =
    modal.querySelector(".js-close-pdf") ||
    modal.querySelector("button, a, [tabindex]:not([tabindex='-1'])");
  if (focusTarget) focusTarget.focus();
};

const closeModal = () => {
  if (!modal) return;

  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Clear iframe to stop loading / release resources
  setPdfSrc("");

  // Restore focus
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
    lastFocusedEl.focus();
  }
};

/* Attach open handlers */
openButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const pdfPath = btn.getAttribute("data-pdf");
    if (!pdfPath) return;
    openModal(pdfPath);
  });
});

/* Attach close handlers */
closeButtons.forEach((btn) => {
  btn.addEventListener("click", closeModal);
});

/* Close on ESC */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isModalOpen()) {
    e.preventDefault();
    closeModal();
  }
});

/* Close when clicking the overlay */
if (modal) {
  modal.addEventListener("click", (e) => {
    // If user clicks overlay (not the panel), close
    const overlay = modal.querySelector(".modal__overlay");
    if (overlay && e.target === overlay) closeModal();
  });
}

/* Basic focus trap inside modal */
window.addEventListener("keydown", (e) => {
  if (!isModalOpen() || e.key !== "Tab" || !modal) return;

  const focusables = modal.querySelectorAll(
    "a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex='-1'])"
  );

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  // shift+tab on first -> jump to last
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  }
  // tab on last -> jump to first
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
