# Agent Handbook

This repository follows the SebsBrain repository starter pattern. Use `AGENTS.md` as the primary machine-readable instruction file and this file as the concise human-facing handbook.

## Mission

Build and stabilize a practical Angular/Firebase booking application for inflatable castle rental workflows.

## Engineering Principles

- Keep changes incremental.
- Keep components readable and testable.
- Respect existing Angular standalone component patterns.
- Keep Firestore access centralized in services.
- Keep security rules and frontend assumptions in sync.
- Prefer explicit, simple code over premature abstraction.

## Before Editing

1. Check `git status --short`.
2. Read the component, service, model, and spec files related to the task.
3. Check whether the change touches deployment, Firestore rules, or auth.
4. Update documentation when the change affects project knowledge.

## Done Criteria

A task is done when:

- The requested behavior is implemented.
- Related tests or builds were run where practical.
- Deployment-sensitive changes were checked with `npm run build:deploy` and `npm run verify:base-href`.
- Docs were updated if project rules, roadmap, architecture, QA, security, or known issues changed.

