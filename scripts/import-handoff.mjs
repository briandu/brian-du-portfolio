import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceCandidates = [
  process.env.HANDOFF_DIR,
  path.join(process.env.TEMP || "", "portfolio-handoff", "design_handoff_portfolio_site"),
  path.join(process.env.LOCALAPPDATA || "", "Temp", "portfolio-handoff", "design_handoff_portfolio_site"),
  path.resolve("/tmp/portfolio-handoff/design_handoff_portfolio_site"),
].filter(Boolean);
const source = sourceCandidates.find((candidate) => fs.existsSync(candidate));

const pages = [
  { src: "Portfolio Home.dc.html", out: "index.html", title: "Brian Du — Product Design & Front-End" },
  { src: "Amplify Case Study.dc.html", out: "amplify.html", title: "Amplify — Brian Du" },
  { src: "Seedwell Case Study.dc.html", out: "seedwell.html", title: "Seedwell — Brian Du" },
  { src: "Portfolio Resume.dc.html", out: "resume.html", title: "Résumé — Brian Du" },
  { src: "Brand Guide.dc.html", out: "brand.html", title: "Brand Guide — Brian Du" },
];

const linkMap = {
  "./Portfolio Home.dc.html": "./index.html",
  "./Amplify Case Study.dc.html": "./amplify.html",
  "./Seedwell Case Study.dc.html": "./seedwell.html",
  "./Portfolio Resume.dc.html": "./resume.html",
  "./Resume.dc.html": "./Brian-Du-Resume.pdf",
  "./Brand Guide.dc.html": "./brand.html",
  "Portfolio Home.dc.html": "index.html",
  "Amplify Case Study.dc.html": "amplify.html",
  "Seedwell Case Study.dc.html": "seedwell.html",
  "Portfolio Resume.dc.html": "resume.html",
  "Resume.dc.html": "Brian-Du-Resume.pdf",
  "Brand Guide.dc.html": "brand.html",
};

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function extractHelmet(html) {
  const match = html.match(/<helmet>([\s\S]*?)<\/helmet>/i);
  return match ? match[1].trim() : "";
}

function convertPage(html, title) {
  const helmet = extractHelmet(html);

  let body = html
    .replace(/<!DOCTYPE html>[\s\S]*?<body>/i, "")
    .replace(/<\/body>\s*<\/html>\s*$/i, "")
    .replace(/<x-dc>/gi, "")
    .replace(/<\/x-dc>/gi, "")
    .replace(/<helmet>[\s\S]*?<\/helmet>/i, "")
    .replace(/<script src="\.\/support\.js"><\/script>\s*/gi, "")
    .replace(/<script src="\.\/image-slot\.js"><\/script>\s*/gi, "");

  // Always-show sc-if blocks (defaults are true in the design)
  body = body
    .replace(/<sc-if\b[^>]*>/gi, "")
    .replace(/<\/sc-if>/gi, "");

  // Template bindings used by brand guide
  body = body.replace(/\{\{\s*descriptor\s*\}\}/g, "Product Design &amp; Front-End");

  // Convert style-hover custom attr to data attribute for runtime
  body = body.replace(/\sstyle-hover="/g, ' data-style-hover="');

  // Rewrite internal links
  for (const [from, to] of Object.entries(linkMap)) {
    body = body.split(from).join(to);
  }

  // Convert DC scripts to browser-executable modules
  body = body.replace(
    /<script type="text\/x-dc" data-dc-script([^>]*)>([\s\S]*?)<\/script>/gi,
    (_full, attrs, code) => {
      const propsMatch = attrs.match(/data-props="([^"]*)"/);
      const propsJson = propsMatch
        ? propsMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
        : "{}";

      const defaults = {};
      try {
        const schema = JSON.parse(propsJson);
        for (const [key, meta] of Object.entries(schema)) {
          if (meta && Object.prototype.hasOwnProperty.call(meta, "default")) {
            defaults[key] = meta.default;
          }
        }
      } catch {
        // keep empty defaults
      }

      return `<script>
${code}
window.__dcBoot = function __dcBoot() {
  const root = document.querySelector('[data-dc-root]') || document.body;
  const instance = new Component();
  instance.el = root;
  instance.props = ${JSON.stringify(defaults)};
  if (typeof instance.componentDidMount === 'function') instance.componentDidMount();
  if (typeof instance.renderVals === 'function') {
    const vals = instance.renderVals() || {};
    root.querySelectorAll('[data-bind]').forEach((node) => {
      const key = node.getAttribute('data-bind');
      if (key && vals[key] != null) node.textContent = vals[key];
    });
  }
};
document.addEventListener('DOMContentLoaded', window.__dcBoot);
</script>`;
    }
  );

  // image-slot placeholders → visible fallback blocks
  body = body.replace(
    /<image-slot\b([^>]*)><\/image-slot>/gi,
    (_full, attrs) => {
      const id = (attrs.match(/\bid="([^"]*)"/) || [])[1] || "slot";
      const placeholder =
        (attrs.match(/\bplaceholder="([^"]*)"/) || [])[1] || "Image forthcoming";
      return `<div class="image-slot-fallback" data-slot-id="${id}" role="img" aria-label="${placeholder}" style="width:100%;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#F4F4F1,#E8E8E3);color:#68686F;font-family:Montserrat,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-align:center;padding:20px;">${placeholder}</div>`;
    }
  );

  // Hero frames are missing from the export — inject a mark fallback beside the frame stack
  if (body.includes('data-figure-inner') && !body.includes("data-figure-fallback")) {
    body = body.replace(
      /(<div data-figure-inner[^>]*>)/,
      `$1
        <div data-figure-fallback style="position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8%;z-index:2;">
          <img src="./brand-assets/bd-mark-primary.svg" alt="Brian Du" style="width:min(42%,320px);height:auto;opacity:0.92;" />
        </div>`
    );
  }

  const needsImageSlot = /image-slot-fallback|image-slot\.js/.test(body);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="Brian Du — product design, UX, design systems, and front-end engineering.">
<link rel="icon" href="./brand-assets/bd-favicon-32.svg" type="image/svg+xml">
<script src="./support.js"></script>
${needsImageSlot ? '<script src="./image-slot.js"></script>' : ""}
${helmet}
</head>
<body>
<div data-dc-root>
${body.trim()}
</div>
</body>
</html>
`;
}

if (!source) {
  console.error("Handoff source not found. Tried:\n" + sourceCandidates.join("\n"));
  process.exit(1);
}

console.log("Using handoff source:", source);

copyDir(path.join(source, "assets"), path.join(root, "assets"));
copyDir(path.join(source, "brand-assets"), path.join(root, "brand-assets"));

for (const file of ["logo-amplify-2-mskpu0eq-rn4n.svg", "ghs-website-msngi6xi-1v6w.png"]) {
  const from = path.join(source, file);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(root, file));
}

fs.mkdirSync(path.join(root, "frames"), { recursive: true });
fs.writeFileSync(
  path.join(root, "frames", "README.md"),
  `# Hero turntable frames

Drop the 19 figure PNGs here (exported from Claude Design):

- figure-28.png … figure-36.png
- figure-01.png … figure-10.png

Until these files are present, the home hero shows the BD mark fallback.
`
);

for (const page of pages) {
  const raw = fs.readFileSync(path.join(source, page.src), "utf8");
  const converted = convertPage(raw, page.title);
  fs.writeFileSync(path.join(root, page.out), converted);
  console.log("wrote", page.out);
}

console.log("Import complete.");
