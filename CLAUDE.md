# Working in this repository

Read [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) first. It holds the PR flow and
the style guide for pages, frontmatter, headings, screenshots, and components.

## This repository is public

Everything here is public. This includes the pages, the commit messages, the PR title,
and the PR description.

Never write internal information into this repository:

- No links to internal tools, such as Slack, Jira, Zendesk, Confluence, or Notion.
- No support ticket details, and nothing that identifies a customer.
- No names of colleagues, and no record of who asked for a change.
- No unreleased features, and no internal tooling.

## Pull request descriptions

Write short bullet points. Say what changed, and say how the change helps a reader.

Keep the reason generic. Write "users could not find this limit" instead of the ticket
that reported it.

## Dollar amounts

Escape every dollar sign as `\$`. Mintlify reads a pair of unescaped dollar signs on
one line as LaTeX, and renders the text between them in a math font.

```
Good: Add \$20 and we'll drop \$25 into your account.
Bad:  Add $20 and we'll drop $25 into your account.
```
