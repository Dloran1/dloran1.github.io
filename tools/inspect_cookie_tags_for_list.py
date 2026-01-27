#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, re

REPO = "/root/dloran1.github.io"
OUT  = os.path.join(REPO, "reports", "inspect_cookie_tags_for_list.txt")

FILES = [
  "blog/vpn-bbc-iplayer.html",
  "blog/vpn-dla-graczy.html",
  "blog/vpn-dla-studentow.html",
  "blog/vpn-do-bankowosci-online.html",
  "blog/vpn-edge.html",
  "blog/vpn-kill-switch.html",
  "blog/vpn-konfiguracja-iphone.html",
  "blog/vpn-konfiguracja-linux.html",
  "blog/vpn-konfiguracja-routera.html",
  "blog/vpn-na-androida.html",
  "blog/vpn-na-ios.html",
  "blog/vpn-na-konsolach-ps5-xbox.html",
  "blog/vpn-przekierowanie-portow.html",
  "de/about-denys-shchur.html",
  "de/blog/index.html",
  "de/blog/kostenlos-gegen-bezahlter-vpn.html",
]

# Same patterns as audit, plus strict page_view signals
P = {
  "legacy_div_cookie_banner": re.compile(r'id\s*=\s*["\']cookie-banner["\']', re.I),
  "legacy_div_cookie_layer":  re.compile(r'id\s*=\s*["\']cookie-consent-layer["\']', re.I),
  "legacy_cookieconsent_lib": re.compile(r'cookieconsent|cc-window|cc_banner|osano', re.I),

  "inline_acceptConsent_def": re.compile(r'function\s+acceptConsent\s*\(', re.I),
  "inline_rejectConsent_def": re.compile(r'function\s+rejectConsent\s*\(', re.I),

  "acceptConsent_call": re.compile(r'\bacceptConsent\s*\(', re.I),
  "rejectConsent_call": re.compile(r'\brejectConsent\s*\(', re.I),

  "cookie_consent_js_include": re.compile(r'<script[^>]+src\s*=\s*["\']([^"\']*cookie-consent\.js[^"\']*)["\']', re.I),

  "gtag_config": re.compile(r"gtag\s*\(\s*['\"]config['\"]\s*,", re.I),
  "consent_update_call": re.compile(r"gtag\s*\(\s*['\"]consent['\"]\s*,\s*['\"]update['\"]", re.I),
  "consent_default_call": re.compile(r"gtag\s*\(\s*['\"]consent['\"]\s*,\s*['\"]default['\"]", re.I),

  "ls_keys": re.compile(r"localStorage\.setItem\s*\(\s*['\"]([^'\"]+)['\"]", re.I),

  "gtag_page_view_event_call": re.compile(r"gtag\s*\(\s*['\"]event['\"]\s*,\s*['\"]page_view['\"]", re.I),
  "send_page_view_true": re.compile(r"send_page_view\s*:\s*true", re.I),
}

def read(path):
  raw = open(path, "rb").read()
  for enc in ("utf-8","utf-8-sig","latin-1"):
    try:
      return raw.decode(enc)
    except Exception:
      pass
  return raw.decode("utf-8", errors="replace")

def context_lines(text, rx, max_hits=3):
  lines = text.splitlines()
  hits = []
  for i, ln in enumerate(lines):
    if rx.search(ln):
      start = max(0, i-2)
      end = min(len(lines), i+3)
      block = "\n".join([f"{j+1:>5}: {lines[j]}" for j in range(start, end)])
      hits.append(block)
      if len(hits) >= max_hits:
        break
  return hits

def main():
  os.makedirs(os.path.dirname(OUT), exist_ok=True)
  out = []
  for rel in FILES:
    path = os.path.join(REPO, rel)
    out.append("="*100)
    out.append(rel)
    out.append("-"*100)
    if not os.path.exists(path):
      out.append("MISSING FILE")
      continue
    text = read(path)

    tags = []
    for tag, rx in P.items():
      if tag == "cookie_consent_js_include":
        m = rx.findall(text)
        if m:
          tags.append(f"{tag}: " + ", ".join(sorted(set(m))[:5]))
        continue
      if tag == "ls_keys":
        m = rx.findall(text)
        if m:
          tags.append(f"{tag}: " + ", ".join(sorted(set(m))[:10]))
        continue
      if rx.search(text):
        tags.append(tag)

    if not tags:
      out.append("NO TAGS FOUND (this file may be listed due to another section in audit)")
      continue

    out.append("TAGS:")
    for t in tags:
      out.append(f"- {t}")

    out.append("\nCONTEXT (first hits per tag):")
    for tag, rx in P.items():
      if tag.startswith("cookie_consent_js_include") or tag.startswith("ls_keys"):
        continue
      if rx.search(text):
        out.append(f"\n[{tag}]")
        for block in context_lines(text, rx, max_hits=2):
          out.append(block)

  with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
  print("OK:", OUT)

if __name__ == "__main__":
  main()
