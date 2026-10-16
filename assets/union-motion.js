/* Black Kite Union — motion helpers (soft mockup only) */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll reveal via IntersectionObserver */
  function revealAll(sel) {
    var nodes = document.querySelectorAll(sel);
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (el) { io.observe(el); });
  }

  /* Existing chapter copy + new .reveal blocks */
  revealAll(".chapter");
  revealAll(".reveal");

  /* Ingredient / beer chips — hover, focus, Escape, tap */
  var strip = document.querySelector(".chip-strip");
  if (!strip) return;

  var openChip = null;
  var openPanel = null;

  function closePanel() {
    if (openPanel) {
      openPanel.classList.remove("is-open");
      openPanel.setAttribute("hidden", "");
      openPanel = null;
    }
    if (openChip) {
      openChip.classList.remove("is-open");
      openChip.setAttribute("aria-expanded", "false");
      openChip = null;
    }
  }

  function positionPanel(chip, panel) {
    /* Keep panel inside strip horizontally */
    panel.style.left = "0px";
    var stripRect = strip.getBoundingClientRect();
    var chipRect = chip.getBoundingClientRect();
    var panelW = Math.min(420, window.innerWidth * 0.92);
    var left = chipRect.left - stripRect.left;
    if (left + panelW > stripRect.width) {
      left = Math.max(0, stripRect.width - panelW);
    }
    panel.style.left = left + "px";
  }

  function openFor(chip) {
    var id = chip.getAttribute("aria-controls");
    var panel = id ? document.getElementById(id) : null;
    if (!panel) return;
    if (openChip === chip) {
      closePanel();
      return;
    }
    closePanel();
    openChip = chip;
    openPanel = panel;
    chip.classList.add("is-open");
    chip.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");
    panel.classList.add("is-open");
    positionPanel(chip, panel);
  }

  strip.querySelectorAll(".chip").forEach(function (chip) {
    chip.setAttribute("aria-expanded", "false");
    chip.addEventListener("mouseenter", function () { openFor(chip); });
    chip.addEventListener("focus", function () { openFor(chip); });
    chip.addEventListener("click", function (e) {
      e.preventDefault();
      openFor(chip);
    });
  });

  strip.addEventListener("mouseleave", function () {
    /* Delay so moving into panel doesn't flash-close */
    setTimeout(function () {
      if (!strip.matches(":hover") && !(openChip && openChip === document.activeElement)) {
        closePanel();
      }
    }, 120);
  });

  strip.querySelectorAll(".chip-panel .close").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      closePanel();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  document.addEventListener("click", function (e) {
    if (!strip.contains(e.target)) closePanel();
  });

  window.addEventListener("resize", function () {
    if (openChip && openPanel) positionPanel(openChip, openPanel);
  });
})();
