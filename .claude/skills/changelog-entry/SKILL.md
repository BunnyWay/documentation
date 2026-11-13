---
name: changelog-entry
description: Format and wording for one entry in changelog.mdx, and the pull request that adds it. Use it whenever you add, edit, or review a changelog entry in the bunny.net docs, including an entry for a merged PR or a product launch.
---

# Changelog entries

Entries live in `changelog.mdx` at the repository root. It is the only changelog. Don't add changelog entries to product pages, and don't create another changelog file.

Read [docs-writing](../docs-writing/SKILL.md) first. Its voice, word, and public repository rules apply to every entry.

To decide whether a merged PR needs an entry, use [changelog-review](../changelog-review/SKILL.md).

## Check for an existing entry

Before you write, search for an entry about the same feature and release stage in:

- `changelog.mdx` on `main`;
- every open PR that changes `changelog.mdx`.

If one exists, don't add another.

## Format

```mdx
<Update label="2026-10-08" tags={["Magic Containers","(Improvement)"]}>
  ## `ping` support in containers

  The `ping` command now works inside Magic Containers. Use it to check that a host is reachable from your app.
</Update>
```

- Put the entry in date order, newest first.
- Indent the content two spaces inside `<Update>`.
- Put one blank line between entries.
- `label` is the date the change went live, as `YYYY-MM-DD`. Use the merge date of the source PR, unless the PR states a go-live date.

## Tags

- Use one product tag and one type tag.
- Product tags: `CDN`, `Stream`, `Edge Scripting`, `Magic Containers`, `Storage`, `Database`, `Shield`, `Optimizer`, `DNS`, `CLI`. Add a new one only for a new product.
- A CLI change for a product carries both tags: `tags={["CLI","Database","(New)"]}`.
- Type tags: `(New)` for a new feature or product, `(Improvement)` for a change to an existing one. A stage change is `(Improvement)`.
- A roundup of small changes across products has no tags.

## Release stages

A feature can have one entry per release stage. See [Product release stages](../../../product-release-stages.mdx).

| Stage | Heading |
| --- | --- |
| Closed Preview | `## Feature name (Closed Preview)` |
| Public Preview | `## Feature name (Public Preview)` |
| General Availability | `## Feature name is now GA` |

A launch that names no stage is GA, and its heading has no stage marker.

- The same feature and stage has an entry: don't add one.
- A later stage has an entry: don't add one for the earlier stage.
- Only an earlier stage has an entry: add one. Say what is new at this stage, such as access, pricing, or limits.

## Heading

Say what the reader can now do: "Edge Scripting support now in CLI", not "CLI: Edge Scripts". Use the product name when the feature name alone is ambiguous.

## Body

- Say what changed for the reader, then why it matters.
- Write one to three short paragraphs. No bullet lists and no sub-headings.
- Describe the capability, not the documentation.
- Group small fixes into one closing sentence: "We've also fixed issues with MX records in Bunny DNS and video status in Bunny Stream."
- End with `[Learn more](/path)` when a docs page covers the change. The path is a real page in this repository, without `/docs` and without `.mdx`.

Good:

- "You can now purge cached content by cache tag."
- "The DNS Analytics API returns historical query metrics."

Bad:

- "Added documentation for cache tags."
- "Restructured the documentation."
- "Improved the documentation."

## From a launch announcement

Keep:

- what the feature does for the customer;
- where to find it in the dashboard or the API;
- the stage, and pricing when it is part of the stage change;
- the link to the docs page.

Drop:

- why we built it, evidence, and competitor comparisons;
- notes for support and sales, known gaps, and internal limits;
- thanks, names, and internal links.

## Pull request

- One changelog PR for one change. Don't combine unrelated changes.
- Change `changelog.mdx` only.
- Branch from an up-to-date `main`.
- Title: `docs(changelog): add <feature>`.
- Description: one line that names the source and links the review guide. No tool or AI trailers.

  ```
  Changelog entry for #560. [Review guide](https://github.com/BunnyWay/documentation/blob/main/.claude/skills/changelog-review/SKILL.md#for-reviewers).
  ```

- Reviewer: the author of the source PR, or the person who asked for the entry.

## Examples

A new feature:

```mdx
<Update label="2026-11-12" tags={["Stream","(New)"]}>
  ## Geo-blocking for Stream

  You can now restrict video playback by country at the video library level. Choose between blocking selected countries or allowing selected countries, then build a country list from individual picks or presets covering continents, data protection zones, and regions. [Learn more](/stream/geo-blocking)
</Update>
```

A stage change:

```mdx
<Update label="2026-09-10" tags={["Edge Scripting","(Improvement)"]}>
  ## HTMLRewriter, Cache API, and Before cache execution for Edge Scripts are now GA

  Edge Scripting's HTMLRewriter, Cache API, and Before cache execution have been promoted to [General Availability](/product-release-stages) and are no longer in preview. [Learn more](/scripting/html-rewriter)
</Update>
```

## Before you finish

- No entry for the same feature and stage exists on `main` or in an open PR.
- The `label` is the go-live date.
- The tags are one product tag and one type tag, both already in use.
- The heading has the stage marker, or none for GA.
- The `[Learn more]` path is a real page.
- The entry passes the checks in [docs-writing](../docs-writing/SKILL.md#before-you-finish).
