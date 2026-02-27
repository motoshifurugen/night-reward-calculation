# CLAUDE.md

## Project Summary
- This repo builds a Web-first product (React).
- Backend runs on Node.js (e.g., Next.js server/API or separate Node service).
- BaaS is currently evaluated (Firebase/Mongo, Google Sign-in, etc.).
- Goal: ship an MVP fast with TDD and keep docs as the single source of truth.

---

## Golden Rules (must follow)
1. Always work from an Issue. If none exists, propose the Issue(s) first.
2. Keep changes small: prefer multiple small PRs over one large PR.
3. **Context discipline:** read before edit; avoid assumptions; quote file paths and current behavior.
4. **Multi-file changes:** write a short plan first and wait for my explicit **"proceed"** before editing many files.  [oai_citation:8‡GitHub](https://github.com/rohitg00/pro-workflow)
5. **Quality gates:** after edits, run lint → typecheck → tests (and fix failures).  [oai_citation:9‡GitHub](https://github.com/rohitg00/pro-workflow)
6. **No debug statements:** never leave `console.log`, `debugger`, `print`, etc. in committed code.  [oai_citation:10‡GitHub](https://github.com/rohitg00/pro-workflow)
7. Never commit secrets. Use env vars and `.env.example`.
8. Update docs when behavior/architecture changes (`docs/` is source of truth).
9. Prefer simple solutions; avoid new dependencies unless necessary.
10. If uncertain, state assumptions explicitly and proceed with a sensible default.

---

## Pro Workflow (lightweight)
These rules optimize for an 80/20 workflow: AI writes most code, humans review at checkpoints.  [oai_citation:11‡SkillsLLM](https://skillsllm.com/skill/pro-workflow?utm_source=chatgpt.com)

### Self-Correction (LEARNED)
When I correct you, do this:
- Propose a short rule (1–3 lines) that would have prevented the mistake.
- Ask to add it to the **LEARNED** section below.
- Once approved, append it to LEARNED.  [oai_citation:12‡GitHub](https://github.com/rohitg00/pro-workflow)

### Wrap-Up Ritual (end of task/session)
Before concluding:
- Summarize what changed (files + key behavior).
- Note remaining risks / TODOs.
- Provide the next 1–3 concrete actions or Issues to open.  [oai_citation:13‡GitHub](https://github.com/rohitg00/pro-workflow)

### Parallel Work (optional)
If blocked, suggest parallel tracks (e.g., investigate vs implement) and, if we use worktrees, propose a worktree split.  [oai_citation:14‡GitHub](https://github.com/rohitg00/pro-workflow)

---

## Workflow
- Issue -> branch -> PR
- Branch naming:
  - `feat/<issue-id>-short-slug`
  - `fix/<issue-id>-short-slug`
  - `chore/<issue-id>-short-slug`
- PR must include: `Closes #<issue-id>`.

### Atomic Commits
- Prefer small, focused commits (one idea per commit).
- Use conventional style if the repo already does (e.g., `feat:`, `fix:`).  [oai_citation:15‡GitHub](https://github.com/rohitg00/pro-workflow)

---

## Testing (TDD)
### Definition of Done (PR)
- Lint, typecheck, unit tests pass
- New domain logic has unit tests (TDD-first)
- Critical flow has at least one integration or e2e test when applicable
- No flaky tests introduced

### Commands (update to match repo)
- Install: `pnpm i` (or `npm i`)
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Unit: `pnpm test`
- E2E: `pnpm test:e2e`
- Build: `pnpm build`

---

## Architecture (high level)
- Frontend: React UI
- Backend: Node.js runtime (Next.js server/API or separate Node service)
- BaaS/DB: (Decide in tech-stack ADR)
- CI/CD: GitHub Actions -> deploy target

---

## Auth & Data Rules
- If we use Google Sign-in: do not store user email in DB unless explicitly approved.
- Prefer stable user identifiers (`uid/sub`) for primary keys.
- API must verify auth; do not trust client.

---

## Docs (single source of truth)
- Docs live in `docs/`.
- If you change behavior, update relevant docs:
  - `docs/arch/*`, `docs/api/*`, `docs/data/*`, `docs/quality/*`, `docs/ux/*`
- When creating new docs, add them to `docs/README.md`.

---

## PR Template (include in PR description)
- What / Why:
- Scope:
- Screenshots (if UI):
- Tests:
- Docs updated:
- Risks / Rollback:

---

## Security
- No secrets in git. Use env vars + `.env.example`.
- Avoid logging PII. Do not log tokens.
- Validate inputs on the server.

---

## LEARNED (append-only, approved rules)
- (empty)
