"""Generate public/sitemap.xml for Aaru Wealth (Search Console)."""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://aaruwealth.com"
TODAY = date.today().isoformat()


def unique(seq: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


def main() -> None:
    topics_txt = (ROOT / "src/lib/content/topics.ts").read_text(encoding="utf-8")
    hub_slugs = re.findall(
        r'\{\s*slug:\s*"([a-z0-9-]+)"\s*,\s*title:',
        topics_txt,
    )

    guides_txt = (ROOT / "src/lib/content/guides.ts").read_text(encoding="utf-8")
    # Guide entries look like: slug: "how-sip-works",
    guide_slugs = unique(
        re.findall(r'^\s*slug:\s*"([a-z0-9-]+)",\s*$', guides_txt, flags=re.M)
    )

    scen_txt = (ROOT / "src/lib/content/scenarios.ts").read_text(encoding="utf-8")
    sc_pairs: list[tuple[str, str]] = []
    for block in re.split(r"\n  \{", scen_txt):
        if "kind:" not in block:
            continue
        hub = re.search(r'hub:\s*"([a-z0-9-]+)"', block)
        slug = re.search(r'slug:\s*"([a-z0-9-]+)"', block)
        if hub and slug:
            sc_pairs.append((hub.group(1), slug.group(1)))

    calc_txt = (ROOT / "src/lib/calculators.ts").read_text(encoding="utf-8")
    cats: dict[str, list[str]] = {}
    order: list[str] = []
    for m in re.finditer(
        r'id:\s*"(investment|debt|retirement|taxation|government)"'
        r'[\s\S]*?calculators:\s*\[([\s\S]*?)\]\s*,?\s*\n  \}',
        calc_txt,
    ):
        cid = m.group(1)
        slugs = re.findall(r'slug:\s*"([a-z0-9-]+)"', m.group(2))
        cats[cid] = slugs
        order.append(cid)

    static = [
        "/",
        "/about",
        "/methodology",
        "/editorial-policy",
        "/disclaimer",
        "/privacy",
        "/terms",
        "/contact",
        "/calculators",
        "/guides",
        "/glossary",
        "/topics",
    ]

    gloss_txt = (ROOT / "src/lib/content/glossary.ts").read_text(encoding="utf-8")
    glossary_slugs = unique(
        re.findall(r'^\s*slug:\s*"([a-z0-9-]+)",\s*$', gloss_txt, flags=re.M)
    )

    cat_txt = (ROOT / "src/lib/content/guide-categories.ts").read_text(
        encoding="utf-8"
    )
    guide_cat_slugs = unique(
        re.findall(
            r'^\s*slug:\s*"(investing|loans|tax|retirement|government-schemes|fixed-income|insurance|stocks|wealth-planning)",\s*$',
            cat_txt,
            flags=re.M,
        )
    )
    if not guide_cat_slugs:
        guide_cat_slugs = unique(
            re.findall(r'slug:\s*"([a-z0-9-]+)"', cat_txt)
        )

    entries: list[tuple[str, str, str]] = []

    def add(path: str, freq: str, pri: str) -> None:
        url = BASE if path == "/" else f"{BASE}{path}"
        entries.append((url, freq, pri))

    add("/", "weekly", "1.0")
    for p in static[1:]:
        pri = "0.9" if p in ("/calculators", "/guides") else "0.4"
        add(p, "monthly", pri)

    for h in hub_slugs:
        add(f"/{h}", "weekly", "0.85")

    for hub, slug in sc_pairs:
        add(f"/{hub}/{slug}", "monthly", "0.65")

    for g in guide_cat_slugs:
        add(f"/guides/{g}", "weekly", "0.75")

    for g in guide_slugs:
        add(f"/guides/{g}", "monthly", "0.7")

    for t in glossary_slugs:
        add(f"/glossary/{t}", "monthly", "0.55")

    for cid in order:
        add(f"/calculators/{cid}", "weekly", "0.8")
        for s in cats[cid]:
            add(f"/calculators/{cid}/{s}", "monthly", "0.7")

    seen: set[str] = set()
    out: list[tuple[str, str, str]] = []
    for u, f, p in entries:
        if u not in seen:
            seen.add(u)
            out.append((u, f, p))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for u, f, p in out:
        lines.extend(
            [
                "  <url>",
                f"    <loc>{u}</loc>",
                f"    <lastmod>{TODAY}</lastmod>",
                f"    <changefreq>{f}</changefreq>",
                f"    <priority>{p}</priority>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    lines.append("")

    public = ROOT / "public"
    public.mkdir(exist_ok=True)
    primary = public / "sitemap.xml"
    dated = public / f"sitemap-{TODAY}.xml"
    text = "\n".join(lines)
    primary.write_text(text, encoding="utf-8")
    dated.write_text(text, encoding="utf-8")

    print(f"URLs: {len(out)}")
    print(f"Hubs: {hub_slugs}")
    print(f"Guides: {len(guide_slugs)}")
    print(f"Guide categories: {len(guide_cat_slugs)}")
    print(f"Glossary: {len(glossary_slugs)}")
    print(f"Scenarios: {len(sc_pairs)}")
    print(f"Calculators: {sum(len(v) for v in cats.values())}")
    print(f"Wrote {primary}")
    print(f"Wrote {dated}")


if __name__ == "__main__":
    main()
