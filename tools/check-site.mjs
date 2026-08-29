import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const pages = [
  "index.html",
  "life-in-2045.html",
  "family.html",
  "earth.html",
  "intelligence.html",
  "timeline.html",
  "network.html"
];
const errors = [];

for (const page of pages) {
  const filePath = path.join(root, page);
  if (!fs.existsSync(filePath)) {
    errors.push(`${page}: missing page`);
    continue;
  }
  const html = fs.readFileSync(filePath, "utf8");
  if (!html.includes('<html lang="en-AU">')) errors.push(`${page}: missing Australian language declaration`);
  if (!html.includes("assets/styles-v2.css")) errors.push(`${page}: missing current visual system`);
  if (!html.includes("assets/site.js")) errors.push(`${page}: missing shared site behaviour`);
  if (!html.includes('<header class="site-header">')) errors.push(`${page}: missing static navigation fallback`);
  if (!html.includes('<footer class="site-footer">')) errors.push(`${page}: missing static licence footer`);
  if (/<svg\b/i.test(html) || /\.svg(?:[?#"'])/i.test(html)) errors.push(`${page}: SVG use found`);
  if (/\u2013|\u2014/.test(html)) errors.push(`${page}: non-ASCII dash found`);

  const attributes = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const reference of attributes) {
    if (/^(?:https?:|mailto:|tel:|#)/i.test(reference)) continue;
    const clean = reference.split("#")[0].split("?")[0];
    if (!clean) continue;
    const localPath = path.resolve(path.dirname(filePath), clean);
    if (!fs.existsSync(localPath)) errors.push(`${page}: missing local reference ${reference}`);
  }
}

const allFiles = fs.readdirSync(root, { recursive: true, withFileTypes: true });
for (const entry of allFiles) {
  if (entry.isFile() && entry.name.toLowerCase().endsWith(".svg")) errors.push(`SVG file found: ${entry.name}`);
}

const textFiles = allFiles
  .filter(entry => entry.isFile() && /\.(?:html|css|js|md|json)$/i.test(entry.name))
  .map(entry => path.join(entry.parentPath, entry.name));
for (const file of textFiles) {
  const source = fs.readFileSync(file, "utf8");
  if (/<svg\b/i.test(source) || /\.svg(?:[?#"')])/i.test(source)) errors.push(`SVG reference found in ${path.relative(root, file)}`);
}

const heroFiles = [
  "hero-home.webp",
  "hero-life.webp",
  "hero-family.webp",
  "hero-earth.webp",
  "hero-intelligence.webp",
  "hero-timeline.webp",
  "hero-network.webp"
];
for (const hero of heroFiles) {
  const heroPath = path.join(root, "assets", "images", hero);
  if (!fs.existsSync(heroPath) || fs.statSync(heroPath).size < 100000) errors.push(`Hero image missing or unexpectedly small: ${hero}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Checked ${pages.length} pages, ${heroFiles.length} unique hero images, static fallbacks, local links, scripts and the no-SVG rule.`);
