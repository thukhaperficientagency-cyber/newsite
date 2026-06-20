import { mkdir, writeFile } from "node:fs/promises";

const siteUrl = "https://www.perficientagency.online";
const projectId = "newsite-ccdea";
const apiRoot =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

function firestoreValue(value) {
  if (!value) return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  return undefined;
}

function documentData(document) {
  const data = {};
  for (const [key, value] of Object.entries(document.fields || {})) {
    data[key] = firestoreValue(value);
  }
  data.documentId = document.name?.split("/").pop();
  return data;
}

async function listPublicCollection(collectionId) {
  const response = await fetch(`${apiRoot}/${collectionId}?pageSize=500`);
  if (!response.ok) throw new Error(`${collectionId}: ${response.status}`);
  const payload = await response.json();
  return (payload.documents || []).map(documentData);
}

async function listPublishedCollection(collectionId) {
  const response = await fetch(`${apiRoot}:runQuery`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: {
          fieldFilter: {
            field: { fieldPath: "status" },
            op: "EQUAL",
            value: { stringValue: "published" }
          }
        }
      }
    })
  });

  if (!response.ok) throw new Error(`${collectionId}: ${response.status}`);
  const payload = await response.json();
  return payload
    .filter((item) => item.document)
    .map((item) => documentData(item.document));
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(path, priority, changefreq, lastmod) {
  return [
    "  <url>",
    `    <loc>${escapeXml(`${siteUrl}${path}`)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod.slice(0, 10))}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>"
  ].filter(Boolean).join("\n");
}

const entries = new Map([
  ["/", { priority: "1.0", changefreq: "weekly" }],
  ["/services", { priority: "0.9", changefreq: "weekly" }],
  ["/services/digital-marketing-myanmar", { priority: "0.9", changefreq: "monthly" }],
  ["/services/website-development-myanmar", { priority: "0.9", changefreq: "monthly" }],
  ["/services/crm-development-myanmar", { priority: "0.9", changefreq: "monthly" }],
  ["/services/event-management-myanmar", { priority: "0.9", changefreq: "monthly" }],
  ["/services/posm-design-myanmar", { priority: "0.9", changefreq: "monthly" }],
  ["/case-studies", { priority: "0.9", changefreq: "weekly" }],
  ["/blog", { priority: "0.9", changefreq: "weekly" }],
  ["/team", { priority: "0.7", changefreq: "monthly" }]
]);

const results = await Promise.allSettled([
  listPublishedCollection("services"),
  listPublishedCollection("blog"),
  listPublicCollection("portfolio"),
  listPublicCollection("team")
]);

for (const service of results[0].status === "fulfilled" ? results[0].value : []) {
  if (service.slug) {
    entries.set(`/services/${service.slug}`, {
      priority: "0.9",
      changefreq: "monthly"
    });
  }
}

for (const post of results[1].status === "fulfilled" ? results[1].value : []) {
  if (post.slug) {
    entries.set(`/blog/${post.slug}`, {
      priority: "0.8",
      changefreq: "monthly",
      lastmod: post.publishedAt
    });
  }
}

for (const project of results[2].status === "fulfilled" ? results[2].value : []) {
  const id = project.id || project.documentId;
  if (id) {
    entries.set(`/case-studies/${id}`, {
      priority: "0.8",
      changefreq: "monthly"
    });
  }
}

for (const member of results[3].status === "fulfilled" ? results[3].value : []) {
  const id = member.id || member.documentId;
  if (id) {
    entries.set(`/team/${id}`, {
      priority: "0.6",
      changefreq: "monthly"
    });
  }
}

for (const result of results) {
  if (result.status === "rejected") {
    console.warn("Sitemap used fallback URLs:", result.reason?.message || result.reason);
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...[...entries].map(([path, options]) =>
    urlEntry(path, options.priority, options.changefreq, options.lastmod)
  ),
  "</urlset>",
  ""
].join("\n");

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", xml, "utf8");
console.log(`Generated sitemap.xml with ${entries.size} URLs.`);
