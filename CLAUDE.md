# Claude / Agent Context

This file exists for agent tools that look for `CLAUDE.md` first.

Primary project instructions live in:

- `AGENTS.md`
- `AGENT.md`
- `AI_AGENT_RULES.md`

## Repository Identity

This repository is the Angular/Firebase Huepfburgen app.

It is not the React/Fastify/PostgreSQL SaaS project described in the old `architecture/docs/` folder.

## Required Behavior

- Respond to the user in German.
- Keep technical documentation and code comments in English.
- Preserve existing Angular/Firebase architecture.
- Keep deployment under `/huepfburgen-app/` working.
- Prefer small, testable, reviewable changes.

## Useful Commands

```bash
npm start
npm run build
npm run build:deploy
npm run verify:base-href
npm test
```

For complete instructions, read `AGENTS.md`.

