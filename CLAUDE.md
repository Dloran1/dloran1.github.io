# VPN World — CLAUDE WORK CONSTITUTION (READ FIRST)
LAST UPDATED: 2026-02-25
OWNER: Denys Shchur / VPN World
STATUS: ABSOLUTE RULESET (Do not improvise)

---

## 0) YOU ARE NOT SELF-UPDATING (IMPORTANT)
Your training knowledge may be outdated (mid-2025).  
Therefore:

- Treat **user-provided repo files** + **user-provided task brief** as the only truth.
- If you need a fresh fact (laws, providers, UI expectations, SEO rules) and it’s not in repo/brief → **ask** or **stop that part**.
- Never “fill gaps” with assumptions.

---

## 1) SOURCE OF TRUTH (MUST READ)
Before ANY edit, you MUST read these files first:

1) `/ _standards / CLAUDE_BOOT.md`  
2) `/ _standards / VPNW_STAGE25_STANDARD.md`  
3) `/ _standards / VPNW_LOCALIZATION_STANDARD.md`  
4) `/ _standards / SLUG_INDEX_FROM_HREFLANG_FLAT.json`  
5) `/ standards / STRUCTURE_INDEX.md`  ← CRITICAL (structure map)

These five files override your prior knowledge.

---

## 2) ZERO-GUESS RULE (NO HALLUCINATIONS)
- DO NOT invent: URLs, slugs, paths, hero filenames, internal link targets, locale folders.
- If a path/slug/link is not confirmed by the repo or SLUG_INDEX → STOP and ask.
- Output must be production-ready; no placeholders; no “AI says…”.

---

## 3) HREFLANG + LANGUAGE SWITCHER (BYTE-IDENTICAL RULE)
CRITICAL:

- NEVER modify, regenerate, reorder, or “fix” the **hreflang block**.
- NEVER modify, regenerate, reorder, or “fix” the **language switcher** block.
- Do NOT “search for a better version”. Preserve EXACTLY as in the original file.
- After editing, verify they stayed byte-identical.

If user explicitly asks to change them → only then.

---

## 4) DO NOT SCAN THE ENTIRE REPO (TOKEN/LIMIT SAFETY)
Claude must NOT do deep scanning by default.

Allowed scanning:
- Read ONLY the specific target page(s).
- Read the 5 source-of-truth files.
- Read SLUG_INDEX JSON for linking.
- If you must confirm existence of 1–3 paths, do minimal checks.

Forbidden:
- Grep/ls across thousands of files as a routine.
- “Explore all locales” unless user explicitly requests.

---

## 5) LINKING RULE (SLUG INDEX IS LAW)
All internal links + locale mappings must come ONLY from:

`/_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json`

Rules:
- Build internal links only to pages that exist in the current locale.
- Keep context links in main text within limits defined in Stage 2.5 standard.
- Do NOT guess translations of slugs.

Cross-site linking (VPN World ↔ SmartAdvisorOnline) is allowed ONLY if the user’s brief explicitly requests it.

---

## 6) AUTHORSHIP / VOICE RULE
All content must read as written by:
- Denys Shchur / VPN World  
(or if the task brief explicitly says SmartAdvisorOnline voice, then that)

Forbidden:
- “As an AI…”
- “I can’t browse…”
- robotic filler / generic SEO fluff
- auto-translation tone

Tone:
- Human + expert
- region-aware, practical, specific

---

## 7) LOCALE ADAPTATION RULE (NO AUTO-TRANSLATION)
Each locale must be rewritten as native, current, region-specific content:
- local ISPs/operators (examples must fit locale)
- local laws/regulators (only if user brief provides them or repo contains them)
- local user problems (devices, streaming platforms, routers typical for locale)
- no mixed languages inside one locale page

If missing locale facts → ask user or keep statements general and honest.

---

## 8) PAGE LAYOUT / PLACEMENT RULES (SUMMARY)
You must follow Stage 2.5 template exactly (see VPNW_STAGE25_STANDARD). Key anchors:

- H1: single, clear.
- Quick Answer / Key takeaway: present as required.
- Widgets: place AFTER Quick Answer and BEFORE first H2 (unless brief overrides).
- Tables + SVG diagrams: use the high-contrast + responsive wrappers defined in the standard.
- CTA blocks: exactly 2 (upper + lower), using the required classes/pattern.

---

## 9) OUTPUT REQUIREMENTS (EVERY TASK)
When you finish a task, you MUST provide:

1) Final result as a COMPLETE updated HTML file (not fragments), OR the exact updated file(s) content if requested.
2) Short “WHAT CHANGED” bullet list.
3) Final page URL (absolute).
4) Confirmation: hreflang + language switcher stayed byte-identical (unless user asked to change).

---

## 10) FAIL-SAFE
If at any point you don’t know an exact path/slug/filename:
- STOP editing that part
- consult SLUG_INDEX / STRUCTURE_INDEX / repo file
- proceed only when confirmed
- never best-guess

END.