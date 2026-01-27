#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re, shutil
from datetime import datetime
from collections import Counter, defaultdict

REPO_ROOT = "/root/dloran1.github.io"
BACKUP_DIR = os.path.join(REPO_ROOT, "backups", "cookie_fix_v2_" + datetime.now().strftime("%Y%m%d_%H%M%S"))
LOG_PATH   = os.path.join(REPO_ROOT, "reports", "cookie_fix_v2_log.txt")

HTML_EXT = (".html", ".htm")
SKIP_DIRS = {".git","node_modules","dist","build",".cache",".next",".nuxt","vendor","tmp","reports","backups"}

# Remove only risky inline script blocks (legacy consent libs / legacy wiring / legacy localStorage consent keys)
RX_INLINE_SCRIPT_BLOCK = re.compile(r"<script\b(?![^>]*\bsrc=)[^>]*>.*?</script\s*>", re.IGNORECASE | re.DOTALL)

RX_BAD_IN_SCRIPT = re.compile(
    r"(cookieconsent|cc-window|osano|"
    r"\bacceptConsent\s*\(|\brejectConsent\s*\(|"
    r"localStorage\.setItem\s*\(\s*['\"](?:vpnworld_consent|cookie_consent|cookieConsent|consent)['\"])",
    re.IGNORECASE
)

# Also remove any external script tags that load cookieconsent/osano libs (rare, but possible)
RX_BAD_EXTERNAL_LIB = re.compile(
    r"<script\b[^>]*\bsrc\s*=\s*['\"][^'\"]*(cookieconsent|osano)[^'\"]*['\"][^>]*>\s*</script\s*>",
    re.IGNORECASE
)

def is_skipped_dir(path: str) -> bool:
    parts = set(path.split(os.sep))
    return any(d in parts for d in SKIP_DIRS)

def relpath(p: str) -> str:
    return os.path.relpath(p, REPO_ROOT)

def read_text(path: str) -> str:
    raw = open(path, "rb").read()
    for enc in ("utf-8","utf-8-sig","latin-1"):
        try:
            return raw.decode(enc)
        except Exception:
            pass
    return raw.decode("utf-8", errors="replace")

def write_text(path: str, text: str):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)

def backup_file(src: str):
    dst = os.path.join(BACKUP_DIR, relpath(src))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

def strip_bad_inline_scripts(html: str):
    removed = 0

    def sub(m):
        nonlocal removed
        block = m.group(0)
        if RX_BAD_IN_SCRIPT.search(block):
            removed += 1
            return ""  # drop whole inline script block
        return block

    new_html = RX_INLINE_SCRIPT_BLOCK.sub(sub, html)
    return new_html, removed

def strip_bad_external_libs(html: str):
    removed = 0
    def sub(_m):
        nonlocal removed
        removed += 1
        return ""
    new_html = RX_BAD_EXTERNAL_LIB.sub(sub, html)
    return new_html, removed

def fix_file(path: str):
    original = read_text(path)
    stats = Counter()
    changed = False
    html = original

    html2, r_ext = strip_bad_external_libs(html)
    if r_ext:
        stats["removed_bad_external_cookie_lib_scripts"] += r_ext
        changed = True
    html = html2

    html2, r_inl = strip_bad_inline_scripts(html)
    if r_inl:
        stats["removed_bad_inline_script_blocks"] += r_inl
        changed = True
    html = html2

    if not changed:
        return False, stats, original, original

    return True, stats, original, html

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)

    totals = Counter()
    touched = defaultdict(list)
    scanned = 0
    changed_files = 0

    for root, dirs, files in os.walk(REPO_ROOT):
        if is_skipped_dir(root):
            continue
        for fn in files:
            if not fn.lower().endswith(HTML_EXT):
                continue
            scanned += 1
            full = os.path.join(root, fn)
            changed, stats, old, new = fix_file(full)
            if changed:
                backup_file(full)
                write_text(full, new)
                changed_files += 1
                totals.update(stats)
                for k, v in stats.items():
                    if v and len(touched[k]) < 50:
                        touched[k].append(relpath(full))

    lines = []
    lines.append("VPN WORLD — COOKIE FIX V2 LOG (INLINE SCRIPTS CLEANUP)")
    lines.append(f"Repo: {REPO_ROOT}")
    lines.append(f"Backup dir: {BACKUP_DIR}")
    lines.append("="*72)
    lines.append(f"HTML scanned: {scanned}")
    lines.append(f"Files changed: {changed_files}")
    lines.append("")
    lines.append("Totals:")
    for k, v in totals.most_common():
        lines.append(f"- {k}: {v}")
    lines.append("")
    lines.append("Files touched (samples):")
    for k in sorted(touched.keys()):
        lines.append(f"\n[{k}]")
        for p in touched[k]:
            lines.append(f"  - {p}")

    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("OK: v2 fix done.")
    print("Backups:", BACKUP_DIR)
    print("Log:", LOG_PATH)

if __name__ == "__main__":
    main()
