#!/usr/bin/env python3
"""Verify translated dictionary (meaning-of-*) files against ko originals.

Usage: python3 scripts/verify-dict-i18n.py <locale> <slug> [slug ...]
Hard failures: missing file, locale/track/pubDate mismatch, title length,
missing description, h2/table-row parity. Hangul residue is a WARNING only
(Korean-culture topics like musok/hwarang legitimately keep hangul terms).
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src/content/blog"


def frontmatter(text: str) -> dict:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}
    fm: dict = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^(\w[\w-]*):\s*(.*)$", line)
        if kv:
            fm[kv.group(1)] = kv.group(2).strip().strip('"').strip("'")
    return fm


def check(locale: str, slug: str) -> tuple[list[str], list[str]]:
    errs: list[str] = []
    warns: list[str] = []
    ko_p = ROOT / "ko" / f"{slug}.mdx"
    tr_p = ROOT / locale / f"{slug}.mdx"
    if not tr_p.exists():
        return [f"{slug}: {locale} file missing"], []
    ko, tr = ko_p.read_text(), tr_p.read_text()
    kfm, tfm = frontmatter(ko), frontmatter(tr)

    if tfm.get("locale") != locale:
        errs.append(f"{slug}: locale != {locale}")
    if kfm.get("track") and tfm.get("track") != kfm.get("track"):
        errs.append(f"{slug}: track mismatch ({tfm.get('track')} vs ko {kfm.get('track')})")
    if tfm.get("pubDate") != kfm.get("pubDate"):
        errs.append(f"{slug}: pubDate mismatch")
    title = tfm.get("title", "")
    if not (10 <= len(title) <= 160):
        errs.append(f"{slug}: title length {len(title)}")
    if "description" not in tr.split("---\n")[1]:
        errs.append(f"{slug}: missing description")
    body = tr.split("---\n", 2)[2]
    hangul = len(re.findall(r"[가-힣]+", body))
    if hangul:
        warns.append(f"{slug}: {hangul} hangul tokens in body (check if intentional)")
    k_h2, t_h2 = ko.count("\n## "), tr.count("\n## ")
    if k_h2 != t_h2:
        errs.append(f"{slug}: h2 count {t_h2} != ko {k_h2}")
    k_rows, t_rows = ko.count("\n| "), tr.count("\n| ")
    if k_rows != t_rows:
        errs.append(f"{slug}: table rows {t_rows} != ko {k_rows}")
    return errs, warns


def main() -> None:
    locale = sys.argv[1]
    slugs = sys.argv[2:]
    all_errs: list[str] = []
    all_warns: list[str] = []
    for s in slugs:
        e, w = check(locale, s)
        all_errs += e
        all_warns += w
    for w in all_warns:
        print(f"WARN  {w}")
    if all_errs:
        print("\n".join(f"FAIL  {e}" for e in all_errs))
        sys.exit(1)
    print(f"OK — {len(slugs)} files verified for {locale} ({len(all_warns)} warnings)")


if __name__ == "__main__":
    main()
