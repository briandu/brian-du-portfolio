# Smart Commit

Follow the commit conventions in [`.cursor/rules/commits.mdc`](../rules/commits.mdc).

## 1. Analyze Changes

- Run `git status`, `git diff`, and `git diff --cached`.
- Identify **logical groupings** (hero, case study, brand, frames, assets, docs, rules). Do not mix unrelated changes in a single commit.

## 2. Cleanup (MANDATORY)

- Scan every modified file for temporary debug code:
  - `console.log(...)`, `console.debug(...)`, `console.info(...)` used for debugging
  - `debugger`, commented-out debug code
- Remove any such code before staging.

## 3. Secret and .gitignore Scan (MANDATORY)

- Scan staged content for secrets — NEVER commit:
  - `.env` file contents pasted into code
  - JWTs (`eyJ...`), API keys (`sk-`, `ghp_`, `AKIA`, `sk_live_`, Vercel tokens)
- Verify `.gitignore` covers `.env`, `node_modules/`, `.vercel`.

## 4. Test Validation

- This repo has no test suite. Skip `npm test`.
- If tests are added later, run them before committing code changes and **STOP** on failure unless the user explicitly gives the go-ahead.

## 5. Commit Message Format

Conventional Commits:

```
<type>(<scope>): <description>
```

- **Types**: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `chore` | `ci`
- **Scopes**: `hero`, `work`, `amplify`, `seedwell`, `resume`, `brand`, `frames`, `assets`, `deploy`, `rules`
- Imperative, present tense, lowercase description (~50 chars when possible; max 72).
- Body bullets consecutive with **NO blank lines** between them.
- NEVER use multiple `-m` flags. Use a single heredoc:

```bash
git commit -m "$(cat <<'EOF'
feat(hero): swap logo fallback for cursor turntable

- Add 19 transparent WebP frames under frames/
- Hide the BD mark once portraits load
EOF
)"
```

## 6. Categorize & Commit

- One commit per logical group; stage only that group's files.
- Order: shared runtime/assets → page HTML → docs/rules.
- After each commit, check `git log -1 --format=%B` for a `Made-with: Cursor` trailer; amend to strip it if present.

## 7. Verify

- Run `git status` and `git log --oneline -5`.
- End state: clean working tree, or only intentional untracked/gitignored files.
- Do **NOT** push unless explicitly requested.

---

**Summary**: Analyze → remove debug → scan secrets → group by intent → one Conventional Commit per group → strip Cursor trailer → verify.
