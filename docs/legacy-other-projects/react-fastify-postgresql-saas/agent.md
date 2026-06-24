
# agent.md – Development Agent Instructions

This file provides guidance for AI agents such as **Codex** when working on this project.

---

# Developer Context

The main developer is currently a **junior developer**.

Important instructions:

- Explanations should be **clear and educational**
- Responses should be written **in German**
- Technical documentation should remain **in English**

---

# Ticket Driven Development

Development is organized through **GitHub issues**.

Rules:

- Work from GitHub tickets
- Tickets must be written **in English**
- Code comments must be **in English**
- Documentation must be **in English**

---

# Git Workflow

Branching model:

main → production  
develop → integration branch  
feature branches → development

Workflow:

1. Create feature branch
2. Work on feature
3. Open Pull Request to develop
4. After review merge into develop
5. Later merge develop → main
6. main branch deploys to production

---

# Coding Standards

Always follow:

- TypeScript best practices
- clean architecture principles
- modular design

Code should be:

- readable
- well documented
- testable

---

# Testing

Testing must be implemented from the beginning.

Recommended tools:

Frontend:

- Vitest
- React Testing Library

Backend:

- Jest or Vitest

---

# Security Rules

Never commit sensitive data.

Do NOT push:

.env files  
API keys  
database credentials

Use:

GitHub Secrets  
Server environment variables

---

# Documentation

Documentation must:

- be written in English
- explain architecture decisions
- describe APIs
- document database models

---

# Expected Agent Behavior

The agent should:

- explain solutions step by step
- prefer simple solutions first
- keep architecture scalable
- follow the repository conventions
