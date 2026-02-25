# VPN World — Localization + Interlinking Standard (Stage 2.5)
**File:** `_standards/VPNW_LOCALIZATION_STANDARD.md`  
**Purpose:** Compact “constitution” for Claude/agents: how to write native-localized articles for 7 locales **and** interlink safely **without inventing paths**.

---

## 0) Absolute rules (non‑negotiable)
1) **NO invented paths/URLs/slugs.** If a path isn’t confirmed in the repo ZIP, **stop and scan the project** (search file tree / grep / open the exact HTML).  
2) **Never touch hreflang block or the visible language switcher.** Byte‑identical unless the user explicitly says otherwise.  
3) **One language per file.** No mixed EN/DE/PL phrases.  
4) **No “AI voice.”** Never write “as an AI”, “generated”, “this model”, etc.  
5) **Native, not translation.** You may reuse structure, but every locale must read like a local expert wrote it.  
6) **Authorship default:** “Denys Shchur / VPN World” unless the task says SmartAdvisorOnline branding.

---

## 1) Localization philosophy (how to sound native)
### 1.1 Human + expert tone (required)
- Write like a real person who tested things (“In real testing…”, “In practice…”, “What usually breaks is…”).
- 2–3 human micro‑phrases per article (not cringe, not memes).
- Keep claims grounded: “often”, “commonly”, “in our tests”, “can”, “may”.

### 1.2 What must change per locale
Every locale must swap:
- **ISP/Operators** examples (real local brands)
- **Streaming apps** (popular in that country)
- **Legal references** (correct regulator / framework)
- **Typical user problems** (local services, routers, consoles)
- **Spelling + terms** (UK vs US; FR/DE formal register; NL‑BE vocabulary)

### 1.3 What must NOT change
- Technical truth (VPN mechanics, DNS/IPv6/WebRTC concepts)
- Stage 2.5 page structure (H1 + snippets, tables/SVG, CTA blocks, video block, FAQ, related)
- Consent + analytics behavior (default denied; page_view only after Accept)
- Affiliate CTA button wrapper structure and classes

---

## 2) Locale cheat‑sheets (use as seeds, not as a hard limit)
> Use 2–4 items from each list per article, matching the topic.

### PL (Poland)
**ISPs:** Orange Polska, Play, Plus, T‑Mobile PL, Netia, UPC/Play (legacy).  
**Streaming:** Player.pl, Polsat Box Go, Canal+ online, TVP VOD.  
**Regulator/law:** UODO (RODO/GDPR).  
**Local pain points:** banking alerts on new IPs; throttling in peak hours; ISP router boxes.

### EN‑GB (UK)
**ISPs:** BT, Virgin Media, Sky Broadband, TalkTalk, EE Broadband.  
**Streaming:** BBC iPlayer, ITVX, Channel 4, Sky Go, NOW.  
**Regulator/law:** UK GDPR, ICO.  
**Local pain points:** iPlayer region errors, Sky Go blocks, strict public Wi‑Fi.

### EN‑US (USA)
**ISPs:** Comcast Xfinity, Spectrum, Verizon Fios, AT&T Fiber, T‑Mobile Home Internet.  
**Streaming:** Hulu, Peacock, Paramount+, Max, ESPN+.  
**Law framing:** state privacy laws (e.g., CCPA/CPRA) + FTC (careful, no legal advice).  
**Local pain points:** “home location” issues, campus networks, hotel captive portals.

### DE (Germany)
**ISPs:** Deutsche Telekom, Vodafone DE, O2 (Telefónica), 1&1.  
**Streaming:** Joyn, ZDF Mediathek, ARD Mediathek, RTL+.  
**Regulator/law:** BfDI, DSGVO.  
**Local pain points:** strict privacy expectations, Fritz!Box references.

### FR (France)
**ISPs:** Orange, Free, Bouygues Telecom, SFR.  
**Streaming:** myCanal, Molotov, France.tv, Prime Video FR.  
**Regulator/law:** CNIL, RGPD.  
**Local pain points:** metro/public Wi‑Fi, “box” routers, cookie sensitivity.

### ES (Spain)
**ISPs:** Movistar, Orange España, Vodafone ES, MásMóvil/Yoigo.  
**Streaming:** RTVE Play, Atresplayer, Movistar Plus+, Mitele.  
**Regulator/law:** AEPD, RGPD.  
**Local pain points:** streaming abroad, football restrictions, shared family networks.

### NL‑BE (Belgium Dutch)
**ISPs:** Proximus, Telenet, Orange Belgium.  
**Streaming:** VRT MAX, VTM GO, Streamz.  
**Regulator/law:** GBA/APD + GDPR.  
**Local pain points:** multilingual services, EU roaming realities, cookie expectations.

---

## 3) Interlinking standard (safe, non‑spam, repo‑true)
### 3.1 Hard constraints
- **Never invent internal links.** All internal links must be confirmed as existing files in the same locale folder structure.
- **Max contextual internal links in main body:** 15 (VPN World rule).  
- **Related block:** use repo‑existing related links; if using a matrix/script, treat it as law.

### 3.2 What to link, and where
**Goal:** topical authority + user help, not “SEO spam”.

**A) Context links (inside text) — 6 to 10 total**
Pick based on topic:
1) 1–2 **fundamentals** (what is VPN, DNS leaks, kill switch)
2) 2–4 **how‑to / troubleshooting** (setup guides, streaming fixes, device guides)
3) 1–2 **comparison** (VPN vs Proxy/Tor, protocols)
4) 1–2 **security** (public Wi‑Fi checklist, leak tests)

**Placement guidance:**
- 1 link early (first 20–30% of article)
- 2–4 links mid‑article, inside relevant sections
- 1–2 links near the end in “Next steps” / “If this still fails”

**B) Related block (footer) — 4 to 7 items**
- Only confirmed slugs for that locale.
- Prefer “adjacent intent” (same goal, next action).
- If there’s a related matrix, follow it exactly.

### 3.3 Anchor text rules (anti‑AI / natural)
- Avoid robotic “click here”.
- Use descriptive anchors that match the sentence intent.
- Mix exact + partial + natural anchors:
  - “DNS leak test”
  - “how a kill switch prevents leaks”
  - “VPN on a smart TV”

### 3.4 Cross‑site linking (VPN World ↔ SmartAdvisorOnline)
Only when the task explicitly says so. If allowed:
- Link to SmartAdvisorOnline Knowledge Base/tools when it genuinely helps (how‑we‑test, leak test tool, status hub).
- Never overdo: 0–2 cross‑site links max per article.
- Always verify the exact target URL exists.

---

## 4) Quick “native localization” checklist (per article)
- [ ] Correct locale language only  
- [ ] 2–4 local ISPs/services mentioned naturally  
- [ ] 1–3 local streaming apps (if relevant)  
- [ ] Regulator/law mention fits locale (GDPR/UK GDPR/CNIL/etc.)  
- [ ] No invented paths; internal links exist in this locale folder  
- [ ] Hreflang + language switcher unchanged  
- [ ] Human + expert tone (2–3 human phrases, no AI voice)  

---

## 5) If uncertain: scan routine (mandatory)
If unsure about **any** of these: slugs, internal links, policy pages, asset paths:
1) Search file tree for the slug/keyword  
2) Open the target HTML in the repo  
3) Confirm the exact relative path for the current locale  
4) Only then insert the link/path  
Never “best guess”.

---

## 6) Minimal locale spelling reminders
- **EN‑GB:** favourite, programme, licence (noun), optimise  
- **EN‑US:** favorite, program, license, optimize  
- **DE/FR/ES/NL‑BE:** consistent formal register; avoid random English filler

---

## 7) Output expectation (agent)
- Produce a complete final HTML file (not fragments) when asked.
- Provide a short “WHAT CHANGED” list.
- Provide the final page URL at the end (absolute).
