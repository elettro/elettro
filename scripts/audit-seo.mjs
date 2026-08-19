import { access, readFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://elettro.com";
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

const strip = (value = "") => value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z0-9#]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

const attr = (html, name, value) => {
  const first = new RegExp(`<meta[^>]+${name}=["']${value}["'][^>]+content=["']([^"']+)["']`, "i").exec(html);
  const second = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${name}=["']${value}["']`, "i").exec(html);
  return first?.[1] || second?.[1] || "";
};

const linkHref = (html, rel) => {
  const first = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["']`, "i").exec(html);
  const second = new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']${rel}["']`, "i").exec(html);
  return first?.[1] || second?.[1] || "";
};

const localFileFor = (urlValue) => {
  const { pathname } = new URL(urlValue, origin);
  const decoded = decodeURIComponent(pathname);
  if (decoded === "/") return join(root, "index.html");
  if (decoded.endsWith("/")) return join(root, decoded, "index.html");
  return join(root, decoded);
};

const exists = async (path) => {
  try { await access(path); return true; } catch { return false; }
};

const results = [];
const allTitles = new Map();
const allDescriptions = new Map();

for (const url of urls) {
  const file = localFileFor(url);
  const html = await readFile(file, "utf8");
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1].trim() || "";
  const description = attr(html, "name", "description");
  const canonical = linkHref(html, "canonical");
  const robots = attr(html, "name", "robots");
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const bodyText = strip(/<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] || "");
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missingAlt = images.filter((tag) => !/\salt=["'][^"']*["']/i.test(tag)).length;
  const missingDimensions = images.filter((tag) => !/\swidth=["'][^"']+["']/i.test(tag) || !/\sheight=["'][^"']+["']/i.test(tag)).length;

  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schema = [];
  const schemaErrors = [];
  for (const block of jsonLdBlocks) {
    try { schema.push(JSON.parse(block[1])); } catch (error) { schemaErrors.push(error.message); }
  }
  const schemaText = JSON.stringify(schema);
  const hasOrganization = schemaText.includes('"Organization"') || schemaText.includes('"ProfessionalService"');
  const hasWebPage = schemaText.includes('"WebPage"') || schemaText.includes('"CollectionPage"') || schemaText.includes('"ContactPage"') || schemaText.includes('"AboutPage"');
  const hasWebSite = schemaText.includes('"WebSite"');
  const visibleFaqCount = (html.match(/<details\b/gi) || []).length;
  const schemaFaqCount = (schemaText.match(/"@type":"Question"/g) || []).length;
  const hasSupportSchema = visibleFaqCount ? schemaFaqCount === visibleFaqCount : schemaText.includes('"ItemList"') || schemaText.includes('"Service"');
  const directAnswer = /quick answer|direct answer|frequently asked questions|project directory/i.test(bodyText);

  const hrefs = [...html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)].map((match) => match[1]);
  const internal = [];
  const broken = [];
  for (const href of hrefs) {
    if (/^(#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const resolved = new URL(href, url);
    if (resolved.hostname.toLowerCase() !== "elettro.com") continue;
    internal.push(resolved.href);
    const target = localFileFor(resolved.href);
    if (!(await exists(target))) broken.push(resolved.pathname);
  }

  const checks = [
    ["title", Boolean(title), 5],
    ["description", description.length >= 70 && description.length <= 170, 5],
    ["canonical", Boolean(canonical), 5],
    ["robots", /index|follow/i.test(robots), 3],
    ["viewport", /<meta[^>]+name=["']viewport["']/i.test(html), 2],
    ["open graph", ["og:title", "og:description", "og:url", "og:image"].every((key) => attr(html, "property", key)), 5],
    ["twitter", Boolean(attr(html, "name", "twitter:card")), 2],
    ["favicon", Boolean(linkHref(html, "icon")), 3],
    ["single h1", h1Count === 1, 5],
    ["content depth", wordCount >= 400, 5],
    ["main landmark", /<main\b/i.test(html), 3],
    ["site landmarks", /<header\b/i.test(html) && /<nav\b/i.test(html) && /<footer\b/i.test(html), 3],
    ["image alt", missingAlt === 0, 4],
    ["image dimensions", missingDimensions === 0, 3],
    ["unique ids", duplicateIds.length === 0, 2],
    ["valid json-ld", jsonLdBlocks.length > 0 && schemaErrors.length === 0, 5],
    ["organization schema", hasOrganization, 5],
    ["page schema", hasWebPage, 4],
    ["website schema", hasWebSite, 3],
    ["answer content", directAnswer, 4],
    ["supporting schema", hasSupportSchema, 4],
    ["self canonical", canonical === url, 5],
    ["internal links", internal.length >= 6, 3],
    ["working internal links", broken.length === 0, 8],
    ["sitemap inclusion", sitemap.includes(`<loc>${url}</loc>`), 4]
  ];
  const score = checks.reduce((sum, [, passed, weight]) => sum + (passed ? weight : 0), 0);
  const failures = checks.filter(([, passed]) => !passed).map(([name]) => name);
  results.push({ url, file, score, wordCount, failures, broken: [...new Set(broken)], duplicateIds, schemaErrors });
  allTitles.set(title, [...(allTitles.get(title) || []), url]);
  allDescriptions.set(description, [...(allDescriptions.get(description) || []), url]);
}

const duplicateTitles = [...allTitles.entries()].filter(([title, list]) => title && list.length > 1);
const duplicateDescriptions = [...allDescriptions.entries()].filter(([description, list]) => description && list.length > 1);
const average = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);

console.log("Elettro technical SEO and AIO implementation audit");
console.log(`Pages: ${results.length} | Average: ${average}/100`);
console.log("");
for (const result of results) {
  const path = new URL(result.url).pathname;
  const detail = result.failures.length ? ` | review: ${result.failures.join(", ")}` : " | all checks passed";
  console.log(`${String(result.score).padStart(3)}/100  ${path.padEnd(32)} ${String(result.wordCount).padStart(4)} words${detail}`);
  if (result.broken.length) console.log(`         broken: ${result.broken.join(", ")}`);
  if (result.duplicateIds.length) console.log(`         duplicate ids: ${result.duplicateIds.join(", ")}`);
  if (result.schemaErrors.length) console.log(`         json-ld: ${result.schemaErrors.join(" | ")}`);
}

if (duplicateTitles.length) console.log("Duplicate titles:", duplicateTitles);
if (duplicateDescriptions.length) console.log("Duplicate descriptions:", duplicateDescriptions);

const blocking = results.some((result) => result.broken.length || result.schemaErrors.length || result.score < 90) || duplicateTitles.length || duplicateDescriptions.length;
process.exitCode = blocking ? 1 : 0;
