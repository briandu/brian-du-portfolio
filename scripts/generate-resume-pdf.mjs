#!/usr/bin/env node
/**
 * Print resume-print.html to Brian-Du-Resume.pdf (letter, 3 pages).
 * Requires: npx playwright (chromium).
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "resume-print.html");
const pdfPath = path.join(root, "Brian-Du-Resume.pdf");
const fileUrl = `file://${htmlPath}`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(fileUrl, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "Letter",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
console.log("Wrote", pdfPath);
