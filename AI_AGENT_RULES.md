# AI Agent Rules

## Core Rules

- Use `AGENTS.md` first.
- Treat this as an Angular/Firebase project.
- Ignore the old SaaS architecture docs unless the user explicitly asks about them.
- Keep changes small and reviewable.
- Explain relevant changes in German to the user.
- Write technical docs, code comments, and issue text in English.
- Do not introduce unrelated refactors.
- Do not remove user changes.
- Do not commit or expose secrets.

## Code Editing Rules

- Prefer existing Angular patterns.
- Use services for Firestore access.
- Keep models and Firestore rules aligned.
- Preserve mobile and desktop layouts.
- Keep dependency changes intentional and documented.

## Documentation Rules

Update root Markdown files when project knowledge changes:

- `ARCHITECTURE.md`
- `DECISIONS.md`
- `ROADMAP.md`
- `QA_GUIDELINES.md`
- `SECURITY.md`
- `DEVSECOPS.md`
- `KNOWN_ISSUES.md`

## Verification Rules

- Run the narrowest useful verification.
- For deploy-sensitive changes, run `npm run build:deploy` and `npm run verify:base-href`.
- If tests or builds cannot be run, state why.

