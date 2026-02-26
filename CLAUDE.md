# VPN World — CLAUDE WORK CONSTITUTION (READ FIRST)
LAST UPDATED: 2026-02-26
OWNER: Denys Shchur / VPN World
STATUS: ABSOLUTE RULESET (Do not improvise)

---

## 0) PRIME DIRECTIVE (READ THIS ONCE)
- Treat the repository files + user task brief as the ONLY truth.
- No assumptions. No invented paths/slugs/links. No “best guess”.

---

## 1) SOURCE OF TRUTH (MUST READ BEFORE ANY EDIT)
Before ANY edit, you MUST read these files in this order:

1) /_standards/CLAUDE_BOOT.md
2) /_standards/VPNW_STAGE25_STANDARD.md
3) /_standards/VPNW_LOCALIZATION_STANDARD.md
4) /_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json
5) /standards/STRUCTURE_INDEX.md

These override your prior knowledge. No exceptions.

---

## 2) REPO-RELATIVE PATH RULE (CRITICAL — FIXES “/c/AI_WORK/…” FAILS)
ABSOLUTE RULE:
- NEVER use OS-absolute paths like:
  - /c/AI_WORK/...
  - C:\AI_WORK\...
  - /home/... or /root/...
- ALWAYS use repo-relative paths from repository root:
  - ./_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json
  - ./_standards/VPNW_STAGE25_STANDARD.md
  - ./standards/STRUCTURE_INDEX.md
  - ./nl-be/blog/vpn-dns-leak.html

If a required file is not found at the repo-relative path:
- STOP.
- Report “missing file at ./_standards/...” and ask the user to provide/fix it.
- DO NOT scan the repo to “find something similar”.

(Reason: prevents hallucinated structure + prevents token-wasting scans.)

---

## 3) SCANNING LIMIT (NO REPO-WIDE SCANS)
Allowed reads:
- The target file(s) being edited
- The 5 Source-of-Truth files above
- SLUG_INDEX JSON (for internal links)

Forbidden:
- “scan entire repo”
- recursive grep/ls across many files
- “explore all locales” unless user explicitly requests

If you need to confirm 1–3 paths:
- do minimal targeted checks only, not wide scans.

---

## 4) HREFLANG + LANGUAGE SWITCHER (BYTE-IDENTICAL)
CRITICAL:
- NEVER modify, regenerate, reorder, or “fix” the hreflang block.
- NEVER modify, regenerate, reorder, or “fix” the language switcher block.
- Preserve EXACTLY as in the original file.
- After editing, verify they stayed byte-identical.

Only if the user explicitly requests changes, then and only then.

---

## 5) SLUG/LINKING RULE (SLUG INDEX IS LAW)
All internal links + locale mappings MUST come ONLY from:
- /_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json

Rules:
- Links must be same locale
- Links must exist in SLUG_INDEX
- Do NOT guess translated slugs
- Max contextual links inside body: follow Stage 2.5 standard

If a desired target is not in SLUG_INDEX:
- do not link it
- ask user / wait for updated SLUG_INDEX

---

## 6) AUTHORSHIP / VOICE RULE
Write ONLY as:
- Denys Shchur / VPN World

Forbidden:
- mentioning AI/Claude/model/analysis/automation
- “I can’t browse…”
- generic filler

Tone:
- human, expert, region-aware, practical

---

## 7) LOCALE RULE (NO MIXED LANGUAGES)
- Page language must be 100% the locale language (NL-BE here).
- Use real regional references (NL-BE: Proximus, Telenet, Orange BE).
- No accidental English/German fragments.

---

## 8) OUTPUT RULE (KEEP CHAT CLEAN)
When finishing a task:
- Output only:
  1) updated file(s)
  2) a SHORT bullet list of changes (max 6 bullets)
  3) confirmation: hreflang + switcher byte-identical
  4) final URL

No extra commentary. No “timeline”. No filler.

END.