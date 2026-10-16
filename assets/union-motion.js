/* Black Kite Union — motion helpers (soft mockup only) */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

  /* Enable motion-hide only after JS is present (FOUC-safe .reveal) */
  document.documentElement.classList.add("js-motion");

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

  /* Ingredient / beer chips — hover (fine), click-toggle (coarse), Escape, tap */
  var strip = document.querySelector(".chip-strip");
  if (!strip) return;

  var openChip = null;
  var openPanel = null;
  var leaveTimer = null;

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
    panel.style.left = "12px";
    var stripRect = strip.getBoundingClientRect();
    var chipRect = chip.getBoundingClientRect();
    var maxW = Math.min(420, window.innerWidth - 24);
    var panelW = maxW;
    var left = chipRect.left - stripRect.left;
    if (left < 12) left = 12;
    if (left + panelW > stripRect.width - 12) {
      left = Math.max(12, stripRect.width - panelW - 12);
    }
    /* Keep panel in viewport horizontally */
    var absLeft = stripRect.left + left;
    if (absLeft < 12) left = 12 - stripRect.left;
    if (absLeft + panelW > window.innerWidth - 12) {
      left = window.innerWidth - 12 - panelW - stripRect.left;
    }
    if (left < 12) left = 12;
    panel.style.left = left + "px";
    panel.style.maxWidth = maxW + "px";
    panel.style.width = maxW + "px";

    /* Prefer below; flip above if not enough room below */
    panel.style.top = "";
    panel.style.bottom = "";
    var probeTop = "calc(100% + 12px)";
    panel.style.top = probeTop;
    var pr = panel.getBoundingClientRect();
    if (pr.bottom > window.innerHeight - 8) {
      panel.style.top = "auto";
      panel.style.bottom = "calc(100% + 12px)";
    }
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

  function scheduleClose() {
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = setTimeout(function () {
      if (strip.matches(":hover")) return;
      if (openPanel && openPanel.matches(":hover")) return;
      if (openChip && openChip === document.activeElement) return;
      closePanel();
    }, 120);
  }

  function cancelClose() {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      leaveTimer = null;
    }
  }

  strip.querySelectorAll(".chip").forEach(function (chip) {
    chip.setAttribute("aria-expanded", "false");
    if (!coarse) {
      chip.addEventListener("mouseenter", function () {
        cancelClose();
        openFor(chip);
      });
    }
    chip.addEventListener("focus", function () { openFor(chip); });
    chip.addEventListener("click", function (e) {
      e.preventDefault();
      openFor(chip);
    });
  });

  strip.addEventListener("mouseleave", function () {
    if (coarse) return;
    scheduleClose();
  });
  strip.addEventListener("mouseenter", cancelClose);

  strip.querySelectorAll(".chip-panel").forEach(function (panel) {
    panel.addEventListener("mouseenter", cancelClose);
    panel.addEventListener("mouseleave", function () {
      if (coarse) return;
      scheduleClose();
    });
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
