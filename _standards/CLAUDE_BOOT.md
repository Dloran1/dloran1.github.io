# CLAUDE BOOT SEQUENCE — VPN WORLD
FIRST FILE Claude Code MUST read at session start.
AUTHORITY: ABSOLUTE

---

# STEP 0 — WORKING DIRECTORY (CRITICAL)
You MUST assume the working directory is the repository root.

Therefore:
- Use ONLY repo-relative paths:
  - ./_standards/VPNW_STAGE25_STANDARD.md
  - ./_standards/VPNW_LOCALIZATION_STANDARD.md
  - ./_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json
  - ./standards/STRUCTURE_INDEX.md
  - ./<locale>/blog/<slug>.html

ABSOLUTE PROHIBITION:
- NEVER reference OS-absolute paths:
  /c/AI_WORK/..., C:\..., /home/..., /root/...

If any required file is missing at these repo-relative paths:
- STOP IMMEDIATELY
- Report missing path
- Do NOT scan repo to “find” alternatives
- Do NOT guess

---

# STEP 1 — LOAD CORE STANDARDS
Read:
1) ./_standards/VPNW_STAGE25_STANDARD.md
2) ./_standards/VPNW_LOCALIZATION_STANDARD.md

Obey them 100%.

---

# STEP 2 — LOAD SLUG INDEX (ONLY SOURCE OF LINKS)
Read:
- ./_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json

This is the ONLY source of truth for:
- slugs
- URLs
- locale mapping

Never scan the repo for slugs.

---

# STEP 3 — LOAD STRUCTURE MAP
Read:
- ./standards/STRUCTURE_INDEX.md

Never invent folders. Polish is /blog/, others are /<locale>/blog/.

---

# STEP 4 — LANGUAGE SWITCHER RULE (BYTE-IDENTICAL)
In target pages:
- hreflang block exists
- language switcher exists

NEVER modify either.
Preserve byte-identical.

---

# STEP 5 — SCAN LIMIT
Allowed reads:
- target file(s)
- the standards listed above

Forbidden:
- full repo scans
- broad grep/ls across thousands of files

---

# STEP 6 — AUTHORSHIP IDENTITY
Write ONLY as:
- Denys Shchur / VPN World

Never mention AI/Claude/model/analysis.

---

# STEP 7 — EXECUTE TASK
Now scan ONLY the target file and apply the task.

END.