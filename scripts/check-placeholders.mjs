import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const roots = [
  "src/content/services",
  "src/content/therapists",
  "src/content/workshops",
  "src/content/articles",
];
const dataFiles = ["src/data/testimonials.ts", "src/data/faq.ts", "src/data/site.ts"];

const patterns = [
  /^placeholder:\s*true/m,
  /^draft:\s*true/m,
  /placeholder:\s*true/,
  /\[آیدی/,
  /به‌زودی\]/,
  /نمونه/,
];
const offenders = [];

function scanFile(path, content, patternsForFile) {
  if (patternsForFile.some((p) => p.test(content))) offenders.push(path);
}

for (const root of roots) {
  for (const file of readdirSync(root)) {
    if (!file.endsWith(".md")) continue;
    const path = join(root, file);
    scanFile(path, readFileSync(path, "utf8"), patterns.slice(0, 2));
  }
}
for (const path of dataFiles) {
  scanFile(path, readFileSync(path, "utf8"), patterns.slice(2));
}

if (offenders.length > 0) {
  console.error("✖_LAUNCH BLOCKED — placeholder/draft content remains in:\n");
  for (const o of offenders) console.error("  - " + o);
  console.error(
    "\nReplace or remove placeholder:true / draft:true frontmatter, then re-run: npm run build:launch",
  );
  process.exit(1);
}
console.log("✔ No placeholder or draft content remaining. Launch build may proceed.");
