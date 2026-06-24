# Known Issues

## Issue Register

| Issue | Impact | Workaround | Owner | Status |
| --- | --- | --- | --- | --- |
| Deployment workflow uses the generic production build instead of the deploy-safe base href build. | Assets can be requested from the wrong path when hosted under `/huepfburgen-app/`. | Run `npm run build:deploy` and `npm run verify:base-href` manually before deploy-sensitive changes. | Project | Open |
| `architecture/docs/` contains unrelated React/Fastify/PostgreSQL SaaS documentation. | Agents or humans may infer the wrong project direction. | Use root Markdown files as the active source of truth. | Project | Open |
| Firestore read scope for bookings may be broader than needed. | Signed-in users may be able to read booking data beyond their own workflow needs. | Review `firestore.rules` before expanding booking features. | Project | Open |

## Resolved Issues

No resolved issues recorded yet.

