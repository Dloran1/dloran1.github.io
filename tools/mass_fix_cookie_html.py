#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re, shutil
from datetime import datetime
from collections import Counter, defaultdict

REPO = "/root/dloran1.github.io"
BACKUP = os.path.join(REPO, "backups", "cookie_massfix_" + datetime.now().strftime("%Y%m%d_%H%M%S"))
LOGTXT = os.path.join(REPO, "reports", "cookie_massfix_log.txt")

HTML_EXT = (".html", ".htm")
SKIP_DIRS = {".git","node_modules","dist","build",".cache",".next",".nuxt","vendor","tmp","reports","backups"}

CANON_INCLUDE = '<script src="/assets/js/cookie-consent.js" defer></script>'

RX_INCLUDE_ANY = re.compile(r'<script[^>]+src\s*=\s*["\'][^"\']*cookie-consent\.js[^"\']*["\'][^>]*>\s*</script>\s*', re.I)
RX_LEGACY_LIBS = re.compile(r'<script[^>]+src\s*=\s*["\'][^"\']*(cookieconsent|osano|cc-window)[^"\']*["\'][^>]*>\s*</script>\s*', re.I)

# legacy HTML blocks
RX_DIV_COOKIE_BANNER = re.compile(r'<div[^>]*\bid\s*=\s*["\']cookie-banner["\'][\s\S]*?</div>\s*', re.I)
RX_DIV_COOKIE_LAYER  = re.compile(r'<div[^>]*\bid\s*=\s*["\']cookie-consent-layer["\'][\s\S]*?</div>\s*', re.I)

# inline function defs (hard NO)
RX_INLINE_ACCEPT_DEF = re.compile(r'function\s+acceptConsent\s*\([\s\S]*?\}\s*', re.I)
RX_INLINE_REJECT_DEF = re.compile(r'function\s+rejectConsent\s*\([\s\S]*?\}\s*', re.I)

# kill inline <script> blocks that contain acceptConsent/rejectConsent or cookieconsent keywords
RX_SCRIPT_BLOCK = re.compile(r'<script\b[^>]*>[\s\S]*?</script>\s*', re.I)
RX_SCRIPT_KEYWORDS = re.compile(r'(acceptConsent\s*\(|rejectConsent\s*\(|cookieconsent|cc-window|osano)', re.I)

def is_skipped_dir(path: str) -> bool:
    parts = set(path.split(os.sep))
    return any(d in parts for d in SKIP_DIRS)

def rel(p: str) -> str:
    return os.path.relpath(p, REPO)

def read(path: str) -> str:
    raw = open(path, "rb").read()
    for enc in ("utf-8","utf-8-sig","latin-1"):
        try:
            return raw.decode(enc)
        except Exception:
            pass
    return raw.decode("utf-8", errors="replace")

def write(path: str, text: str):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

def backup_file(src: str):
    dst = os.path.join(BACKUP, rel(src))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

def ensure_head_include(html: str):
    # Remove all existing cookie-consent.js includes (any path) to prevent duplicates
    html2, n_rm = RX_INCLUDE_ANY.subn("", html)

    # Remove legacy libs includes
    html3, n_rm_lib = RX_LEGACY_LIBS.subn("", html2)

    # Ensure canonical include exists once in <head> (prefer before </head>)
    if CANON_INCLUDE.lower() in html3.lower():
        return html3, n_rm, n_rm_lib, 0

    m = re.search(r'</head\s*>', html3, re.I)
    if not m:
        # no head? append at top
        return CANON_INCLUDE + "\n" + html3, n_rm, n_rm_lib, 1

    insert_at = m.start()
    html4 = html3[:insert_at] + "  " + CANON_INCLUDE + "\n" + html3[insert_at:]
    return html4, n_rm, n_rm_lib, 1

def remove_legacy_blocks(html: str):
    out = html
    c = Counter()

    out, n = RX_DIV_COOKIE_LAYER.subn("", out)
    c["removed_legacy_div_cookie_layer"] += n

    out, n = RX_DIV_COOKIE_BANNER.subn("", out)
    c["removed_legacy_div_cookie_banner"] += n

    # Remove inline <script> blocks that contain legacy consent keywords
    def _strip_script(m):
        block = m.group(0)
        if RX_SCRIPT_KEYWORDS.search(block):
            c["removed_inline_script_block_with_consent"] += 1
            return ""
        return block

    out = RX_SCRIPT_BLOCK.sub(_strip_script, out)

    # Remove inline function definitions if left somewhere outside script blocks (rare)
    out, n = RX_INLINE_ACCEPT_DEF.subn("", out)
    c["removed_inline_accept_def"] += n

    out, n = RX_INLINE_REJECT_DEF.subn("", out)
    c["removed_inline_reject_def"] += n

    return out, c

def main():
    os.makedirs(BACKUP, exist_ok=True)
    os.makedirs(os.path.dirname(LOGTXT), exist_ok=True)

    totals = Counter()
    touched = defaultdict(list)
    scanned = 0
    changed = 0

    for root, dirs, files in os.walk(REPO):
        if is_skipped_dir(root):
            continue
        for fn in files:
            if not fn.lower().endswith(HTML_EXT):
                continue
            scanned += 1
            path = os.path.join(root, fn)
            old = read(path)
            new = old

            # 1) remove legacy blocks + inline scripts/defs
            new, c1 = remove_legacy_blocks(new)

            # 2) normalize include
            new, rm_includes, rm_libs, added = ensure_head_include(new)
            if rm_includes: totals["removed_cookie_consent_includes"] += rm_includes
            if rm_libs: totals["removed_legacy_cookie_lib_includes"] += rm_libs
            if added: totals["added_canonical_cookie_consent_include"] += added

            totals.update(c1)

            if new != old:
                backup_file(path)
                write(path, new)
                changed += 1

                # store samples
                for k, v in c1.items():
                    if v and len(touched[k]) < 30:
                        touched[k].append(rel(path))
                if added and len(touched["added_canonical_cookie_consent_include"]) < 30:
                    touched["added_canonical_cookie_consent_include"].append(rel(path))

    lines = []
    lines.append("VPN WORLD — COOKIE MASS FIX LOG")
    lines.append(f"Repo: {REPO}")
    lines.append(f"Backup: {BACKUP}")
    lines.append("="*72)
    lines.append(f"HTML scanned: {scanned}")
    lines.append(f"Files changed: {changed}")
    lines.append("")
    lines.append("Totals:")
    for k, v in totals.most_common():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("Samples (up to 30 each):")
    for k in sorted(touched.keys()):
        lines.append(f"\n[{k}]")
        for p in touched[k]:
            lines.append(f"  - {p}")
    lines.append("")

    with open(LOGTXT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("OK: mass fix done")
    print("Backup:", BACKUP)
    print("Log:", LOGTXT)

if __name__ == "__main__":
    main()
