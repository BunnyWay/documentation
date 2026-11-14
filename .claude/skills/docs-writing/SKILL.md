---
name: docs-writing
description: Voice and style rules for the bunny.net docs. Use it whenever you write, rewrite, edit, or review a page, guide, quickstart, snippet, or changelog entry in this repository, and before you open a pull request that changes prose.
---

# Writing bunny.net docs

Read [CLAUDE.md](../../../CLAUDE.md) and [.github/CONTRIBUTING.md](../../../.github/CONTRIBUTING.md) first. They hold the rules for file names, frontmatter, headings, screenshots, components, and pull requests. This skill covers the prose.

For changelog entries, also read [changelog-entry](../changelog-entry/SKILL.md).

## Voice

Write like a working developer explaining something useful to another capable person. Respect the reader's time.

- Assume the reader is technically competent. Don't assume they know the product. Explain a bunny.net concept at first use.
- Write to the reader as "you". Use "we" only for bunny.net as a company.
- Use contractions, plain words, and active verbs.
- Name the actor: "the edge script rewrites the header", not "the header is rewritten".
- State one idea at a time. Explain a technical detail through its consequence.
- Describe current behavior. Keep "previously" and "used to" for changelog entries and migration guides.

## Page shape

- Reach the point in the first sentence. Say what the reader will have at the end.
- Show something real early: a command, a request, a finished result.
- Document the happy path. Link to a limits or reference page instead of listing edge cases.
- Use `<Steps>` for a sequence. Give each step a reason, and end with a result the reader can check.
- Put an example next to the sentence that motivates it. Explain the line that carries the decision, not every line.
- Don't restate what a command printed. Explain the part of the output that may surprise the reader.
- Cut prose, code comments, and sections that justify what an example already shows.
- Lead a tip with the action: "Run `bunny whoami` to get your account ID."
- Stop when the task is done. No summary, no "next steps" pitch.
- Keep standard headings such as `## Quickstart`, `## Prerequisites`, and `## Troubleshooting`.

## Facts

- Don't invent product behavior, limits, prices, benchmarks, dates, or availability. If the source doesn't say it, leave it out or ask.
- Don't infer that one product supports a feature because another one does.
- State the caveats that affect a real decision: preview status, destructive actions, prerequisites, and limits.
- Keep commands, code, file names, URLs, API names, and UI labels exactly as they are.

## Names and words

- **bunny.net** is always lowercase, also at the start of a sentence.
- Product names take a capital B: Bunny CDN, Bunny Storage, Bunny Stream, Bunny Shield, Bunny Database, Bunny DNS, Bunny Optimizer. Also: Magic Containers, Edge Scripting, Bunny CLI.
- Match the dashboard words: "Pull Zone", "storage zone", "video library", "Shield Zone", "app".
- Use one name for one thing. Don't cycle through synonyms.
- American spelling: color, behavior, customize.
- Bold UI labels exactly as they appear: **Save Settings**.
- Put flags, headers, file names, and literal values in code: `CDN-RequestId`.
- Escape every dollar sign as `\$`.

## Punctuation

- No em dashes, no en dashes, and no double hyphens as punctuation. Use a period, a comma, a colon, or parentheses.
- Straight quotes and apostrophes. No Unicode ellipsis.
- Sentence case for headings. No emoji in headings.

## Patterns to remove

**Openings and transitions**

- Rhetorical questions: "Not sure where to find X?", "Why does this matter?"
- Roadmap paragraphs: "In this guide, we'll cover".
- Announced transitions: "Let's dive in", "Now let's look at", "Here's what you need to know".
- Scene setting: "In today's world", "Imagine you're".
- Stock connectives: additionally, moreover, furthermore, notably, importantly, ultimately, overall, in conclusion.

**Words**

- Minimizers: simply, just, easily, effortlessly, "all you need to do is", "in a few clicks". Describe the work and let the reader judge the effort.
- Marketing: powerful, robust, flexible, seamless, modern, comprehensive, blazing fast, cutting-edge, best-in-class, out of the box, at scale. Name the mechanism, the limit, or the number instead.
- Stock vocabulary: delve, leverage, utilize, unlock, enhance, elevate, crucial, key, showcase, ensure, landscape.
- Filler: in order to, it is important to note, has the ability to, allows you to, enables you to, this means that.
- "serves as", "offers", "features", and "boasts" where "is" or "has" works.

**Sentence shapes**

- "Not X, but Y" and "not only X" used for effect. State the fact.
- A sentence that ends in "-ing" to add significance: "ensuring", "highlighting", "showcasing".
- Points forced into groups of three.
- A run of three or more very short sentences. Join the related clauses and keep one short sentence for the point that matters.
- Bold for emphasis inside a paragraph. Keep bold for UI labels.
- "Note:", "Pro tip:", or a callout on an ordinary sentence. Use a callout for a real warning, prerequisite, or limit.
- A heading repeated in the first sentence below it.
- Closing calls to action: "Ready to get started?", "Start building today".

## Public repository

Pages, commit messages, PR titles, and PR descriptions are public. Never include:

- links to internal tools, or ticket and roadmap keys;
- support ticket details, or anything that identifies a customer;
- names of colleagues, or who asked for a change.

Don't mention AI, automation, or how the text was written, in pages, commits, or pull requests.

## Before you finish

1. Search for `—`, `–`, and ` -- ` outside code. The count is zero.
2. Read every opening and every heading against [Patterns to remove](#patterns-to-remove).
3. Search for unescaped `$` in prose.
4. Check that every internal link points to a real page, without the `.mdx` extension.
5. Confirm that every fact, number, command, and link from the source is still correct.
