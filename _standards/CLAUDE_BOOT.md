# CLAUDE BOOT SEQUENCE — VPN WORLD

This file is the FIRST file Claude Code MUST read at session start.

This file defines memory loading, standards loading, and scanning limits.

---

# STEP 1 — LOAD CORE STANDARDS

Claude MUST immediately load and read:

/_standards/VPNW_STAGE25_STANDARD.md  
/_standards/VPNW_LOCALIZATION_STANDARD.md  

These define:

• writing structure  
• authorship identity  
• linking rules  
• widget placement  
• localization behavior  

These files are the constitution.

Claude MUST obey them 100%.

---

# STEP 2 — LOAD SLUG INDEX (CRITICAL)

Claude MUST load:

/_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json

This file is the ONLY source of truth for:

• slugs  
• URLs  
• locale mapping  

Claude MUST NEVER:

scan entire repository  
search random folders  
guess paths  

ONLY use SLUG_INDEX.

---

# STEP 3 — LANGUAGE SWITCHER RULE

Language switcher already exists in pages.

Claude MUST NEVER:

search for switcher  
generate switcher  
modify switcher  

Claude MUST leave switcher untouched.

---

# STEP 4 — TARGET FILE SCANNING RULE

Claude MAY scan ONLY:

target file being edited  

and  

/_standards/*.md  
/_standards/SLUG_INDEX_FROM_HREFLANG_FLAT.json  

Claude MUST NEVER scan full repo.

This prevents token waste.

---

# STEP 5 — AUTHORSHIP IDENTITY

Claude writes ONLY as:

Denys Shchur  
VPN World  

or

SmartAdvisorOnline (ONLY if explicitly requested)

Claude MUST NEVER mention AI.

---

# STEP 6 — WRITING MODE

Claude operates in:

Production Mode

NOT analysis mode.

Claude produces production-ready code.

---

# STEP 7 — MEMORY REFRESH RULE

If Claude is unsure about:

structure  
links  
slugs  

Claude MUST reload:

VPNW_STAGE25_STANDARD.md  
VPNW_LOCALIZATION_STANDARD.md  
SLUG_INDEX_FROM_HREFLANG_FLAT.json  

Claude MUST NOT scan full repo.

---

# STEP 8 — PROJECT STRUCTURE AWARENESS

Project structure:

Root locale:
/blog/

Other locales:
/en-gb/blog/
/en-us/blog/
/de/blog/
/fr/blog/
/es/blog/
/nl-be/blog/

Assets:
/assets/

Standards:
/_standards/

---

# STEP 9 — EXECUTION PRIORITY ORDER

Claude MUST follow this order:

1. Read CLAUDE_BOOT.md
2. Load VPNW_STAGE25_STANDARD.md
3. Load VPNW_LOCALIZATION_STANDARD.md
4. Load SLUG_INDEX_FROM_HREFLANG_FLAT.json
5. Scan target file
6. Execute task

---

# STEP 10 — ABSOLUTE PROHIBITIONS

Claude MUST NEVER:

scan full repo  
guess slugs  
guess hreflang  
guess paths  
modify language switcher  

ONLY use confirmed data.

---

END OF BOOT SEQUENCE