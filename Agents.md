## AI Agents for `adaptive-stressapp`

This document describes how AI coding agents (like Cursor’s built‑in assistants) should work with this repository.

### Overall goals

- **Primary purpose**: Help build and maintain the adaptive stress application (backend, frontend, and related tooling).
- **Priorities**: 
  - **Correctness and safety** over speed.
  - **Clarity and maintainability** over cleverness.
  - **Small, incremental changes** over large, risky refactors.

### Default agent behavior

- **Be action‑oriented**: If a request is reasonably clear, proceed to implement it rather than only proposing options.
- **Prefer minimal, focused edits**: Touch only the files needed; keep diffs easy to review.
- **Keep responses concise**: 
  - Use short explanations unless the user explicitly asks for more detail.
  - Use `###`/`##` headings and bullet points for structure.
- **No unnecessary comments**: 
  - Add comments only for non‑obvious intent, trade‑offs, or constraints.
  - Do **not** narrate obvious code (“// increment counter”, etc.).

### Working with the codebase

- **Reading before writing**:
  - Always inspect relevant files with the read tools before editing.
  - Respect existing patterns, style, and architecture where possible.
- **Dependencies**:
  - Use the existing dependency and tooling choices unless the user explicitly approves new ones.
  - If a new dependency is required, briefly justify it and add it to the appropriate manifest.
- **Testing and linting**:
  - When changes are non‑trivial, run or describe appropriate tests.
  - After edits, use lint diagnostics on touched files and fix new issues introduced by the change.

### User communication

- **Assumptions**:
  - If requirements are ambiguous, make reasonable assumptions, state them briefly, and continue.
  - Do **not** block on confirmation for minor design choices.
- **Status updates**:
  - For multi‑step work, provide brief progress updates (1–2 sentences) after meaningful steps or tool use.
- **Summaries**:
  - End each task with a short summary (max ~4 sentences) of what changed and any follow‑ups to consider.

### File and project conventions

- **File naming**:
  - Follow the existing naming patterns in this repo (e.g., casing, directory layout).
  - When creating new files, keep names descriptive and consistent with neighbors.
- **Documentation**:
  - If you add or significantly change behavior, update `README.md` or add targeted docs as needed.
  - Keep documentation practical and tied to actual workflows (how to run, test, and develop).

### When adding new agents or rules

If future agents or Cursor rules are added for this project:

- **Keep them in sync** with this `Agents.md`. If behavior diverges, update this file.
- **Document new roles**:
  - What the agent is specialized for (e.g., “backend API design”, “React UI implementation”).
  - Any extra constraints or style guidelines that apply only to that agent.

### Safety and privacy

- **Secrets and credentials**:
  - Never commit `.env` files or credentials; warn the user if they request this.
  - Redact tokens, keys, and sensitive PII from logs and examples.
- **Destructive operations**:
  - Avoid destructive git commands (`reset --hard`, `push --force`, etc.) unless the user explicitly requests them and understands the risk.
  - Prefer reversible operations and clear explanation of impact.

