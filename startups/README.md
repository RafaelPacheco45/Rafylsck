# Startups portfolio

Static pages in the existing Rafylsck site. Edit `projects.json`, then run:

```sh
python scripts/build-startups.py
python -m unittest discover -s tests -v
node tests/test-startups-filters.cjs
node --check js/startups.js
```

No new dependencies, external fonts, analytics, accounts or backend. Every page remains readable without JavaScript; filters are progressively enhanced. CSS respects reduced motion.

## Assets and content

Existing repo logos: AutoZap, AutoBook, JuriX, AnjoGuard and Rafylsck. Teseu and AdHub logos copied from the owner's existing project assets. Oraculum uses a typographic monogram, not a claimed official logo. Illustrations are from the existing AutoZap and AdHub marketing assets, optimized as WebP and clearly captioned as illustrative, not client locations. No client screenshots, credentials or private personal data are included.

The existing portfolio identifies **AdHub**. The voice request said “ChatHub”; the implementation uses the verified project name rather than creating an unverified company. The main page also links to the full project catalogue for other research and software efforts.

Each project distinguishes its current stage from its vision. No launch, revenue, certification, medical capacity or legal filing claims are inferred from concepts.

## Validation scope

Automated checks cover generated-page reproducibility, local asset/navigation targets, unique IDs, heading/main semantics, image alt attributes, progressive enhancement and repeated filter behavior. JavaScript syntax and diff whitespace checked. Live desktop/mobile/keyboard visual testing remains pending: the cloud browser could not reach the local preview server (connection refused). Do not describe that visual review as completed.

Publishing is not automatic from this feature branch. Review and merge/deploy through the repository's established workflow.
