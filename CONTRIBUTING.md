# Contributing Guide

- Fork the repo and create a feature branch.
- Run lint and tests locally before opening a PR.
- Keep PRs focused and include a clear description of changes and rationale.
- Follow commit message best practices (clear, imperative subject).
- Add/update tests when you change behavior or add features.
- Update relevant docs (README and docs/*) when you modify APIs or configuration.

## Development Setup
- Backend
  - cd server
  - npm install
  - npm run dev
  - npm run lint
  - npm test
- Client
  - cd packages/otp-client
  - npm install
  - npm test

## Coding Standards
- JavaScript: Node 18+, CommonJS in server.
- Linting: ESLint; ensure npm run lint passes.
- Testing: Jest + Supertest in server; client has a minimal test script.
- Security: never commit secrets; use environment variables.

## Pull Request Checklist
- Tests pass in CI.
- Lint passes.
- Docs added/updated as needed.
- No secrets or credentials committed.
