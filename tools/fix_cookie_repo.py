#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re, shutil
from datetime import datetime
from collections import Counter, defaultdict

REPO_ROOT = "/root/dloran1.github.io"
BACKUP_DIR = os.path.join(REPO_ROOT, "backups", "cookie_fix_" + datetime.now().strftime("%Y%m%d_%H%M%S"))
LOG_PATH   = os.path.join(REPO_ROOT, "reports", "cookie_fix_log.txt")

HTML_EXT = (".html", ".htm")
SKIP_DIRS = {".git","node_modules","dist","build",".cache",".next",".nuxt","vendor","tmp","reports","backups"}

CANON_SRC = "/assets/js/cookie-consent.js"
CANON_TAG = f'<script src="{CANON_SRC}" defer></script>'

RX_COOKIE_SCRIPT = re.compile(
    r'<script\b[^>]*\bsrc\s*=\s*["\']([^"\']*cookie-consent\.js[^"\']*)["\'][^>]*>\s*</script\s*>',
    re.IGNORECASE
)

RX_GTAG_CONFIG_SIMPLE = re.compile(
    r"gtag\s*\(\s*['\"]config['\"]\s*,\s*['\"](G-[A-Z0-9]+)['\"]\s*\)\s*;?",
    re.IGNORECASE
)
RX_GTAG_CONFIG_OBJECT = re.compile(
    r"gtag\s*\(\s*['\"]config['\"]\s*,\s*['\"](G-[A-Z0-9]+)['\"]\s*,\s*\{(.*?)\}\s*\)\s*;?",
    re.IGNORECASE | re.DOTALL
)

RX_FUNC_ACCEPT = re.compile(r"function\s+acceptConsent\s*\(", re.IGNORECASE)
RX_FUNC_REJECT = re.compile(r"function\s+rejectConsent\s*\(", re.IGNORECASE)

RX_ID_COOKIE_BANNER = re.compile(r'id\s*=\s*["\']cookie-banner["\']', re.IGNORECASE)
RX_ID_COOKIE_LAYER  = re.compile(r'id\s*=\s*["\']cookie-consent-layer["\']', re.IGNORECASE)

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

def remove_div_block(lines, id_regex):
    out, i, removed = [], 0, 0
    while i < len(lines):
        line = lines[i]
        if id_regex.search(line):
            removed += 1
            depth = 0
            started = False
            while i < len(lines):
                chunk = lines[i].lower()
                opens  = chunk.count("<div")
                closes = chunk.count("</div")
                if opens:
                    depth += opens
                    started = True
                if closes:
                    depth -= closes
                i += 1
                if started and depth <= 0:
                    break
            continue
        out.append(line)
        i += 1
    return out, removed

def remove_js_function(text: str, func_regex: re.Pattern):
    removed = 0
    out = []
    idx = 0
    while True:
        m = func_regex.search(text, idx)
        if not m:
            out.append(text[idx:])
            break
        out.append(text[idx:m.start()])
        j = m.start()
        brace_open = text.find("{", j)
        if brace_open == -1:
            out.append(text[m.start():m.end()])
            idx = m.end()
            continue
        depth = 0
        k = brace_open
        while k < len(text):
            c = text[k]
            if c == "{": depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    k += 1
                    break
            k += 1
        while k < len(text) and text[k] in " \t\r\n":
            k += 1
        removed += 1
        idx = k
    return "".join(out), removed

def split_head(html: str):
    low = html.lower()
    hs = low.find("<head")
    if hs == -1: return None
    he = low.find(">", hs)
    if he == -1: return None
    head_open_end = he + 1
    hc = low.find("</head>", head_open_end)
    if hc == -1: return None
    prefix = html[:head_open_end]
    head   = html[head_open_end:hc]
    suffix = html[hc:]
    return prefix, head, suffix

def normalize_cookie_include(head: str):
    removed = 0
    def sub(_m):
        nonlocal removed
        removed += 1
        return ""
    new_head = RX_COOKIE_SCRIPT.sub(sub, head)
    if CANON_TAG.lower() not in new_head.lower():
        idx = new_head.lower().rfind("</head>")
        # head is inner head, so no </head> here. We'll insert at end of inner head.
        new_head = new_head.rstrip() + "\n  " + CANON_TAG + "\n"
    return new_head, removed

def patch_gtag_config(text: str):
    ps = 0
    po = 0

    def sub_simple(m):
        nonlocal ps
        mid = m.group(1)
        ps += 1
        return f"gtag('config', '{mid}', {{ 'send_page_view': false }});"

    text = RX_GTAG_CONFIG_SIMPLE.sub(sub_simple, text)

    def sub_obj(m):
        nonlocal po
        mid = m.group(1)
        obj = m.group(2)
        if re.search(r"send_page_view\s*:", obj, re.IGNORECASE):
            return m.group(0)
        po += 1
        obj_stripped = obj.strip()
        if obj_stripped:
            new_obj = f" 'send_page_view': false, {obj_stripped} "
        else:
            new_obj = " 'send_page_view': false "
        return f"gtag('config', '{mid}', {{{new_obj}}});"

    text = RX_GTAG_CONFIG_OBJECT.sub(sub_obj, text)
    return text, ps, po

def fix_file(path: str):
    original = read_text(path)
    stats = Counter()
    changed = False

    lines = original.splitlines(True)
    lines, r1 = remove_div_block(lines, RX_ID_COOKIE_BANNER)
    if r1: stats["removed_cookie_banner_div"] += r1; changed = True
    lines, r2 = remove_div_block(lines, RX_ID_COOKIE_LAYER)
    if r2: stats["removed_cookie_layer_div"] += r2; changed = True
    html = "".join(lines)

    html, ra = remove_js_function(html, RX_FUNC_ACCEPT)
    if ra: stats["removed_inline_acceptConsent"] += ra; changed = True
    html, rr = remove_js_function(html, RX_FUNC_REJECT)
    if rr: stats["removed_inline_rejectConsent"] += rr; changed = True

    parts = split_head(html)
    if parts:
        prefix, head, suffix = parts
        new_head, removed_tags = normalize_cookie_include(head)
        if removed_tags: stats["removed_cookie_script_tags"] += removed_tags; changed = True
        if new_head != head: stats["normalized_cookie_include"] += 1; changed = True
        html = prefix + new_head + suffix
    else:
        stats["no_head_found"] += 1

    html2, ps, po = patch_gtag_config(html)
    if ps or po:
        stats["patched_gtag_config_simple"] += ps
        stats["patched_gtag_config_object"] += po
        changed = True
    html = html2

    return changed, stats, original, html

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
                    if v and len(touched[k]) < 30:
                        touched[k].append(relpath(full))

    lines = []
    lines.append("VPN WORLD — COOKIE FIX LOG")
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
    lines.append("Samples (up to 30 per type):")
    for k in sorted(touched.keys()):
        lines.append(f"\n[{k}]")
        for p in touched[k]:
            lines.append(f"  - {p}")

    with open(LOG_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("OK: fix done.")
    print("Backups:", BACKUP_DIR)
    print("Log:", LOG_PATH)

if __name__ == "__main__":
    main()
