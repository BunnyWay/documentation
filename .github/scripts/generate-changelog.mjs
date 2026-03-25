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
  const navSources = [
    ...(docsConfig.navigation || []),
    ...(docsConfig.tabs?.flatMap((t) => t.pages || t.navigation || []) || []),
  ];

  walk(navSources);
  return map;
}

// ---------------------------------------------------------------------------
// 2. Gather diffs for changed doc files
// ---------------------------------------------------------------------------

function getChangedDocs() {
  const files = readFileSync("/tmp/changed_files.txt", "utf-8")
    .split("\n")
    .filter(Boolean);

  return files.map((file) => {
    let diff = "";
    try {
      diff = execSync(
        `git diff ${process.env.GITHUB_EVENT_PATH ? "" : "HEAD~1 HEAD -- "}${file}`,
        { encoding: "utf-8", maxBuffer: 1024 * 512 },
      );
    } catch {
      // New file — read full content
      try {
        diff = readFileSync(file, "utf-8");
      } catch {
        diff = "(file not found)";
      }
    }
    return { file, diff };
  });
}

// ---------------------------------------------------------------------------
// 3. Call OpenAI to classify and generate changelog entries
// ---------------------------------------------------------------------------

async function classifyChanges(changedDocs, productMap) {
  const today = new Date().toISOString().slice(0, 10);

  const filesContext = changedDocs
    .map((d) => {
      const product =
        productMap[d.file] ||
        productMap[d.file.replace(/\.(mdx?|md)$/, "")] ||
        "Unknown";
      return `### File: ${d.file}\nProduct: ${product}\n\n\`\`\`diff\n${d.diff.slice(0, 4000)}\n\`\`\``;
    })
    .join("\n\n---\n\n");

  const systemPrompt = `You are a changelog writer for bunny.net's developer documentation.

Your job is to review documentation diffs and decide whether they represent user-facing product changes (new features or improvements) that belong in a changelog.

RULES:
- Only include genuinely NEW features or meaningful product IMPROVEMENTS.
- Do NOT include: documentation-only updates, typo fixes, rewording, new guides for existing features, pricing page updates, or formatting changes.
- New features are typically new pages or new product sections describing functionality that didn't exist before.
- Improvements are meaningful product enhancements (e.g. new throughput limits, GA releases, new options added).
- If something just describes how an existing feature works (better docs), skip it.
- Ignore hidden or private preview features.
- Do not include internal info — no file paths, directory structures, code snippets, or implementation details.
- Write in a positive, concise tone.
- Always end descriptions with a "Learn more" link if a relevant docs page exists.
- Keep descriptions to 1-2 sentences max.

Respond ONLY with a JSON array (no markdown fences). Each entry:
{
  "product": "Product Name",
  "type": "New" or "Improvement",
  "title": "Short feature title",
  "description": "Brief user-facing description. [Learn more](/path/to/page)",
  "docs_path": "/path/to/relevant/page"
}

If NO changes warrant a changelog entry, return an empty array: []`;

  const userPrompt = `Today's date is ${today}.

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

function slugifyProduct(name) {
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
