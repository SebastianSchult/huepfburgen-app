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

## CI Recommendations

Add a separate CI workflow before or alongside deployment:

- `npm ci`
- `npm run build`
- relevant tests

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

