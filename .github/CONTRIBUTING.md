# Contributing

Anyone is welcome to contribute to this repository to improve the bunny.net developer experience.

## External Contributors

1. Fork the repo
2. Create a branch for your changes
3. Open a PR against `main`
4. Wait for review and approval

## Staff

1. Create a branch from `main`
2. Open a PR
3. Get team approval, then merge when ready

---

## Style Guide

### File Naming

**Page files**: New page filenames (slugs) must relate to the page `title`. Use lowercase letters and hyphens.

```
Title: "Enable MP4 Fallback"
Good:  /stream/enable-mp4-fallback.mdx
Bad:   /stream/mp4.mdx
```

**Renaming pages**: When renaming or moving a page, add a redirect in `docs.json` to preserve existing links.

**Images**: Use SEO-friendly names and store in the appropriate product folder.

```
Good: /stream/enable-mp4-fallback.png
Bad:  /images/Screenshot 2024-01-15.png
```

### Frontmatter

Every page should include `title` and `description` frontmatter. These are used for meta title/description, so write them with SEO in mind.

```yaml
---
title: "Enable MP4 Fallback for Stream"
sidebarTitle: "MP4 Fallback"
description: "Learn how to enable MP4 fallback for broader device compatibility."
---
```

- **`title`**: Full, descriptive page title (used in meta tags)
- **`sidebarTitle`**: Use when the `title` is too long for clean navigation. Keep it short and scannable.
- **`description`**: Concise summary for search engines and link previews

### Headings

Do not use H1 (`#`) in page content. The page `title` in frontmatter serves as the H1. Start with H2 (`##`) and use H3 (`###`) for subsections.

### Screenshots

**Do:**

- Wrap screenshots in `<Frame>` for consistent styling
- Crop to show only the relevant UI area
- Use red outlines to highlight elements that need attention
- Add multiple focused screenshots for multi-step processes
- Pixelate or blur sensitive information (API keys, account balances, secret keys)
- Edit the DOM to remove beta/preview features before capturing

**Don't:**

- Include unnecessary UI elements (sidebars, navigation, account info)
- Take full-page screenshots when a focused crop works better
- Expose features in closed preview or beta that shouldn't be public

**Light and Dark Mode:**

Providing separate images for light and dark mode is preferred but not required. Use the following syntax:

```md
![Alt text](/path/to/light-image.png)
![Alt text](/path/to/dark-image.png)
```

See [Mintlify's image embeds documentation](https://www.mintlify.com/docs/create/image-embeds#light-and-dark-mode-images) for more details.

### Mintlify Components

Use components where they add clarity, but don't overuse them. Common components include:

- `<Info>` - For important callouts
- `<Steps>` - For sequential instructions
- `<Accordion>` - For collapsible content

Look at existing docs for good examples of component usage.

### Content Structure

**Quickstarts**: Include quickstart guides for features and products. Users should be able to follow along quickly to accomplish the task, then dive into details in other sections.

**Avoid FAQs**: If questions keep coming up, the documentation likely isn't clear enough. Improve the main content instead of adding an FAQ section.

**Troubleshooting sections**: Use `<AccordionGroup>` with `<Accordion>` components for troubleshooting sections. This keeps common issues scannable without cluttering the page.

### Linking and Reuse

**Link to existing content**: For prerequisites or related topics, link to existing pages rather than re-documenting. This keeps content maintainable and reduces duplication.

```md
Good: You must have a [Video Library created](/stream/quickstart#creating-a-video-library).
Bad: To create a Video Library, go to Stream > Add Video Library... [screenshot]
```

**Use snippets for shared content**: When the same steps or code appear on multiple pages, use [Mintlify snippets](https://mintlify.com/docs/content/reusable-snippets) so content is maintained in one place.
