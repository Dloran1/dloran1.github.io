#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re, shutil
from datetime import datetime
from collections import Counter, defaultdict

REPO_ROOT = "/root/dloran1.github.io"
BACKUP_DIR = os.path.join(REPO_ROOT, "backups", "cookie_fix_v3_" + datetime.now().strftime("%Y%m%d_%H%M%S"))
LOG_PATH   = os.path.join(REPO_ROOT, "reports", "cookie_fix_v3_log.txt")

HTML_EXT = (".html", ".htm")
SKIP_DIRS = {".git","node_modules","dist","build",".cache",".next",".nuxt","vendor","tmp","reports","backups"}

# Match inline scripts only (no src=)
RX_INLINE_SCRIPT = re.compile(r"<script\b(?![^>]*\bsrc=)[^>]*>.*?</script\s*>", re.IGNORECASE | re.DOTALL)

# Things we want to neutralize inside inline scripts:
RX_GTAG_PAGEVIEW_EVENT = re.compile(r"gtag\s*\(\s*['\"]event['\"]\s*,\s*['\"]page_view['\"]", re.IGNORECASE)
RX_SEND_PAGE_VIEW_TRUE = re.compile(r"send_page_view\s*:\s*true", re.IGNORECASE)
RX_PAGE_VIEW_WORD      = re.compile(r"\bpage_view\b", re.IGNORECASE)

RX_LOCALSTORAGE_SETITEM = re.compile(r"localStorage\.setItem\s*\(", re.IGNORECASE)

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

def sanitize_inline_script_block(block: str, stats: Counter):
    """
    Keep the inline script, but:
    - remove explicit page_view event calls
    - force send_page_view:false if true is present
    - remove localStorage.setItem(...) lines (consent keys must be handled in cookie-consent.js)
    """
    original = block
    # Extract inner JS content (best-effort)
    m = re.match(r"(?is)(<script\b[^>]*>)(.*?)(</script\s*>)", block)
    if not m:
        return block

    open_tag, js, close_tag = m.group(1), m.group(2), m.group(3)
    changed = False

    # 1) Remove lines that explicitly trigger gtag('event','page_view',...)
    if RX_GTAG_PAGEVIEW_EVENT.search(js):
        lines = js.splitlines(True)
        new_lines = []
        removed_lines = 0
        for ln in lines:
            if RX_GTAG_PAGEVIEW_EVENT.search(ln):
                removed_lines += 1
                continue
            new_lines.append(ln)
        if removed_lines:
            js = "".join(new_lines)
            stats["removed_inline_gtag_page_view_event_lines"] += removed_lines
            changed = True

    # 2) If send_page_view:true exists in config object, flip to false
    if RX_SEND_PAGE_VIEW_TRUE.search(js):
        js2 = RX_SEND_PAGE_VIEW_TRUE.sub("send_page_view: false", js)
        if js2 != js:
            js = js2
            stats["patched_send_page_view_true_to_false"] += 1
            changed = True

    # 3) Remove lines that set localStorage directly (consent must be canonical)
    if RX_LOCALSTORAGE_SETITEM.search(js):
        lines = js.splitlines(True)
        new_lines = []
        removed_lines = 0
        for ln in lines:
            if RX_LOCALSTORAGE_SETITEM.search(ln):
                removed_lines += 1
                continue
            new_lines.append(ln)
        if removed_lines:
            js = "".join(new_lines)
            stats["removed_inline_localStorage_setItem_lines"] += removed_lines
            changed = True

    if not changed:
        return original

    return open_tag + js + close_tag

def fix_file(path: str):
    original = read_text(path)
    stats = Counter()
    changed = False

    def sub(m):
        nonlocal changed
        block = m.group(0)
        # Only touch scripts that mention page_view OR localStorage.setItem OR send_page_view:true
        inner = block
        if (RX_PAGE_VIEW_WORD.search(inner) or RX_LOCALSTORAGE_SETITEM.search(inner) or RX_SEND_PAGE_VIEW_TRUE.search(inner)):
            new_block = sanitize_inline_script_block(block, stats)
            if new_block != block:
                changed = True
            return new_block
        return block

    new_html = RX_INLINE_SCRIPT.sub(sub, original)

    return changed, stats, original, new_html

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
    lines.append("VPN WORLD — COOKIE FIX V3 LOG (page_view + localStorage inline cleanup)")
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

    print("OK: v3 fix done.")
    print("Backups:", BACKUP_DIR)
    print("Log:", LOG_PATH)

if __name__ == "__main__":
    main()
