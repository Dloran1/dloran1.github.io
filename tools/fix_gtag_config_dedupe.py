#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re, shutil
from datetime import datetime
from collections import Counter, defaultdict

REPO_ROOT = "/root/dloran1.github.io"
BACKUP_DIR = os.path.join(REPO_ROOT, "backups", "gtag_dedupe_" + datetime.now().strftime("%Y%m%d_%H%M%S"))
LOG_PATH   = os.path.join(REPO_ROOT, "reports", "gtag_dedupe_log.txt")

HTML_EXT = (".html", ".htm")
SKIP_DIRS = {".git","node_modules","dist","build",".cache",".next",".nuxt","vendor","tmp","reports","backups"}

RX_GTAG_CONFIG_OBJ = re.compile(
    r"gtag\s*\(\s*['\"]config['\"]\s*,\s*['\"](G-[A-Z0-9]+)['\"]\s*,\s*\{(.*?)\}\s*\)\s*;?",
    re.IGNORECASE | re.DOTALL
)

RX_SEND_PV_PAIR = re.compile(r"['\"]send_page_view['\"]\s*:\s*(true|false)\s*,?", re.IGNORECASE)

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

def dedupe_send_page_view(obj_text: str):
    """
    If send_page_view appears multiple times, keep the FIRST occurrence,
    remove subsequent ones. Preserve other properties as-is.
    """
    matches = list(RX_SEND_PV_PAIR.finditer(obj_text))
    if len(matches) <= 1:
        return obj_text, 0

    # Keep first, remove others by slicing
    keep = matches[0]
    remove_spans = [m.span() for m in matches[1:]]

    out = []
    last = 0
    removed = 0
    for (a, b) in remove_spans:
        out.append(obj_text[last:a])
        # remove also any trailing spaces after removed pair
        last = b
        removed += 1
    out.append(obj_text[last:])

    new_obj = "".join(out)

    # Clean up double commas like ", ,"
    new_obj = re.sub(r",\s*,", ", ", new_obj)
    new_obj = re.sub(r"\{\s*,", "{ ", new_obj)
    new_obj = re.sub(r",\s*\}", " }", new_obj)

    return new_obj, removed

def fix_file(path: str):
    original = read_text(path)
    changed = False
    stats = Counter()

    def sub(m):
        nonlocal changed
        mid = m.group(1)
        obj = m.group(2)
        new_obj, removed = dedupe_send_page_view(obj)
        if removed:
            changed = True
            stats["deduped_send_page_view_entries"] += removed
            return f"gtag('config', '{mid}', {{{new_obj}}});"
        return m.group(0)

    new = RX_GTAG_CONFIG_OBJ.sub(sub, original)
    return changed, stats, original, new

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
    lines.append("VPN WORLD — GTAG CONFIG DEDUPE LOG (send_page_view)")
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

    print("OK: gtag dedupe done.")
    print("Backups:", BACKUP_DIR)
    print("Log:", LOG_PATH)

if __name__ == "__main__":
    main()
