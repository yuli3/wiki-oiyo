#!/usr/bin/env python3
"""Verify translated tarot dictionary files against ko originals.

Usage: python3 scripts/verify-tarot-i18n.py <locale> [slug ...]
Checks every meaning-of-tarot-* present in the target locale (or the given
slugs): frontmatter sanity, pubDate parity, and section-structure parity.
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


def check(locale: str, slug: str) -> list[str]:
    errs = []
    ko_p = ROOT / "ko" / f"{slug}.mdx"
    tr_p = ROOT / locale / f"{slug}.mdx"
    if not tr_p.exists():
        return [f"{slug}: {locale} file missing"]
    ko, tr = ko_p.read_text(), tr_p.read_text()
    kfm, tfm = frontmatter(ko), frontmatter(tr)

    if tfm.get("locale") != locale:
        errs.append(f"{slug}: locale != {locale}")
    if tfm.get("track") != "dictionary":
        errs.append(f"{slug}: track != dictionary")
    if not tfm.get("series"):
        errs.append(f"{slug}: missing series")
    if tfm.get("pubDate") != kfm.get("pubDate"):
        errs.append(f"{slug}: pubDate mismatch ({tfm.get('pubDate')} vs {kfm.get('pubDate')})")
    title = tfm.get("title", "")
    if not (10 <= len(title) <= 160):
        errs.append(f"{slug}: title length {len(title)}")
    # description may be a >- block; just ensure the key exists
    if "description" not in tr.split("---\n")[1]:
        errs.append(f"{slug}: missing description")
    # Korean residue in translated body (allow none for en; ja shares no hangul)
    body = tr.split("---\n", 2)[2]
    if re.search(r"[가-힣]", body):
        errs.append(f"{slug}: hangul residue in body")
    # section parity
    k_h2, t_h2 = ko.count("\n## "), tr.count("\n## ")
    if k_h2 != t_h2:
        errs.append(f"{slug}: h2 count {t_h2} != ko {k_h2}")
    k_rows, t_rows = ko.count("\n| "), tr.count("\n| ")
    if k_rows != t_rows:
        errs.append(f"{slug}: table row count {t_rows} != ko {k_rows}")
    return errs


def main() -> None:
    locale = sys.argv[1]
    if len(sys.argv) > 2:
        slugs = sys.argv[2:]
    else:
        slugs = sorted(p.stem for p in (ROOT / locale).glob("meaning-of-tarot-*.mdx"))
    all_errs = []
    for s in slugs:
        all_errs += check(locale, s)
    if all_errs:
        print("\n".join(all_errs))
        sys.exit(1)
    print(f"OK — {len(slugs)} files verified for {locale}")


if __name__ == "__main__":
    main()
