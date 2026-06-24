# DevSecOps

## Deployment

Deployment is handled by GitHub Actions:

- Workflow: `.github/workflows/deploy-all-inkl.yml`
- Trigger: push to `main` and manual `workflow_dispatch`
- Target: ALL-INKL via SSH and `rsync`

## Required Deployment Build

The production app is hosted under `/huepfburgen-app/`.

Use:

```bash
npm run build:deploy
npm run verify:base-href
```

The deployment workflow must run both commands before syncing files to ALL-INKL.
`npm run verify:base-href` uses a Node.js script so it works on GitHub-hosted runners without extra CLI tools.

## CI Recommendations

The repository has a separate CI workflow at `.github/workflows/ci.yml`:

- `npm ci`
- `npm run build`
- `npm test -- --watch=false --browsers=ChromeHeadless`

Deployment should only proceed from a known-good `main`.

## Secrets Handling

Expected GitHub Secrets:

- `ALLINKL_SSH_PRIVATE_KEY`
- `ALLINKL_SSH_HOST`
- `ALLINKL_SSH_USER`
- `ALLINKL_SSH_PORT`
- `ALLINKL_DEPLOY_PATH`

Do not echo secret values in workflow logs.

## Operational Notes

- Keep deployment scripts simple and auditable.
- Prefer explicit build verification over assumptions.
- Record deployment issues in `KNOWN_ISSUES.md`.
