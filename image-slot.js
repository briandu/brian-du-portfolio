/* Placeholder custom element used by Seedwell case study slots. */
(function () {
  "use strict";

  class ImageSlot extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = "1";
      const placeholder = this.getAttribute("placeholder") || "Image forthcoming";
      this.style.display = "block";
      this.style.width = "100%";
      this.style.aspectRatio = this.getAttribute("shape") === "rect" ? "16 / 10" : "1";
      this.style.background = "linear-gradient(180deg, #F4F4F1, #E8E8E3)";
      this.innerHTML =
        '<div style="width:100%;height:100%;min-height:160px;display:flex;align-items:center;justify-content:center;padding:20px;text-align:center;font-family:Montserrat,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#68686F;">' +
        placeholder +
        "</div>";
    }
  }

  if (!customElements.get("image-slot")) {
    customElements.define("image-slot", ImageSlot);
  }
})();
