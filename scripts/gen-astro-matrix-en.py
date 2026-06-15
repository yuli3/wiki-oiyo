#!/usr/bin/env python3
"""
English generator for the astrology planet-in-sign dictionary (meaning-of-astro-*).

The Korean generator (gen-astro-matrix.py) is grammar-entangled (josa particles,
Korean word order), so the English edition is authored as its own natural-English
template + data rather than a parameterization. This generator covers the full
ten-planet matrix (10 planets × 12 signs = 120 pages) plus the locale hub.

Output: src/content/blog/en/meaning-of-astro-{planet}-in-{sign}.mdx
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "src", "content", "blog", "en")

# planet: (name, slug, glyph, kind, rules, core-question, cycle)
PLANETS = {
    "sun": ("Sun", "sun", "☉", "personal", "identity, vitality, the core of the self",
            "who do I shine as", "about 1 year (≈1 month per sign)"),
    "moon": ("Moon", "moon", "☽", "personal", "emotion, instinct, the need for security",
             "where do I feel safe", "about 28 days (2–3 days per sign)"),
    "mercury": ("Mercury", "mercury", "☿", "personal", "thought, language, the way we communicate",
                "how do I think and speak", "about 1 year (frequent retrogrades)"),
    "venus": ("Venus", "venus", "♀", "personal", "love, beauty, the style of attraction",
              "what do I find beautiful, and how do I love", "about 1 year"),
    "mars": ("Mars", "mars", "♂", "personal", "drive, desire, the way anger moves",
             "what do I move toward, and how do I fight", "about 2 years"),
    "jupiter": ("Jupiter", "jupiter", "♃", "social", "expansion, luck, the direction of belief",
                "where do I find growth and meaning", "about 12 years (≈1 year per sign)"),
    "saturn": ("Saturn", "saturn", "♄", "social", "limits, responsibility, the task of mastery",
               "what tests make me stronger", "about 29 years (≈2.5 years per sign)"),
    "uranus": ("Uranus", "uranus", "♅", "generational", "innovation, rupture, the impulse toward freedom",
               "what does our generation break open", "about 84 years (≈7 years per sign)"),
    "neptune": ("Neptune", "neptune", "♆", "generational", "dreams, ideals, the dissolving of boundaries",
                "what does our generation dream of, and what enchants it", "about 165 years (≈14 years per sign)"),
    "pluto": ("Pluto", "pluto", "♇", "generational", "transformation, power, rebirth",
              "what does our generation end and remake", "about 248 years (12–30 years per sign)"),
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
    "mercury": [
        "A mind that speaks from the finish line — words arrive before second thoughts.",
        "Slow but exact — once this mind understands, it does not forget.",
        "Mercury in its own home — a magician of language, as long as depth is not skipped.",
        "A mind that thinks through memory — emotion gives logic its grain.",
        "A speaking style that dresses stories for the stage — persuasion becomes charisma.",
        "Mercury's other home — a craftsperson of analysis, editing, and useful detail.",
        "A voice that hears both sides before it speaks — mediation comes naturally.",
        "An investigator's mind — the questions go straight to hidden motives.",
        "A mind that leaps by the big picture — stronger in principles than particulars.",
        "A person who speaks like a report — spare, practical language with no excess.",
        "Thought from an unfamiliar angle — the specialty is turning the frame.",
        "A mind that thinks in images instead of logic — the language of metaphor and intuition.",
    ],
    "venus": [
        "Love that moves straight ahead — directness is more magnetic than strategy.",
        "Venus in its own home — love through the senses, and linger long enough to savor it.",
        "Conversation as affection — wit is the first spark of attraction.",
        "Love proven by care — affection with the warmth of a home-cooked meal.",
        "Love as a festival — bright expression and unmistakable specialness are desired.",
        "Love spoken through small kindnesses — quiet, steady, and difficult to fake.",
        "Venus's other home — an aesthete of relationship who understands the balance of together.",
        "Love that wants all of it — shallow bonds rarely get past the door.",
        "Love that leaves together — it settles with someone who respects freedom.",
        "Love built through trust — it does not begin lightly, and it takes responsibility deeply.",
        "Love that begins as friendship — affection without ownership is the ideal.",
        "Venus at its deepest — devoted, but learning to tell dream from reality.",
    ],
    "mars": [
        "Mars in its own home — ignition is quick and the breakthrough is strong.",
        "A slow-boiling force — explosions are rare, but stopping is hard once it moves.",
        "Mars that fights with words — debate becomes sparring.",
        "Anger that moves sideways — held too long, it leaks out as hurt.",
        "Mars that fights for honor — disrespect is what makes the fire rise.",
        "Mars with a precise strike — criticism becomes the chosen weapon.",
        "Mars that tries to avoid the fight — yet turns firm in the face of unfairness.",
        "Mars at its deepest — quiet, relentless, and willing to go to the end.",
        "Drive aimed at a cause — the farther the goal, the stronger the fire.",
        "A strategist's Mars — it wins through steadiness, not emotional display.",
        "Mars against the system — it comes alive when fighting unjust rules.",
        "Mars without a straight line — it reaches the goal by following the current.",
    ],
    "jupiter": [
        "Luck that grows through challenge — doors open for the one who moves first.",
        "Accumulation becomes expansion — what is built slowly swells the largest.",
        "Luck in learning and connection — opportunity arrives through people and ideas.",
        "Luck that grows by sheltering — a familial circle becomes the soil of growth.",
        "A placement with a widening stage — fortune follows when expression gets larger.",
        "Luck in the details — refined skill becomes the path of expansion.",
        "Luck that grows between people — partnership is the engine of growth.",
        "Fortune that enlarges through crisis — the deeper the descent, the greater the return.",
        "Jupiter in its own home — exploration itself becomes the generator of luck.",
        "Luck rewarded at the summit — responsibility sets the scale of expansion.",
        "Luck born from difference — opportunity belongs to the one redrawing the board.",
        "Jupiter's old home — the more generously it gives, the wider the mysterious math becomes.",
    ],
    "saturn": [
        "A lesson in governing haste — learn patience, and courage becomes adult.",
        "A lesson in possession and safety — the standard for enough must be rebuilt.",
        "A lesson in the weight of words — one sentence with depth is the assignment.",
        "A lesson in emotional expression — weakness can be shown without collapse.",
        "A lesson in standing without applause — self-worth beyond recognition is the task.",
        "A lesson in making peace with perfectionism — good enough must be allowed.",
        "A lesson in the responsibility of relationship — balance is learned between alone and together.",
        "A lesson in releasing control — trust is the hardest homework.",
        "A lesson in testing belief — optimism needs a structure it can stand on.",
        "Saturn in its own home — even if late, it arrives more solid than anyone.",
        "A lesson in joining ideal and reality — innovation must learn responsibility.",
        "A lesson in boundaries — even empathy needs a fence.",
    ],
    "uranus": [
        "A pioneering generation — it breaks the old starting line and lays a new track.",
        "A generation of ownership revolution — the rules of money and resources are rewritten.",
        "A generation of information revolution — speech and media change their form.",
        "A generation of family revolution — the meaning of home is asked again.",
        "A generation of expressive revolution — the grammar of creation and the stage is changed.",
        "A generation of labor revolution — the act of working is reinvented.",
        "A generation of relationship revolution — partnership becomes an experiment.",
        "A generation that dismantles taboo — hidden power structures are exposed.",
        "A generation of belief revolution — religion and education are shaken at the frame.",
        "A generation of institutional revolution — systems and authority are rebuilt.",
        "Uranus in its own home — the archetype of futurism.",
        "A generation of sensitivity revolution — the banks of the collective unconscious are opened.",
    ],
    "neptune": [
        "The dream of the hero — a generation that turns personal courage into myth.",
        "The dream of abundance — a generation seeking meaning inside matter.",
        "The dream of story — a generation intoxicated with media and narrative.",
        "The dream of return — roots and refuge are idealized.",
        "The dream of romance — love and creation are treated almost as faith.",
        "The dream of healing — health and service are idealized.",
        "The dream of harmony — a collective longing for relationship and peace.",
        "The dream of the abyss — a generation drawn to the mysteries of death and rebirth.",
        "The dream of pilgrimage — a collective search for truth across distant roads.",
        "The dream of order — a blueprint for the ideal society.",
        "The dream of utopia — a generation trying to build heaven through technology and solidarity.",
        "Neptune in its own home — dream itself becomes the spirit of the age.",
    ],
    "pluto": [
        "War and the transformation of the individual — the heroic story is rewritten.",
        "The transformation of economic structures — value and ownership are born again.",
        "The transformation of information power — words become weapons.",
        "The transformation of family structures — the source of safety is redefined.",
        "The transformation of authority and creation — the myths of stardom and self are rewritten.",
        "The transformation of work and health — power structures in daily life are exposed.",
        "The transformation of relational contracts — marriage and alliance are reconstructed.",
        "Pluto in its own home — a generation that looks straight at taboo and death.",
        "The transformation of belief systems — the authority of religion and truth is rearranged.",
        "The transformation of institutional power — the bones of nations and corporations are reset.",
        "The transformation of technological power — networks become the new throne.",
        "The transformation of the collective unconscious — a vast turning point where boundaries dissolve.",
    ],
}

ELEMENT_FAQ_TIME = {"moon"}  # planets that need birth time/place for the FAQ note
SOCIAL_RHYTHM = {
    "jupiter": "roughly a 12-year",
    "saturn": "roughly a 29-year",
}

DISCLAIMER = ("*Astrology is not a science that fixes the future but a symbolic language "
              "for self-understanding. A planet–sign placement reads most accurately alongside "
              "the whole birth chart (houses and aspects).*")


def love_line(pslug):
    return {
        "sun": "you shine when you stay true to yourself even within a relationship",
        "moon": "emotional safety is the precondition for every kind of closeness",
        "mercury": "mental rapport and the rhythm of conversation are central to attraction",
        "venus": "you give and receive affection in this placement's own aesthetic language",
        "mars": "the heat and tempo of attraction follow this placement's style",
    }[pslug]


def money_line(elem):
    return {
        "Fire": "you earn fast and spend fast, so you need a cooling mechanism",
        "Earth": "you have a strong instinct for accumulation and tangible assets",
        "Air": "information and networks themselves become your assets",
        "Water": "money carries emotion too, so watch for mood spending",
    }[elem]


def planet_subject(pname):
    return f"The {pname}" if pname in ("Sun", "Moon") else pname


def domain_section(pslug, s):
    pname, _, _, kind, _, _, cycle = PLANETS[pslug]
    sname, _, _, elem, _, _, _, style, _, _, _ = s
    if kind == "personal":
        return f"""## How it shows up

- **Love**: {love_line(pslug)}.
- **Work & study**: the {sname} way ({style}) becomes the default of your working style.
- **Money**: {money_line(elem)}.

"""
    if kind == "social":
        cycle_base = SOCIAL_RHYTHM.get(pslug, cycle.split("(")[0].strip())
        return f"""## Growth and task

{pname} changes sign on {cycle_base} rhythm, so people born near the same period often share its growth theme. Still, the **house** this planet occupies and its **aspects** to personal planets can turn the same placement into very different life scenes. For {pname} in {sname}, the key is to translate the one-line signature above into the actual language of your own choices, mentors, limits, and opportunities.

"""
    return f"""## How to read it as a generational placement

{pname} stays in one sign for years or decades, so {pname} in {sname} is less a private personality trait than an **era theme shared by a generation**. In an individual chart, read the house placement and the aspects it makes to the Sun, Moon, and other personal planets to see where that era theme becomes personally active.

"""


def page(pslug, s):
    pname, _, pglyph, _, rules, question, cycle = PLANETS[pslug]
    sname, sslug, sglyph, elem, mode, ruler, kw, style, strengths, cautions, flavor = s
    si = [x[1] for x in SIGNS].index(sslug)
    punch = PUNCH[pslug][si]
    subject = planet_subject(pname)
    title = f"{pname} in {sname} — Meaning in Astrology"
    desc = (f"{subject} ({pglyph}) governs {rules}; {sname} ({sglyph}) is the sign of {kw}. "
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

**{punch}** {subject} is the planet of "{question}," and {sname} makes that answer come out {style}.

## At a glance

| Item | Detail |
|---|---|
| Planet | {pname} {pglyph} — {rules} |
| Sign | {sname} {sglyph} — {kw} |
| Element · Modality | {elem} · {mode} |
| Sign ruler | {ruler} |
| Orbital cycle | {cycle} |

## Core tendency

{subject} governs **{rules}**. When that energy passes through {sname}, it shows up {style}.

This is why the same {pname} can look like an entirely different person from sign to sign. {sname}'s element, **{elem}**, adds {flavor} to this placement.

## Strengths

{strengths_md}

## Watch out for

{cautions_md}

{domain_section(pslug, s)}## See also

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
        pname, _, pglyph, _, rules, _, _ = PLANETS[pslug]
        links = " · ".join(
            f"[{s[0]}](/en/meaning-of-astro-{pslug}-in-{s[1]}/)" for s in SIGNS)
        rows.append(f"| {pname} {pglyph} | {rules} | {links} |")
    table = "\n".join(rows)
    body = f"""---
track: dictionary
locale: en
title: "Planet in Sign — Ten-Planet Astrology Dictionary"
category: Mysticism
series: "Astrology Dictionary"
author: OIYO Research Team
tags:
  - astrology
  - planets
  - dictionary
description: >-
  What each placement means when the ten major astrology planets pass through the twelve zodiac signs —
  a full 120-placement reference for reading the first two layers of a birth chart.
pubDate: '2026-06-14'
---

A birth chart is a three-layered sentence: "**what** (planet) **how** (sign) **where** (house)."
This hub gathers the first two layers for the ten major astrology planets, from the
**Sun** and **Moon** through **Pluto**.

For reading order, start with the Sun, Moon, and rising sign; then Mercury, Venus, and Mars;
then Jupiter and Saturn; then the generational planets Uranus, Neptune, and Pluto.

## Planet × Sign Matrix

| Planet | Governs | 12 signs |
|---|---|---|
{table}

## See also

- Compute your chart: [oiyo.net/en/natal/chart](https://oiyo.net/en/natal/chart)
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
    print(f"written: {count} English pages (10 planets × 12 signs) + 1 hub")


if __name__ == "__main__":
    main()
