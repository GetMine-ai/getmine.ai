# getmine.ai

Static marketing site for [GetMine](https://getmine.ai) — a local-first
personal health vault for macOS and Windows. Built with [Astro](https://astro.build),
served by GitHub Pages.

## Development

Requires Node 22+ (see `.nvmrc`) and pnpm (version pinned in `package.json`).

```sh
pnpm install
pnpm dev        # dev server on http://localhost:3000
pnpm check      # astro type/diagnostics check (also runs in CI)
pnpm build      # static build into dist/
pnpm preview    # serve the built dist/ locally
```

Environment overrides (optional) are documented in `.env.example`.

## Deployment

`.github/workflows/deploy.yml` builds on every push and pull request; pushes to
`main` additionally publish `dist/` to GitHub Pages. The custom domain is
preserved via `public/CNAME`. Nothing deploys from other branches.

## Layout

- `src/pages/` — routes (`index`, `beta`, `privacy`, `trust`, `welcome`, `404`)
- `src/components/` — homepage sections and shared chrome
- `src/layouts/` — `Base.astro` (marketing pages) and `LegalPage.astro` (text pages)
- `public/` — assets copied verbatim into the build
- `apps-script/` — Google Apps Script companion for the waitlist (see its README)

Copy on the public pages is ruled by Sabine — treat wording changes as hers to
approve, not routine edits.
