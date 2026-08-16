import { chromium } from "playwright";
import path from "node:path";

const pages = [
  { url: "http://localhost:3000/", file: "landing.png", full: true },
  { url: "http://localhost:3000/login", file: "login.png", full: false },
  { url: "http://localhost:3000/forgot-password", file: "forgot-password.png", full: false },
];

const outDir = process.argv[2] || "/tmp/screens";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const p of pages) {
  await page.goto(p.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, p.file), fullPage: p.full });
  console.log("captured", p.file);
}

await browser.close();
