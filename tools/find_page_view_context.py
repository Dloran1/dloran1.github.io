#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

REPO = "/root/dloran1.github.io"
TARGETS = [
    "blog/vpn-na-androida.html",
    "de/blog/vpn-android.html",
    "en-gb/blog/vpn-android-uk.html",
    "en-gb/blog/vpn-ios-uk.html",
    "en-gb/blog/vpn-netflix-uk.html",
    "en-us/blog/vpn-android.html",
    "fr/blog/vpn-ios.html",
    "nl-be/blog/vpn-android.html",
]

OUT = os.path.join(REPO, "reports", "page_view_context.txt")

def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)

    lines_out = []
    for rel in TARGETS:
        path = os.path.join(REPO, rel)
        lines_out.append("=" * 90)
        lines_out.append(rel)
        lines_out.append("-" * 90)

        if not os.path.exists(path):
            lines_out.append("MISSING FILE")
            continue

        with open(path, "r", encoding="utf-8", errors="replace") as f:
            lines = f.readlines()

        hits = []
        for i, line in enumerate(lines):
            if "page_view" in line:
                hits.append(i)

        if not hits:
            lines_out.append("NO page_view found in this file (string not present)")
            continue

        for idx in hits:
            start = max(0, idx - 6)
            end = min(len(lines), idx + 7)
            lines_out.append(f"\n--- Hit at line {idx+1} ---")
            for j in range(start, end):
                prefix = ">> " if j == idx else "   "
                # show line numbers
                lines_out.append(f"{prefix}{j+1:>5}: {lines[j].rstrip()}")

    with open(OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines_out) + "\n")

    print("OK:", OUT)

if __name__ == "__main__":
    main()
