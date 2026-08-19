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

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setupBrandHover() {
    const root = document;
    const ease = "cubic-bezier(.16,.84,.28,1)";
    const spring = "cubic-bezier(.34,1.42,.64,1)";
    const still = prefersReducedMotion();

    root.querySelectorAll("[data-nav-link]").forEach((link) => {
      if (link.__hoverReady) return;
      link.__hoverReady = true;
      const base = link.style.color || "#68686F";
      link.style.transition = "color 280ms " + ease;
      const rule = document.createElement("span");
      rule.setAttribute("aria-hidden", "true");
      rule.style.cssText =
        "position:absolute;left:0;right:0;bottom:-5px;height:1.5px;border-radius:2px;background:#6F6CAE;pointer-events:none;transform:scaleX(0);transform-origin:left center;transition:transform 460ms " +
        ease;
      link.appendChild(rule);
      link.addEventListener("pointerenter", () => {
        link.style.color = "#242426";
        if (still) return;
        rule.style.transformOrigin = "left center";
        rule.style.transform = "scaleX(1)";
      });
      link.addEventListener("pointerleave", () => {
        link.style.color = base;
        if (still) return;
        rule.style.transformOrigin = "right center";
        rule.style.transform = "scaleX(0)";
      });
    });

    root.querySelectorAll("[data-sweep]").forEach((btn) => {
      if (btn.__hoverReady) return;
      btn.__hoverReady = true;
      const fill = btn.getAttribute("data-sweep");
      const fg = btn.getAttribute("data-sweep-text") || "#FAFAF8";
      const base = btn.style.color;
      if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.style.isolation = "isolate";
      const layer = document.createElement("span");
      layer.setAttribute("aria-hidden", "true");
      layer.style.cssText =
        "position:absolute;top:0;left:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:999px;background:" +
        fill +
        ";pointer-events:none;transform:scale(0);transition:transform 620ms " +
        ease +
        ";";
      const wrap = document.createElement("span");
      wrap.setAttribute("data-sweep-label", "");
      wrap.style.cssText =
        "position:relative;z-index:1;display:inline-block;transition:transform 460ms " + spring + ";";
      while (btn.firstChild) wrap.appendChild(btn.firstChild);
      btn.appendChild(layer);
      btn.appendChild(wrap);
      btn.style.transition = "color 260ms " + ease + ", transform 460ms " + spring;
      btn.addEventListener("pointerenter", (e) => {
        btn.style.color = fg;
        if (still) return;
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        layer.style.left = x + "px";
        layer.style.top = y + "px";
        const far = Math.sqrt(
          Math.pow(Math.max(x, r.width - x), 2) + Math.pow(Math.max(y, r.height - y), 2)
        );
        layer.style.transition = "transform 620ms " + ease;
        layer.style.transform = "scale(" + (far / 6 + 1).toFixed(2) + ")";
        btn.style.transform = "translateY(-1.5px)";
        wrap.style.transform = "translateY(-1px)";
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.color = base;
        if (still) return;
        layer.style.transition = "transform 420ms " + ease;
        layer.style.transform = "scale(0)";
        btn.style.transform = "none";
        wrap.style.transform = "none";
      });
      btn.addEventListener("pointerdown", () => {
        if (!still) btn.style.transform = "translateY(-1.5px) scale(0.965)";
      });
      btn.addEventListener("pointerup", () => {
        if (!still) btn.style.transform = "translateY(-1.5px)";
      });
    });

    root.querySelectorAll("[data-logo]").forEach((logo) => {
      if (logo.__hoverReady) return;
      logo.__hoverReady = true;
      const mark = logo.querySelector("[data-logo-mark]");
      const accent = logo.querySelector("[data-logo-accent]");
      const word = logo.querySelector("[data-logo-word]");
      if (mark) {
        mark.style.transformOrigin = "center";
        mark.style.transition = "transform 320ms " + ease;
      }
      if (accent) accent.style.transition = "fill 320ms " + ease;
      if (word) word.style.transition = "color 280ms " + ease;
      logo.addEventListener("pointerenter", () => {
        if (accent) accent.setAttribute("fill", "#6F6CAE");
        if (word) word.style.color = "#6F6CAE";
        if (!still && mark) mark.style.transform = "scale(1.05)";
      });
      logo.addEventListener("pointerleave", () => {
        if (accent) accent.setAttribute("fill", "#8885C3");
        if (word) word.style.color = "#242426";
        if (!still && mark) mark.style.transform = "none";
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

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject) => {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(input);
      if (ok) resolve();
      else reject(new Error("copy failed"));
    });
  }

  function bindCopyEmail() {
    document.querySelectorAll("[data-copy-email]").forEach((el) => {
      const email = el.getAttribute("data-copy-email") || "";
      if (!email) return;
      const label = el.querySelector("[data-sweep-label]") || el;
      const original = label.textContent;
      let timer;
      el.addEventListener("click", (event) => {
        event.preventDefault();
        copyText(email)
          .then(() => {
            label.textContent = "Copied";
            clearTimeout(timer);
            timer = setTimeout(() => {
              label.textContent = original;
            }, 1800);
          })
          .catch(() => {
            window.location.href = "mailto:" + email;
          });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyStyleHover();
    setupBrandHover();
    hideBrokenFrames();
    bindCopyEmail();
  });
})();
