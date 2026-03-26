import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { dirname } from "path";

// ---------------------------------------------------------------------------
// 1. Parse docs.json to build a file-path → product mapping
// ---------------------------------------------------------------------------

function buildProductMap() {
  const docsConfig = JSON.parse(readFileSync("docs.json", "utf-8"));
  const map = {};

  function walk(node, product = null) {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, product));
      return;
    }

    // A navigation group — the top-level group name is the product
    if (node.group) {
      const currentProduct = product || node.group;
      if (node.pages) walk(node.pages, currentProduct);
      return;
    }

    // A page path string like "database/connect/sql-api"
    if (typeof node === "string" && product) {
      map[node] = product;
      // Also map with .mdx extension for matching against git diffs
      map[`${node}.mdx`] = product;
      map[`${node}.md`] = product;
    }
  }

  // Mintlify docs.json uses "navigation" or "tabs" at the top level
  // Mintlify docs.json uses navigation.products[] where each has tabs[].groups[].pages[]
  const products =
    docsConfig.navigation?.products || docsConfig.navigation || [];

  for (const product of Array.isArray(products) ? products : []) {
    const productName = product.product || product.group;
    const tabs = product.tabs || [];
    for (const tab of tabs) {
      const groups = tab.groups || [];
      for (const group of groups) {
        walk(group, productName);
      }
    }
  }

  return map;
}

// ---------------------------------------------------------------------------
// 2. Gather diffs for changed doc files
// ---------------------------------------------------------------------------

function getChangedDocs() {
  const files = readFileSync("/tmp/changed_files.txt", "utf-8")
    .split("\n")
    .filter(Boolean);

  const baseSha = process.env.BASE_SHA;
  const mergeSha = process.env.MERGE_SHA;

  // Detect which files are newly added vs modified
  let newFiles = new Set();
  try {
    const diffRef =
      baseSha && mergeSha ? `${baseSha} ${mergeSha}` : "HEAD~1 HEAD";
    const added = execSync(`git diff --diff-filter=A --name-only ${diffRef}`, {
      encoding: "utf-8",
    })
      .split("\n")
      .filter(Boolean);
    newFiles = new Set(added);
  } catch {}

  return files
    .map((file) => {
      // Check frontmatter for hidden: true and skip those files
      try {
        const content = readFileSync(file, "utf-8");
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (fmMatch && /^hidden:\s*true/m.test(fmMatch[1])) {
          console.log(`Skipping hidden page: ${file}`);
          return null;
        }
      } catch {}

      const isNew = newFiles.has(file);
      let diff = "";
      try {
        if (baseSha && mergeSha) {
          diff = execSync(`git diff ${baseSha} ${mergeSha} -- ${file}`, {
            encoding: "utf-8",
            maxBuffer: 1024 * 512,
          });
        } else {
          diff = execSync(`git diff HEAD~1 HEAD -- ${file}`, {
            encoding: "utf-8",
            maxBuffer: 1024 * 512,
          });
        }
      } catch {
        try {
          diff = readFileSync(file, "utf-8");
        } catch {
          diff = "(file not found)";
        }
      }

      if (!diff.trim()) {
        try {
          diff = `(new file)\n${readFileSync(file, "utf-8")}`;
        } catch {
          diff = "(file not found)";
        }
      }

      return { file, diff, isNew };
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// 3. Call OpenAI to classify and generate changelog entries
// ---------------------------------------------------------------------------

async function classifyChanges(changedDocs, productMap) {
  const mergedAt = process.env.MERGED_AT;
  const today = mergedAt
    ? new Date(mergedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  // Build per-product list of existing pages so the model can distinguish
  // "new docs for an existing feature" from "docs for a new feature"
  const productPages = {};
  for (const [path, product] of Object.entries(productMap)) {
    // Only use paths without extensions (the canonical form)
    if (/\.(mdx?|md)$/.test(path)) continue;
    if (!productPages[product]) productPages[product] = [];
    productPages[product].push(`/${path}`);
  }

  // Identify which products are touched so we only send relevant context
  const touchedProducts = new Set();
  for (const d of changedDocs) {
    const product =
      productMap[d.file] ||
      productMap[d.file.replace(/\.(mdx?|md)$/, "")] ||
      null;
    if (product) touchedProducts.add(product);
  }

  const existingPagesContext = [...touchedProducts]
    .map((p) => `${p}:\n${(productPages[p] || []).join("\n")}`)
    .join("\n\n");

  const filesContext = changedDocs
    .map((d) => {
      const product =
        productMap[d.file] ||
        productMap[d.file.replace(/\.(mdx?|md)$/, "")] ||
        "Unknown";
      const status = d.isNew ? "NEWLY ADDED" : "MODIFIED";
      const docsPath = "/" + d.file.replace(/\.(mdx?|md)$/, "");
      return `### File: ${d.file}\nDocs URL: ${docsPath}\nProduct: ${product}\nFile status: ${status}\n\n\`\`\`diff\n${d.diff.slice(0, 4000)}\n\`\`\``;
    })
    .join("\n\n---\n\n");

  const systemPrompt = `You are a changelog writer for bunny.net's developer documentation.

Your job is to review documentation diffs and decide whether they represent user-facing product changes (new features or improvements) that belong in a changelog.

RULES:
- Only include genuinely NEW features or meaningful product IMPROVEMENTS.
- Do NOT include: documentation-only updates, typo fixes, rewording, new guides/tutorials for existing features, pricing page updates, or formatting changes.
- New features are typically new pages describing functionality that didn't exist before. Use the "Existing pages" list below to check — if the product already has pages covering this feature area, the new page is likely a guide for an existing feature, not a new feature.
- A MODIFIED file is almost always a docs improvement for an existing feature — only include it if the diff clearly describes a new product capability (e.g. new API fields, new configuration options, increased limits).
- Improvements are meaningful product enhancements (e.g. new throughput limits, GA releases, new options added).
- If the diff shows frontmatter with \`hidden: true\`, skip it — these are hidden or private preview features not yet public.
- Do not include internal info — no file paths, directory structures, code snippets, or implementation details.
- Write in a positive, concise tone. Keep descriptions to 1-2 sentences max.
- End descriptions with a "Learn more" link using the exact "Docs URL" value from the file context (e.g. \`[Learn more](/stream/encoding/per-title)\`). Do NOT invent or guess URLs.

Respond ONLY with a JSON array (no markdown fences). Each entry:
{
  "product": "Product Name",
  "type": "New" or "Improvement",
  "title": "Short feature title",
  "description": "Brief user-facing description. [Learn more](/docs-url-from-context)"
}

If NO changes warrant a changelog entry, return an empty array: []`;

  const userPrompt = `These changes were merged on ${today}.

## Existing pages by product

${existingPagesContext}

## Changed files

Review these documentation changes and determine which (if any) represent new features or product improvements worth adding to the changelog:

${filesContext}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const raw = data.choices[0].message.content.trim();

  try {
    return JSON.parse(raw.replace(/^```json\s*|```$/g, ""));
  } catch (e) {
    console.error("Failed to parse OpenAI response:", raw);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 4. Write changelog entries to the correct files
// ---------------------------------------------------------------------------

function formatDate() {
  const mergedAt = process.env.MERGED_AT;
  if (mergedAt) {
    return new Date(mergedAt).toISOString().slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function buildUpdateBlock({ title, description, tags }) {
  return `<Update label="${formatDate()}" tags={[${tags.map((t) => `"${t}"`).join(", ")}]}>
  ## ${title}

${description}

</Update>`;
}

function prependToChangelog(filePath, newContent) {
  if (!existsSync(filePath)) {
    return null; // Signal that we need to create this file
  }

  const existing = readFileSync(filePath, "utf-8");

  // Insert after the frontmatter closing ---
  const frontmatterEnd = existing.indexOf("---", existing.indexOf("---") + 3);
  if (frontmatterEnd === -1) {
    // No frontmatter found — just prepend
    writeFileSync(filePath, newContent + "\n\n" + existing);
    return;
  }

  const before = existing.slice(0, frontmatterEnd + 3);
  const after = existing.slice(frontmatterEnd + 3);
  writeFileSync(filePath, before + "\n\n" + newContent + after);
}

function createProductChangelog(filePath, productName, firstEntry) {
  const dir = dirname(filePath);
  execSync(`mkdir -p ${dir}`);

  const content = `---
title: Changelog
description: Latest updates and improvements to ${productName}.
hidden: true
---

${firstEntry}
`;

  writeFileSync(filePath, content);
}

// Map product names to their actual folder prefixes in the repo.
// Built from docs.json where the folder prefix doesn't match a naive slugify.
const PRODUCT_FOLDER_MAP = {
  "Edge Scripting": "scripting",
};

function slugifyProduct(name) {
  if (PRODUCT_FOLDER_MAP[name]) return PRODUCT_FOLDER_MAP[name];
  return name.toLowerCase().replace(/\s+/g, "-");
}

function writeEntries(entries) {
  if (!entries.length) {
    console.log("No changelog-worthy changes detected.");
    return;
  }

  const rootEntries = [];

  for (const entry of entries) {
    const productSlug = slugifyProduct(entry.product);
    const productChangelogPath = `${productSlug}/changelog.mdx`;

    // Product-level entry (no product name in tags)
    const productBlock = buildUpdateBlock({
      title: entry.title,
      description: entry.description,
      tags: [entry.type],
    });

    // Root-level entry (includes product name and parenthesised type)
    const rootBlock = buildUpdateBlock({
      title: entry.title,
      description: entry.description,
      tags: [entry.product, `(${entry.type})`],
    });

    rootEntries.push(rootBlock);

    // Write product-level changelog
    const result = prependToChangelog(productChangelogPath, productBlock);
    if (result === null) {
      createProductChangelog(productChangelogPath, entry.product, productBlock);
      console.log(`Created new changelog: ${productChangelogPath}`);
    } else {
      console.log(`Updated: ${productChangelogPath}`);
    }
  }

  // Write root changelog
  if (rootEntries.length) {
    const rootContent = rootEntries.join("\n\n");
    prependToChangelog("changelog.mdx", rootContent);
    console.log(`Updated: changelog.mdx`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Building product map from docs.json...");
  const productMap = buildProductMap();
  console.log(`Mapped ${Object.keys(productMap).length} paths to products.`);

  console.log("Gathering changed documentation files...");
  const changedDocs = getChangedDocs();
  console.log(`Found ${changedDocs.length} changed doc files.`);

  if (!changedDocs.length) {
    console.log("No documentation changes detected.");
    return;
  }

  console.log("Classifying changes with OpenAI...");
  const entries = await classifyChanges(changedDocs, productMap);
  console.log(`AI identified ${entries.length} changelog-worthy entries.`);

  writeEntries(entries);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
