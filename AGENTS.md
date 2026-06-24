# Agent Instructions

This file is the first reference for AI agents working in this repository.

## Project Context

- Project: Huepfburgen App
- Repository: `SebastianSchult/huepfburgen-app`
- Stack: Angular 19, TypeScript, Angular Material, AngularFire, Firebase Auth, Firestore, FullCalendar
- Deployment target: ALL-INKL hosting under `/huepfburgen-app/`
- Primary user language: German
- Code, comments, commit messages, documentation, and GitHub issues: English

## Current Product Shape

This is an Angular/Firebase rental application for inflatable castle bookings.

Main areas:

- Public home page
- Login and registration
- User booking calendar and booking request flow
- Admin dashboard
- Admin booking management
- Admin equipment management
- Admin user management

## Working Rules

- Prefer small, reviewable changes.
- Read the existing Angular patterns before editing.
- Preserve working user flows unless the task explicitly changes them.
- Do not rewrite working components just for style.
- Keep Firestore data shapes aligned with `firestore.rules` and models in `src/app/models`.
- Keep UI behavior responsive for desktop and mobile.
- Do not add new dependencies unless they clearly reduce complexity or are necessary.
- Do not commit secrets, Firebase credentials outside the intended config, SSH details, or deployment credentials.

## Local Commands

```bash
npm start
npm run build
npm run build:deploy
npm run verify:base-href
npm test
```

Use `npm run build:deploy` for production deployment checks because the app is hosted under `/huepfburgen-app/`.

## Deployment Rules

- The production app must be built with `<base href="/huepfburgen-app/">`.
- After a deploy build, run `npm run verify:base-href`.
- The GitHub Actions workflow deploys from `main` to ALL-INKL.
- Any workflow change must preserve SSH-secret based deployment and avoid printing secrets.

## Git Workflow

- Work on feature branches where possible.
- Keep `main` deployable.
- Use pull requests for non-trivial changes.
- Summaries should mention tests/builds that were run.

## Documentation Sync

When project work changes behavior, architecture, deployment, QA, or known risks, update the relevant root Markdown file:

- `ARCHITECTURE.md`
- `ROADMAP.md`
- `DECISIONS.md`
- `QA_GUIDELINES.md`
- `SECURITY.md`
- `DEVSECOPS.md`
- `KNOWN_ISSUES.md`

The old `architecture/docs/` folder currently contains context from another SaaS project and must not be treated as the source of truth for this app.

