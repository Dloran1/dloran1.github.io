#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
from collections import Counter, defaultdict

REPO_ROOT = "/root/dloran1.github.io"
REPORT_TXT = os.path.join(REPO_ROOT, "reports", "cookie_audit_summary.txt")
REPORT_JSON = os.path.join(REPO_ROOT, "reports", "cookie_audit_hits.json")

HTML_EXT = (".html", ".htm")

# IMPORTANT: exclude backups so audits do not scan snapshot copies
SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", ".cache", ".next", ".nuxt",
    "vendor", "tmp", "reports", "backups"
}

def is_skipped_dir(path: str) -> bool:
    parts = set(path.split(os.sep))
    return any(d in parts for d in SKIP_DIRS)

def relpath(p: str) -> str:
    return os.path.relpath(p, REPO_ROOT)

def read_file(path: str) -> str:
    with open(path, "rb") as f:
        raw = f.read()
    for enc in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return raw.decode(enc)
        except Exception:
            pass
    return raw.decode("utf-8", errors="replace")

# --- RED FLAGS patterns ---
PATTERNS = {
    # Duplicate banner sources (hard NO)
    "legacy_div_cookie_banner": re.compile(r'id\s*=\s*["\']cookie-banner["\']', re.IGNORECASE),
    "legacy_div_cookie_layer": re.compile(r'id\s*=\s*["\']cookie-consent-layer["\']', re.IGNORECASE),
    "legacy_cookieconsent_lib": re.compile(r'cookieconsent|cc-window|cc_banner|osano', re.IGNORECASE),

    # Inline consent functions (hard NO)
    "inline_acceptConsent_def": re.compile(r'function\s+acceptConsent\s*\(', re.IGNORECASE),
    "inline_rejectConsent_def": re.compile(r'function\s+rejectConsent\s*\(', re.IGNORECASE),

    # Calls to accept/reject (useful for detecting broken wiring)
    "acceptConsent_call": re.compile(r'\bacceptConsent\s*\(', re.IGNORECASE),
    "rejectConsent_call": re.compile(r'\brejectConsent\s*\(', re.IGNORECASE),

    # Canonical include presence + path normalization
    "cookie_consent_js_include": re.compile(
        r'<script[^>]+src\s*=\s*["\']([^"\']*cookie-consent\.js[^"\']*)["\']',
        re.IGNORECASE
    ),

    # Consent Mode signals (informative, can help QA)
    "consent_update_call": re.compile(r"gtag\s*\(\s*['\"]consent['\"]\s*,\s*['\"]update['\"]", re.IGNORECASE),
    "consent_default_call": re.compile(r"gtag\s*\(\s*['\"]consent['\"]\s*,\s*['\"]default['\"]", re.IGNORECASE),

    # localStorage keys (should be canonical only; inline storage is usually bad)
    "ls_keys": re.compile(r"localStorage\.setItem\s*\(\s*['\"]([^'\"]+)['\"]", re.IGNORECASE),
}

# STRICT page_view detection (NO comment false positives)
RX_GTAG_PAGE_VIEW_EVENT = re.compile(
    r"gtag\s*\(\s*['\"]event['\"]\s*,\s*['\"]page_view['\"]",
    re.IGNORECASE
)
RX_SEND_PAGE_VIEW_TRUE = re.compile(r"send_page_view\s*:\s*true", re.IGNORECASE)

# INFO-only helper: presence of gtag config (not an error)
RX_GTAG_CONFIG = re.compile(r"gtag\s*\(\s*['\"]config['\"]\s*,", re.IGNORECASE)

# Optional: word presence (info only, not an error)
RX_PAGE_VIEW_WORD = re.compile(r"\bpage_view\b", re.IGNORECASE)

def scan_html_files():
    hits = []
    counters = Counter()
    include_paths = Counter()
    ls_keys = Counter()
    files_by_tag = defaultdict(list)

    scanned = 0

    for root, dirs, files in os.walk(REPO_ROOT):
        if is_skipped_dir(root):
            continue

        for fn in files:
            if not fn.lower().endswith(HTML_EXT):
                continue

            full = os.path.join(root, fn)
            scanned += 1
            text = read_file(full)

            file_hit = {
                "file": relpath(full),
                "tags": [],
                "cookie_consent_js_srcs": [],
                "localStorage_keys": [],
                "notes": [],
                "info": [],
            }

            # RED FLAGS tags
            for tag, rx in PATTERNS.items():
                if tag == "cookie_consent_js_include":
                    m_all = rx.findall(text)
                    if m_all:
                        file_hit["tags"].append(tag)
                        for src in m_all:
                            file_hit["cookie_consent_js_srcs"].append(src)
                            include_paths[src] += 1
                    continue

                if tag == "ls_keys":
                    k_all = rx.findall(text)
                    if k_all:
                        file_hit["tags"].append(tag)
                        for k in k_all:
                            file_hit["localStorage_keys"].append(k)
                            ls_keys[k] += 1
                    continue

                if rx.search(text):
                    file_hit["tags"].append(tag)

            # STRICT page_view red flags
            if RX_GTAG_PAGE_VIEW_EVENT.search(text):
                file_hit["tags"].append("gtag_page_view_event_call")
            if RX_SEND_PAGE_VIEW_TRUE.search(text):
                file_hit["tags"].append("send_page_view_true")

            # INFO: page_view word present but no strict signal (likely comments)
            if RX_PAGE_VIEW_WORD.search(text) and ("gtag_page_view_event_call" not in file_hit["tags"]) and ("send_page_view_true" not in file_hit["tags"]):
                file_hit["info"].append("page_view_word_present_but_no_real_page_view_signal (likely comment)")

            # INFO: presence of gtag config (not an error)
            if RX_GTAG_CONFIG.search(text):
                file_hit["info"].append("gtag_config_present (OK if send_page_view:false)")

            # Derived notes
            legacy_div = ("legacy_div_cookie_banner" in file_hit["tags"]) or ("legacy_div_cookie_layer" in file_hit["tags"])
            include = ("cookie_consent_js_include" in file_hit["tags"])
            inline_defs = ("inline_acceptConsent_def" in file_hit["tags"]) or ("inline_rejectConsent_def" in file_hit["tags"])
            calls = ("acceptConsent_call" in file_hit["tags"]) or ("rejectConsent_call" in file_hit["tags"])

            if legacy_div and include:
                file_hit["notes"].append("LIKELY_DUPLICATE_BANNER: legacy DIV present + cookie-consent.js included")
            if inline_defs and include:
                file_hit["notes"].append("HARD_NO: inline accept/reject function definitions + cookie-consent.js included")
            if legacy_div and not include:
                file_hit["notes"].append("LEGACY_ONLY: cookie banner DIV present, but cookie-consent.js NOT included")
            if calls and not include and not inline_defs:
                file_hit["notes"].append("BROKEN_WIRING: accept/reject called but no include and no inline defs")
            if ("ls_keys" in file_hit["tags"]) and (not include):
                file_hit["notes"].append("INLINE_STORAGE_WITHOUT_CANON_JS: localStorage.setItem present but cookie-consent.js not included")

            # Keep only if there is something to report (tags/notes/info)
            if file_hit["tags"] or file_hit["notes"] or file_hit["info"]:
                hits.append(file_hit)
                for t in set(file_hit["tags"]):
                    counters[t] += 1
                    files_by_tag[t].append(file_hit["file"])

    return scanned, hits, counters, include_paths, ls_keys, files_by_tag

def top_items(counter, n=20):
    return counter.most_common(n)

def write_reports(scanned, hits, counters, include_paths, ls_keys, files_by_tag):
    os.makedirs(os.path.dirname(REPORT_TXT), exist_ok=True)

    top_files_by_tag = {tag: sorted(files)[:20] for tag, files in files_by_tag.items()}

    payload = {
        "repo_root": REPO_ROOT,
        "scanned_html_files": scanned,
        "summary_counts": dict(counters),
        "top_cookie_consent_js_srcs": top_items(include_paths, 20),
        "top_localStorage_keys": top_items(ls_keys, 30),
        "top_files_by_tag": top_files_by_tag,
        "hits": hits,
    }

    with open(REPORT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    lines = []
    lines.append("VPN WORLD — COOKIE / CONSENT AUDIT REPORT (RED FLAGS ONLY)")
    lines.append(f"Repo: {REPO_ROOT}")
    lines.append("=" * 72)
    lines.append("")
    lines.append(f"HTML scanned (excluding SKIP_DIRS): {scanned}")
    lines.append("")
    lines.append("A) COUNTS (red flags only)")
    for k, v in counters.most_common():
        lines.append(f"- {k}: {v}")

    lines.append("")
    lines.append("B) cookie-consent.js include paths (TOP 20)")
    for src, cnt in top_items(include_paths, 20):
        lines.append(f"- {cnt:>4} × {src}")

    lines.append("")
    lines.append("C) localStorage keys used (TOP 30)")
    for k, cnt in top_items(ls_keys, 30):
        lines.append(f"- {cnt:>4} × {k}")

    lines.append("")
    lines.append("D) TOP OFFENDERS (first 20 files) per red-flag category")
    for tag in sorted(top_files_by_tag.keys()):
        lines.append("")
        lines.append(f"[{tag}]")
        for p in top_files_by_tag[tag]:
            lines.append(f"  - {p}")

    lines.append("")
    lines.append("=" * 72)
    lines.append("E) NOTES")
    lines.append("- Real page_view before consent is flagged ONLY if:")
    lines.append("  * gtag('event','page_view', ...) is present, OR")
    lines.append("  * send_page_view: true is present.")
    lines.append("- The word 'page_view' in comments is NOT treated as an error.")
    lines.append("- gtag('config', ...) presence is INFO-only (not a red flag).")
    lines.append("- If legacy DIV + include => duplicate banners are being created from two sources.")
    lines.append("- Inline accept/reject definitions are HARD NO in Stage 2.5 (must be only in canonical JS).")
    lines.append("")

    with open(REPORT_TXT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def main():
    scanned, hits, counters, include_paths, ls_keys, files_by_tag = scan_html_files()
    write_reports(scanned, hits, counters, include_paths, ls_keys, files_by_tag)
    print("OK: audit complete.")
    print(f"- Text report: {REPORT_TXT}")
    print(f"- JSON report: {REPORT_JSON}")

if __name__ == "__main__":
    main()
