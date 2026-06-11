@AGENTS.md

# CLAUDE.md

Claude Code is the current coding assistant for Offroadify. `AGENTS.md` is the canonical project instruction file.

## Standard workflow

1. Read the active task under `.ai/tasks/`.
2. Inspect the current implementation.
3. Make the smallest change satisfying the task.
4. Run the checks listed in the task.
5. Do not commit or push unless explicitly asked.
6. Summarize what changed and how to verify it.

## Scope discipline

Do not implement future roadmap items unless the active task requests them. Do not add authentication, persistence, payments, multiple presets, 3D, custom training, or local inference during the MVP tasks.

## Dependency discipline

Before adding a dependency, explain what problem it solves and check whether the existing stack already solves it.

## Security

- Keep `OPENAI_API_KEY` server-side.
- Never put secrets in client code, logs, docs, tests, or commits.
- Validate uploaded file type and size on the server.
- Do not persist images during the first MVP.

## Example invocation

```text
Read .ai/tasks/001-upload-and-preview.md.
Implement only this task.
Do not add dependencies.
Run the listed checks.
Do not commit.
Summarize changed files, behavior, checks, and manual verification steps.
```
