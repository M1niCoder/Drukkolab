// Перевіряє, що всі внутрішні посилання та ресурси в зібраному сайті існують.
//   node scripts/check-links.mjs dist
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.argv[2] || "dist");
const htmlFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (p.endsWith(".html")) htmlFiles.push(p);
  }
})(dir);

let bad = 0;
let total = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const is404 = path.basename(file) === "404.html";
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    let ref = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref)) continue;
    ref = ref.split("#")[0].split("?")[0];
    if (!ref) continue;
    total++;
    let target = ref.startsWith("/") ? path.join(dir, ref) : path.resolve(path.dirname(file), ref);
    if (ref.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) {
      bad++;
      console.log(`✗ ${path.relative(dir, file)} → ${m[1]}`);
    }
  }
}
console.log(`${htmlFiles.length} сторінок, ${total} внутрішніх посилань, зламаних: ${bad}`);
process.exit(bad ? 1 : 0);
