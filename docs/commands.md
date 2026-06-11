# Commands

```bash
pnpm install                  # install dependencies
pnpm dev                      # local development server
pnpm lint                     # lint source code
pnpm exec tsc --noEmit        # typecheck
pnpm build                    # production build
git status                    # changed files
git diff                      # exact uncommitted changes
```

Recommended pre-commit sequence:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
git status
git diff
```

A later cleanup can add this to `package.json`:

```json
"typecheck": "tsc --noEmit"
```

Then use `pnpm typecheck`.
