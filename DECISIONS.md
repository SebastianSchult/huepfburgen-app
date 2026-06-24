# Decisions

This file records project decisions that should remain visible to future work.

## 2026-06-24: Treat This Repository as the Angular/Firebase App

Decision:

This repository is the Angular/Firebase Huepfburgen app. The React/Fastify/PostgreSQL SaaS architecture notes in `architecture/docs/` are not the source of truth for this project.

Reason:

The current codebase, dependencies, routes, services, and deployment workflow are Angular/Firebase based.

Impact:

- New work should follow Angular/Firebase conventions.
- Root-level repository docs define the active project context.
- The old `architecture/docs/` folder should be ignored for implementation planning unless it is explicitly migrated or removed.

## 2026-06-24: Deploy Build Must Use the `/huepfburgen-app/` Base Href

Decision:

Production builds for hosting must use `npm run build:deploy` and then `npm run verify:base-href`.

Reason:

The app is hosted under `/huepfburgen-app/`. A wrong base href causes browser requests for JavaScript, CSS, and font assets to target the wrong path.

Impact:

- Deployment automation should use the deploy-safe build command.
- Build verification should check the generated `index.html`.

