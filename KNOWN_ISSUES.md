# Known Issues

## Issue Register

| Issue | Impact | Workaround | Owner | Status |
| --- | --- | --- | --- | --- |
| Deployment workflow used the generic production build instead of the deploy-safe base href build. | Assets could be requested from the wrong path when hosted under `/huepfburgen-app/`. | Workflow now runs `npm run build:deploy` and `npm run verify:base-href`. | Project | Resolved |
| Legacy documentation for another React/Fastify/PostgreSQL SaaS project exists under `docs/legacy-other-projects/react-fastify-postgresql-saas/`. | Agents or humans may infer the wrong project direction if they use it as active context. | Use root Markdown files as the active source of truth. | Project | Mitigated |
| Firestore read scope for bookings may be broader than needed. | Signed-in users may be able to read booking data beyond their own workflow needs. | Review `firestore.rules` before expanding booking features. | Project | Open |
| Initial bundle exceeds the current Angular budget. | Builds pass, but Angular warns that the initial bundle is 1.04 MB against a 900 kB budget. | Track as a performance task; do not block current stabilization work. | Project | Open |

## Resolved Issues

No resolved issues recorded yet.
