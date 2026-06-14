#!/usr/bin/env python3
"""
English generator for the astrology planet-in-sign dictionary (meaning-of-astro-*).

The Korean generator (gen-astro-matrix.py) is grammar-entangled (josa particles,
Korean word order), so the English edition is authored as its own natural-English
template + data rather than a parameterization. This first batch covers the personal
luminaries Sun & Moon (24 pages); the 12-sign data below is shared and reusable for
the remaining planets, which are delegated to a follow-up batch.

Output: src/content/blog/en/meaning-of-astro-{planet}-in-{sign}.mdx
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "src", "content", "blog", "en")

# planet: (name, slug, glyph, rules, core-question, cycle)
PLANETS = {
    "sun": ("Sun", "sun", "☉", "identity, vitality, the core of the self",
            "who do I shine as", "about 1 year (≈1 month per sign)"),
    "moon": ("Moon", "moon", "☽", "emotion, instinct, the need for security",
             "where do I feel safe", "about 28 days (2–3 days per sign)"),
}

# sign: (name, slug, glyph, element, modality, ruler, keyword, style,
#        [3 strengths], [2 cautions], element-flavor)
SIGNS = [
    ("Aries", "aries", "♈", "Fire", "Cardinal", "Mars", "initiative, courage, directness",
     "quickly and bluntly, without hesitation",
     ["the drive to simply begin", "courage that shines in a crisis", "unvarnished honesty"],
     ["haste can blur the finish", "competitiveness invites needless conflict"],
     "a charge of intuition and momentum"),
    ("Taurus", "taurus", "♉", "Earth", "Fixed", "Venus", "stability, the senses, accumulation",
     "slowly but surely, savoring every sense",
     ["the stamina to see things through", "a grounded feel for real resources", "unshakeable calm"],
     ["change itself can feel like a threat", "stubbornness can block flexibility"],
     "a steadiness of realism and patience"),
    ("Gemini", "gemini", "♊", "Air", "Mutable", "Mercury", "curiosity, language, connection",
     "lightly and wittily, along several tracks at once",
     ["fast learning and a gift for explaining", "sociability that works anywhere", "a knack for linking situations"],
     ["scattered attention can stay shallow", "words can outrun the heart"],
     "a distance of language and objectivity"),
    ("Cancer", "cancer", "♋", "Water", "Cardinal", "Moon", "protection, memory, care",
     "cautiously at first, then holding close and deep",
     ["a protective instinct that shelters others", "emotional sensitivity that reads the room", "devotion to one's own people"],
     ["old wounds are remembered and one withdraws", "the tides of mood run high"],
     "a depth of feeling and resonance"),
    ("Leo", "leo", "♌", "Fire", "Fixed", "Sun", "expression, pride, generosity",
     "boldly and brightly, from the center of the stage",
     ["a presence that draws people in", "big-hearted generosity", "creative self-expression"],
     ["it wobbles badly without recognition", "pride makes apologies hard"],
     "a charge of intuition and momentum"),
    ("Virgo", "virgo", "♍", "Earth", "Mutable", "Mercury", "analysis, improvement, usefulness",
     "carefully and precisely, seeking a better way",
     ["analysis that misses no detail", "quiet, reliable competence", "ceaseless self-improvement"],
     ["perfectionism delays the start", "the critic's edge turns on the self"],
     "a steadiness of realism and patience"),
    ("Libra", "libra", "♎", "Air", "Cardinal", "Venus", "balance, relationship, aesthetics",
     "gracefully and fairly, in step with the other",
     ["a balancing sense that mediates conflict", "a refined eye for beauty", "natural negotiation skills"],
     ["long hesitation before a decision", "avoiding conflict hides true feelings"],
     "a distance of language and objectivity"),
    ("Scorpio", "scorpio", "♏", "Water", "Fixed", "Pluto", "intensity, insight, regeneration",
     "deeply and intensely, all the way to the end",
     ["insight that pierces to the essence", "all-in immersion", "the power to rebuild after collapse"],
     ["suspicion and control tighten relationships", "feelings hidden too long erupt"],
     "a depth of feeling and resonance"),
    ("Sagittarius", "sagittarius", "♐", "Fire", "Mutable", "Jupiter", "exploration, meaning, optimism",
     "far and free, toward a larger meaning",
     ["an openness to set out anywhere", "an optimistic vision", "philosophical insight"],
     ["details and promises can be neglected", "frankness can sound careless"],
     "a charge of intuition and momentum"),
    ("Capricorn", "capricorn", "♑", "Earth", "Cardinal", "Saturn", "goals, structure, achievement",
     "step by step, systematically toward the summit",
     ["patience that endures the long game", "the skill to build structures", "trustworthiness that carries responsibility"],
     ["emotion is postponed in favor of results", "harshest of all on oneself"],
     "a steadiness of realism and patience"),
    ("Aquarius", "aquarius", "♒", "Air", "Fixed", "Uranus", "originality, solidarity, the future",
     "differently, yet for everyone",
     ["ideas ahead of their time", "a horizontal sense of solidarity", "objectivity unswept by emotion"],
     ["difference for its own sake is a trap", "close relationships can be awkward"],
     "a distance of language and objectivity"),
    ("Pisces", "pisces", "♓", "Water", "Mutable", "Neptune", "empathy, imagination, transcendence",
     "boundlessly, as if seeping in, following intuition",
     ["empathy that feels others' emotions as one's own", "imagination that pictures beyond the real", "unconditional acceptance"],
     ["blurred boundaries lead to burnout", "escapism becomes a sweet trap"],
     "a depth of feeling and resonance"),
]

# punchline per planet x sign (sign order matches SIGNS)
PUNCH = {
    "sun": [
        "A born front-runner — your very presence is a starting signal.",
        "A slow flame — self-worth that warms up gradually and lasts.",
        "Someone who shines through stories — words and ideas are your identity.",
        "A Sun like moonlight — the self is completed by protecting and caring.",
        "The Sun in its own home — wither without expression, warm everyone when you shine.",
        "A Sun that shines through usefulness — quality is your pride.",
        "A Sun that finds itself in the mirror of relationships.",
        "A Sun burning beneath the surface — you never show all of your intensity.",
        "Someone whose identity lies beyond the horizon — stand still and the light dims.",
        "A Sun shining from the summit — achievement is proof of being.",
        "A Sun that shines from outside the crowd — difference itself is vitality.",
        "A flowing light — your identity is larger than any fixed frame.",
    ],
    "moon": [
        "A Moon quick to ignite — anger flares fast and recovers fast.",
        "One of the Moon's most comfortable seats — stability and a good meal are medicine for the heart.",
        "A heart that settles only once talked through — conversation is comfort.",
        "The Moon in its own home — as deep as the sensitivity is, it needs rituals of recovery.",
        "A heart that fills when applauded — recognition is emotional oxygen.",
        "A Moon that finds calm at a tidy desk — anxiety eases by checking the details.",
        "A Moon that quiets in togetherness — discord is felt in the body first.",
        "An all-or-nothing emotional life — once trust is built, it holds deeper than anyone.",
        "A Moon soothed by open horizons — confinement weighs on the mood.",
        "A Moon that finds safety in structure — feelings steady once duties are in order.",
        "A Moon calmed by a little distance — space is not coldness but breathing room.",
        "A Moon with porous emotional borders — it needs time alone to drain what it absorbed.",
    ],
}

ELEMENT_FAQ_TIME = {"moon"}  # planets that need birth time/place for the FAQ note

DISCLAIMER = ("*Astrology is not a science that fixes the future but a symbolic language "
              "for self-understanding. A planet–sign placement reads most accurately alongside "
              "the whole birth chart (houses and aspects).*")


def love_line(pslug):
    return {
        "sun": "you shine when you stay true to yourself even within a relationship",
        "moon": "emotional safety is the precondition for every kind of closeness",
    }[pslug]


def money_line(elem):
    return {
        "Fire": "you earn fast and spend fast, so you need a cooling mechanism",
        "Earth": "you have a strong instinct for accumulation and tangible assets",
        "Air": "information and networks themselves become your assets",
        "Water": "money carries emotion too, so watch for mood spending",
    }[elem]


def page(pslug, s):
    pname, _, pglyph, rules, question, cycle = PLANETS[pslug]
    sname, sslug, sglyph, elem, mode, ruler, kw, style, strengths, cautions, flavor = s
    si = [x[1] for x in SIGNS].index(sslug)
    punch = PUNCH[pslug][si]
    title = f"{pname} in {sname} — Meaning in Astrology"
    desc = (f"The {pname} ({pglyph}) governs {rules}; {sname} ({sglyph}) is the sign of {kw}. "
            f"Here is how a {pname}-in-{sname} placement shows up in personality, relationships, and work.")
    strengths_md = "\n".join(f"- **{x}**" for x in strengths)
    cautions_md = "\n".join(f"- {x}" for x in cautions)
    time_note = " and time and place" if pslug in ELEMENT_FAQ_TIME else ""
    body = f"""---
track: dictionary
locale: en
title: "{title}"
category: Mysticism
series: "Astrology Dictionary"
author: OIYO Research Team
tags:
  - astrology
  - {pslug}
  - {sslug}
  - dictionary
description: >-
  {desc}
pubDate: '2026-06-14'
---

**{punch}** The {pname} is the planet of "{question}," and {sname} makes that answer come out {style}.

## At a glance

| Item | Detail |
|---|---|
| Planet | {pname} {pglyph} — {rules} |
| Sign | {sname} {sglyph} — {kw} |
| Element · Modality | {elem} · {mode} |
| Sign ruler | {ruler} |
| Orbital cycle | {cycle} |

## Core tendency

The {pname} governs **{rules}**. When that energy passes through {sname}, it shows up {style}.

This is why the same {pname} can look like an entirely different person from sign to sign. {sname}'s element, **{elem}**, adds {flavor} to this placement.

## Strengths

{strengths_md}

## Watch out for

{cautions_md}

## How it shows up

- **Love**: {love_line(pslug)}.
- **Work & study**: the {sname} way ({style}) becomes the default of your working style.
- **Money**: {money_line(elem)}.

## See also

- [Planet × Sign matrix hub](/en/meaning-of-astro-planets-in-signs/)
- [What the zodiac signs are](/ko/meaning-of-zodiac-signs/)
- [What a birth (natal) chart is](/ko/meaning-of-birth-chart/)
- [What the rising sign is](/ko/meaning-of-rising-sign/)
- Try it: compute your chart at [oiyo.net/en/natal/chart](https://oiyo.net/en/natal/chart)

### FAQ

**Q. If my {pname} is in {sname}, does that fix my personality?**

A. No. A planet–sign placement is only one piece of the birth chart. Depending on its house and the angles (aspects) it makes with other planets, the same placement can show up very differently.

**Q. How do I find my {pname} sign?**

A. Calculate your birth chart from your exact birth date{time_note}. The [birth-chart guide](/ko/meaning-of-birth-chart/) walks through the reading order, and [oiyo.net/en/natal/chart](https://oiyo.net/en/natal/chart) computes it for you.

---

{DISCLAIMER}
"""
    return f"meaning-of-astro-{pslug}-in-{sslug}.mdx", body


def hub():
    rows = []
    for pslug in PLANETS:
        pname, _, pglyph, rules, _, _ = PLANETS[pslug]
        links = " · ".join(
            f"[{s[0]}](/en/meaning-of-astro-{pslug}-in-{s[1]}/)" for s in SIGNS)
        rows.append(f"| {pname} {pglyph} | {rules} | {links} |")
    table = "\n".join(rows)
    body = f"""---
track: dictionary
locale: en
title: "Planet in Sign — Astrology Dictionary (Sun & Moon)"
category: Mysticism
series: "Astrology Dictionary"
author: OIYO Research Team
tags:
  - astrology
  - planets
  - dictionary
description: >-
  What each placement means when the Sun and Moon pass through the twelve zodiac signs —
  the personal luminaries of any birth chart, with the full ten-planet matrix in Korean.
pubDate: '2026-06-14'
---

A birth chart is a three-layered sentence: "**what** (planet) **how** (sign) **where** (house)."
This hub gathers the first two layers for the two most personal points of the chart — the
**Sun** (who you shine as) and the **Moon** (where you feel safe).

## Sun & Moon × Sign

| Planet | Governs | 12 signs |
|---|---|---|
{table}

## See also

- Compute your chart: [oiyo.net/en/natal/chart](https://oiyo.net/en/natal/chart)
- Full ten-planet matrix (Korean): [Planet × Sign 120 placements](/ko/meaning-of-astro-planets-in-signs/)
- [What astrology is](/en/meaning-of-astrology/)

---

{DISCLAIMER}
"""
    return "meaning-of-astro-planets-in-signs.mdx", body


def main():
    count = 0
    for pslug in PLANETS:
        for s in SIGNS:
            name, body = page(pslug, s)
            with open(os.path.join(OUT, name), "w") as f:
                f.write(body)
            count += 1
    name, body = hub()
    with open(os.path.join(OUT, name), "w") as f:
        f.write(body)
    print(f"written: {count} English pages (Sun & Moon × 12 signs) + 1 hub")


if __name__ == "__main__":
    main()
