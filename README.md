# anujssmishra.github.io

Personal academic website of Anuj S.S. Mishra, Ph.D. scholar in Information Technology & Systems at IIM Lucknow.
Live at **https://anujssmishra.myfanverse.in** (GitHub Pages, custom domain set in `CNAME`).

It is a single static page with no build step: plain HTML, one stylesheet and one small script.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | All page content |
| `assets/css/site.css` | Styles, colours (light and dark), layout |
| `assets/js/site.js` | Theme toggle, mobile menu, copy buttons, and the papers-and-talks chain in the header area |
| `assets/fonts/` | Self-hosted Archivo and IBM Plex Mono (SIL Open Font License) |
| `assets/img/` | Portrait crops and the social-sharing image (`og.jpg`) |
| `CV-PhD-ANUJ-SS-MISHRA.pdf` | The CV that every "CV" link opens. Replace this file to update it; keep the name |
| `photo.jpeg` | Original full-size photo the portrait crops were made from |
| `404.html`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Site plumbing |

## Common updates

**Add a conference paper or talk.** In `index.html`, find the right year under "Conference papers and talks" and copy an existing `<li class="entry">` block. To have it appear in the chain of blocks under the introduction, keep these attributes on the `<li>`:

```html
<li class="entry" id="p-short-id" data-chain data-date="2027-08-12" data-short="AMCIS" data-place="City">
```

- `data-date` (YYYY-MM-DD) orders the chain.
- `data-short` and `data-place` are the two words shown on the block.
- Add `data-state="pending"` for something accepted but not yet presented; it is drawn as a dashed block.

The fingerprints on the blocks are computed in the browser from the entry's text, so nothing else needs editing. When a pending talk has happened, remove `data-state="pending"`, change the status text and dot (`dot--pending` to `dot--done`), and update the sentence about dashed blocks in the chain note.

**Change a status** (for example "Conditionally accepted" to "Accepted"): edit the `entry-status` paragraph of that entry.

**Update the date in the footer** ("Last updated …") and the `lastmod` in `sitemap.xml` whenever content changes.
