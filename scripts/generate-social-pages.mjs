import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const siteUrl = "https://www.perficientagency.online";
const projectId = "newsite-ccdea";
const apiRoot =
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

function valueOf(value) {
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
    data[key] = valueOf(value);
  }
  data.documentId = document.name?.split("/").pop();
  return data;
}

async function listCollection(collectionId) {
  const response = await fetch(`${apiRoot}/${collectionId}?pageSize=500`);
  if (!response.ok) throw new Error(`${collectionId}: ${response.status}`);
  const payload = await response.json();
  return (payload.documents || []).map(documentData);
}

async function listPublished(collectionId) {
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

function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceHead(baseHtml, page) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const image = escapeHtml(page.image);
  const canonical = escapeHtml(`${siteUrl}${page.path}`);

  const socialMeta = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    image ? `<meta property="og:image" content="${image}" />` : "",
    image ? `<meta property="og:image:secure_url" content="${image}" />` : "",
    image ? `<meta property="og:image:width" content="1200" />` : "",
    image ? `<meta property="og:image:height" content="630" />` : "",
    image ? `<meta property="og:image:alt" content="${title}" />` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    image ? `<meta name="twitter:image" content="${image}" />` : ""
  ].filter(Boolean).join("\n    ");

  return baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+(?:name|property)=["'](?:description|og:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace("</head>", `    ${socialMeta}\n  </head>`);
}

async function writePage(baseHtml, page) {
  const html = replaceHead(baseHtml, page);
  const cleanPath = page.path.replace(/^\/|\/$/g, "");
  const htmlFile = join("dist", `${cleanPath}.html`);
  const indexFile = join("dist", cleanPath, "index.html");

  await mkdir(dirname(htmlFile), { recursive: true });
  await mkdir(dirname(indexFile), { recursive: true });
  await writeFile(htmlFile, html, "utf8");
  await writeFile(indexFile, html, "utf8");
}

const baseHtml = await readFile("dist/index.html", "utf8");
const pages = [];

const results = await Promise.allSettled([
  listCollection("team"),
  listCollection("portfolio"),
  listPublished("services"),
  listPublished("blog")
]);

for (const member of results[0].status === "fulfilled" ? results[0].value : []) {
  const slug = member.slug || slugify(member.name) || member.id || member.documentId;
  if (!slug) continue;
  pages.push({
    path: `/team/${slug}`,
    title: member.seoTitle || `${member.name} — ${member.role} | Perficient 360 Agency`,
    description: member.seoDescription || member.bio || `${member.name} at Perficient 360 Agency.`,
    image: member.socialImageUrl || member.photoUrl || "",
    type: "profile"
  });
}

for (const project of results[1].status === "fulfilled" ? results[1].value : []) {
  const id = project.id || project.documentId;
  if (!id) continue;
  pages.push({
    path: `/case-studies/${id}`,
    title: `${project.title} Case Study | Perficient 360 Agency`,
    description: project.description || "Explore this project by Perficient 360 Agency.",
    image: project.socialImageUrl || project.imageUrl || "",
    type: "article"
  });
}

for (const service of results[2].status === "fulfilled" ? results[2].value : []) {
  if (!service.slug) continue;
  pages.push({
    path: `/services/${service.slug}`,
    title: service.seoTitle || `${service.title} | Perficient 360 Agency`,
    description: service.seoDescription || service.shortDescription || service.description,
    image: service.socialImageUrl || service.heroImageUrl || "",
    type: "website"
  });
}

for (const post of results[3].status === "fulfilled" ? results[3].value : []) {
  if (!post.slug) continue;
  pages.push({
    path: `/blog/${post.slug}`,
    title: post.seoTitle || `${post.title} | Perficient 360 Agency`,
    description: post.seoDescription || post.excerpt || "",
    image: post.socialImageUrl || post.imageUrl || "",
    type: "article"
  });
}

for (const result of results) {
  if (result.status === "rejected") {
    console.warn("Social preview generation skipped a collection:", result.reason?.message);
  }
}

await Promise.all(pages.map((page) => writePage(baseHtml, page)));
console.log(`Generated ${pages.length} social preview pages.`);
