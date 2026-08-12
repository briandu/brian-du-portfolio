/* Minimal Claude Design runtime for the converted portfolio pages. */
(function () {
  "use strict";

  class DCLogic {
    constructor() {
      this.el = null;
      this.props = {};
    }
    componentDidMount() {}
    componentDidUpdate() {}
    componentWillUnmount() {}
    renderVals() {
      return {};
    }
  }

  window.DCLogic = DCLogic;

  function applyStyleHover() {
    document.querySelectorAll("[data-style-hover]").forEach((el) => {
      const hover = el.getAttribute("data-style-hover") || "";
      const base = el.getAttribute("style") || "";
      el.addEventListener("mouseenter", () => {
        el.setAttribute("style", base + ";" + hover);
      });
      el.addEventListener("mouseleave", () => {
        el.setAttribute("style", base);
      });
    });
  }

  function hideBrokenFrames() {
    const frames = Array.from(document.querySelectorAll("[data-frame-img]"));
    if (!frames.length) return;

    let loaded = 0;
    let failed = 0;
    const fallback = document.querySelector("[data-figure-fallback]");
    const readout = document.querySelector("[data-frame-readout]");

    const maybeShowFallback = () => {
      if (failed === frames.length && fallback) {
        fallback.style.display = "flex";
        frames.forEach((img) => {
          img.style.display = "none";
        });
        if (readout) readout.textContent = "FRAMES PENDING";
      } else if (loaded > 0 && fallback) {
        fallback.style.display = "none";
      }
    };

    frames.forEach((img) => {
      const isDefault = img.hasAttribute("data-frame-default");
      if (!isDefault) img.style.opacity = "0";
      img.addEventListener("load", () => {
        loaded += 1;
        maybeShowFallback();
        if (isDefault) img.style.opacity = "1";
      });
      img.addEventListener("error", () => {
        failed += 1;
        img.style.display = "none";
        maybeShowFallback();
      });
      if (img.complete) {
        if (img.naturalWidth > 0) {
          loaded += 1;
          if (isDefault) img.style.opacity = "1";
        } else {
          failed += 1;
          img.style.display = "none";
        }
        maybeShowFallback();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyStyleHover();
    hideBrokenFrames();
  });
})();
