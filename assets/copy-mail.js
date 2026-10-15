/* Soft mockup: copy beer@blackkite.hk only — never send. */
(function () {
  document.querySelectorAll("button.mail,[data-copy]").forEach(function (b) {
    if (b.tagName !== "BUTTON" && !b.hasAttribute("data-copy")) return;
    b.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var addr = b.getAttribute("data-copy") || "beer@blackkite.hk";
      var old = b.textContent;
      var done = function () {
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = old; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else {
        done();
      }
    });
  });
})();
