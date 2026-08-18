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
      const original = el.textContent;
      let timer;
      el.addEventListener("click", (event) => {
        event.preventDefault();
        copyText(email)
          .then(() => {
            el.textContent = "Copied";
            clearTimeout(timer);
            timer = setTimeout(() => {
              el.textContent = original;
            }, 1800);
          })
          .catch(() => {
            window.location.href = "mailto:" + email;
          });
      });
    });
  }

  const HTML2CANVAS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
  const JSPDF_SRC = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  const scriptLoaders = {};

  function loadScript(src) {
    if (scriptLoaders[src]) return scriptLoaders[src];
    scriptLoaders[src] = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        delete scriptLoaders[src];
        reject(new Error("Failed to load " + src));
      };
      document.head.appendChild(script);
    });
    return scriptLoaders[src];
  }

  function loadPdfLibraries() {
    return Promise.all([loadScript(HTML2CANVAS_SRC), loadScript(JSPDF_SRC)]).then(() => {
      const html2canvas = window.html2canvas;
      const jsPDF = window.jspdf?.jsPDF;
      if (!html2canvas || !jsPDF) throw new Error("PDF libraries failed to initialize");
      return { html2canvas, jsPDF };
    });
  }

  function preparePdfClone(clonedDoc, options) {
    const opts = options || {};
    if (typeof opts.onClone === "function") opts.onClone(clonedDoc);
    clonedDoc.querySelectorAll("[data-print-hide]").forEach((node) => {
      node.setAttribute("data-html2canvas-ignore", "true");
      node.style.setProperty("display", "none", "important");
    });
    clonedDoc.querySelectorAll("[data-reveal]").forEach((node) => {
      node.style.opacity = "1";
      node.style.transform = "none";
      node.style.transition = "none";
    });
  }

  function downloadLetterPdf(element, options) {
    const opts = options || {};
    const source = element;
    if (!source) return Promise.reject(new Error("Nothing to export"));

    const margin = opts.margin ?? 0.32;
    const filename = opts.filename ?? "Brian-Du-Resume.pdf";
    const backgroundColor = opts.backgroundColor ?? "#EDEDEB";
    const windowWidth = opts.windowWidth ?? 1000;

    return loadPdfLibraries().then(({ html2canvas, jsPDF }) => {
      const ready = document.fonts?.ready || Promise.resolve();
      return ready.then(() =>
        html2canvas(source, {
          scale: 2,
          useCORS: true,
          backgroundColor,
          windowWidth,
          logging: false,
          onclone: (clonedDoc) => preparePdfClone(clonedDoc, opts),
        }).then((canvas) => {
          const pdf = new jsPDF({ unit: "in", format: "letter", orientation: "portrait", compress: true });
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const contentWidth = pageWidth - margin * 2;
          const contentHeight = pageHeight - margin * 2;
          const pxPerIn = canvas.width / contentWidth;
          const pagePx = Math.floor(contentHeight * pxPerIn);
          const slice = document.createElement("canvas");
          let y = 0;
          let page = 0;

          while (y < canvas.height) {
            const slicePx = Math.min(pagePx, canvas.height - y);
            slice.width = canvas.width;
            slice.height = slicePx;
            const ctx = slice.getContext("2d");
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, slice.width, slice.height);
            ctx.drawImage(canvas, 0, y, canvas.width, slicePx, 0, 0, canvas.width, slicePx);
            if (page > 0) pdf.addPage();
            pdf.setFillColor(237, 237, 235);
            pdf.rect(0, 0, pageWidth, pageHeight, "F");
            pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, contentWidth, slicePx / pxPerIn);
            y += slicePx;
            page += 1;
          }

          pdf.save(filename);
        })
      );
    });
  }

  window.bdDownloadLetterPdf = downloadLetterPdf;

  document.addEventListener("DOMContentLoaded", () => {
    applyStyleHover();
    hideBrokenFrames();
    bindCopyEmail();
  });
})();
