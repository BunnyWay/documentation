---
name: changelog-entry
description: How to write one entry in changelog.mdx for the bunny.net docs. Use it whenever you add, edit, or review a changelog entry, including an entry written from a product launch announcement.
---

# Changelog entries

Entries live in `changelog.mdx` at the repository root. Read [CLAUDE.md](../../../CLAUDE.md) and [.github/CONTRIBUTING.md](../../../.github/CONTRIBUTING.md) first.

## Format

```mdx
<Update label="2026-10-08" tags={["Magic Containers","(Improvement)"]}>
  ## `ping` support in containers

  The `ping` command now works inside Magic Containers. Use it to check that a host is reachable from your app.
</Update>
```

- Put the entry in date order, newest first. Entries with the same date keep the newest at the top.
- Indent the content two spaces inside `<Update>`.
- Put one blank line between entries.

## Label

`label` is the date the change goes live, as `YYYY-MM-DD`. It is not the date of the PR.

## Tags

- Use one product tag and one type tag.
- Product tags in use: `CDN`, `Stream`, `Edge Scripting`, `Magic Containers`, `Storage`, `Database`, `Shield`, `Optimizer`, `DNS`, `CLI`. Use an existing tag. Add a new one only for a new product.
- A CLI change for a product carries both tags: `tags={["CLI","Database","(New)"]}`.
- Type tags: `(New)` for a new feature, `(Improvement)` for a change to an existing one. A stage change, such as Public Preview to GA, is `(Improvement)`.
- A roundup of small changes across products has no tags.

## Release stages

A feature can have one entry per release stage. See [Product release stages](/product-release-stages).

Put the stage in the heading, in this form:

| Stage | Heading |
| --- | --- |
| Closed Preview | `## Feature name (Closed Preview)` |
| Public Preview | `## Feature name (Public Preview)` |
| General Availability | `## Feature name is now GA` |

A launch that names no stage is GA. Its heading has no stage marker.

Before you write an entry, search `changelog.mdx` and the open changelog PRs for the same feature:

- An entry for the same stage exists: don't add a new one.
- An entry for a later stage exists: don't add an entry for the earlier stage.
- Only an earlier stage has an entry: add a new entry. Say what is new at this stage, such as access, pricing, or limits. Don't repeat the old entry. Link to [General Availability](/product-release-stages) or the stage section.

## Heading

- Say what the reader can now do: "Edge Scripting support now in CLI", not "CLI: Edge Scripts".
- Keep it short. Use the product name when the feature name alone is ambiguous.

## Body

- Lead with the user benefit. Say what works now. Don't say what was broken before.
- Write one to three short paragraphs. No bullet lists and no sub-headings.
- Split by product or area. Group small fixes into one closing sentence: "We've also fixed issues with…".
- Write to the reader as "you". Use "we" only for bunny.net as a company.
- Use contractions: "doesn't", "you'll", "we've".
- Bold UI labels exactly as they appear: **Save Settings**.
- Put flags, headers, file names, and literal values in code: `CDN-RequestId`.
- End with `[Learn more](/path)` when a docs page covers the change. The path must be a real page in this repository, without the `.mdx` extension.
- Escape every dollar sign as `\$`.

## Words and names

- **bunny.net** is always lowercase, also at the start of a sentence.
- Product names: Bunny CDN, Bunny Storage, Bunny Stream, Bunny Shield, Bunny Database, Bunny DNS, Bunny Optimizer, Magic Containers, Edge Scripting, Bunny CLI.
- Match the dashboard words: "app", "video library", "Pull Zone", "storage zone", "Shield Zone".
- American spelling: color, behavior, customize.
- No em dashes. Use a period, a colon, a comma, or parentheses.
- Cut marketing and filler words: seamless, leverage, robust, powerful, comprehensive, at a glance, allows you to, enables you to, in order to.

## This repository is public

The entry, the commit message, the PR title, and the PR description are public. Never include:

- links to internal tools, or roadmap and ticket keys;
- support ticket counts, customer quotes, or anything that identifies a customer;
- names of colleagues, and thanks to teams.

## From a launch announcement

An internal launch announcement holds more than a changelog entry needs.

Keep:

- what the feature does for the customer;
- where to find it in the dashboard, or the API;
- the stage, and pricing when it is part of the stage change;
- the link to the docs page.

Drop:

- why we built it, evidence, and competitor comparisons;
- notes for support and sales, known gaps, and internal limits;
- thanks, names, and internal links.

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

- The `label` is the go-live date.
- The tags are one product tag and one type tag, both already in use.
- The heading has the stage marker, or none for GA.
- No entry for the same feature and stage exists.
- The `[Learn more]` path is a real page.
- No internal links, names, ticket keys, or customer details.
