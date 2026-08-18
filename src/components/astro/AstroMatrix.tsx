import { useMemo, useState } from "react";

/**
 * The planet-by-house and planet-by-sign readings, as one thing you operate
 * instead of 1,446 pages you navigate.
 *
 * Those pages are a filled-in grid: 10 planets against 12 houses and 12 signs,
 * in six locales. Measured on 2026-08-14, each shares 70-80% of its text with
 * its siblings, and the only hand-written part is the opening line. So the grid
 * lives here as data — 10 planet records, 12 house records, 12 sign records and
 * the 240 hooks — and the reader picks a combination rather than being sent to
 * another page to read the same paragraphs with two nouns swapped.
 *
 * The hooks are quoted verbatim. They are the one part of the corpus a person
 * actually wrote, and rephrasing them here would throw away the only thing the
 * pages had.
 */

export interface Planet {
  id: string;
  name: string;
  glyph: string;
  rules: string;
  question?: string;
  gift?: string;
}

export interface House {
  n: number;
  name: string;
  stage: string;
  naturalSign: string;
  classification: string;
}

export interface Sign {
  id: string;
  name: string;
  glyph: string;
  rules: string;
  element: string;
  modality: string;
  ruler: string;
}

export interface AstroData {
  locale: string;
  planets: Planet[];
  houses: House[];
  signs: Sign[];
  hooks: { house: Record<string, string>; sign: Record<string, string> };
}

type Axis = "house" | "sign";

interface Copy {
  axisHouse: string;
  axisSign: string;
  pickPlanet: string;
  pickHouse: string;
  pickSign: string;
  facts: string;
  planet: string;
  stage: string;
  naturalSign: string;
  classification: string;
  element: string;
  modality: string;
  ruler: string;
  rules: string;
  question: string;
  noHook: string;
  detail: string;
}

const COPY: Record<string, Copy> = {
  ko: {
    axisHouse: "하우스로 보기", axisSign: "사인으로 보기",
    pickPlanet: "행성", pickHouse: "하우스", pickSign: "사인",
    facts: "한눈에 보기", planet: "행성", stage: "삶의 무대",
    naturalSign: "자연 사인", classification: "분류", element: "원소",
    modality: "성질", ruler: "지배 행성", rules: "다스리는 것", question: "묻는 질문",
    noHook: "이 조합의 설명은 아직 준비 중입니다.", detail: "자세히 읽기",
  },
  en: {
    axisHouse: "By house", axisSign: "By sign",
    pickPlanet: "Planet", pickHouse: "House", pickSign: "Sign",
    facts: "At a glance", planet: "Planet", stage: "Area of life",
    naturalSign: "Natural sign", classification: "Type", element: "Element",
    modality: "Modality", ruler: "Ruler", rules: "Governs", question: "Asks",
    noHook: "A reading for this combination is not written yet.", detail: "Read in full",
  },
  ja: {
    axisHouse: "ハウスで見る", axisSign: "サインで見る",
    pickPlanet: "惑星", pickHouse: "ハウス", pickSign: "サイン",
    facts: "ひと目で", planet: "惑星", stage: "人生の舞台",
    naturalSign: "自然サイン", classification: "分類", element: "エレメント",
    modality: "モダリティ", ruler: "支配星", rules: "司るもの", question: "問い",
    noHook: "この組み合わせの解説はまだ用意されていません。", detail: "詳しく読む",
  },
  zh: {
    axisHouse: "按宫位查看", axisSign: "按星座查看",
    pickPlanet: "行星", pickHouse: "宫位", pickSign: "星座",
    facts: "一览", planet: "行星", stage: "人生舞台",
    naturalSign: "自然星座", classification: "分类", element: "元素",
    modality: "性质", ruler: "守护星", rules: "掌管", question: "提出的问题",
    noHook: "该组合的解读尚未撰写。", detail: "阅读全文",
  },
  fr: {
    axisHouse: "Par maison", axisSign: "Par signe",
    pickPlanet: "Planète", pickHouse: "Maison", pickSign: "Signe",
    facts: "En bref", planet: "Planète", stage: "Domaine de vie",
    naturalSign: "Signe naturel", classification: "Type", element: "Élément",
    modality: "Modalité", ruler: "Maître", rules: "Gouverne", question: "Demande",
    noHook: "Une lecture pour cette combinaison n'est pas encore rédigée.", detail: "Lire en entier",
  },
  es: {
    axisHouse: "Por casa", axisSign: "Por signo",
    pickPlanet: "Planeta", pickHouse: "Casa", pickSign: "Signo",
    facts: "De un vistazo", planet: "Planeta", stage: "Área de la vida",
    naturalSign: "Signo natural", classification: "Tipo", element: "Elemento",
    modality: "Modalidad", ruler: "Regente", rules: "Rige", question: "Pregunta",
    noHook: "Aún no hay una lectura para esta combinación.", detail: "Leer completo",
  },
};

const chip = (active: boolean) =>
  [
    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition",
    active
      ? "border-primary bg-primary text-primary-foreground font-medium"
      : "border-border/70 hover:border-primary/60 hover:bg-muted/50",
  ].join(" ");

export default function AstroMatrix({ data }: { data: AstroData }) {
  const c = COPY[data.locale] ?? COPY.en;
  const [axis, setAxis] = useState<Axis>("house");
  const [planetId, setPlanetId] = useState(data.planets[0]?.id ?? "");
  const [houseN, setHouseN] = useState(data.houses[0]?.n ?? 1);
  const [signId, setSignId] = useState(data.signs[0]?.id ?? "");

  const planet = useMemo(
    () => data.planets.find((p) => p.id === planetId) ?? data.planets[0],
    [data.planets, planetId],
  );
  const house = useMemo(
    () => data.houses.find((h) => h.n === houseN) ?? data.houses[0],
    [data.houses, houseN],
  );
  const sign = useMemo(
    () => data.signs.find((s) => s.id === signId) ?? data.signs[0],
    [data.signs, signId],
  );

  const key = axis === "house" ? `${planet?.id}-${house?.n}` : `${planet?.id}-${sign?.id}`;
  const hook = data.hooks[axis]?.[key];
  const detailHref =
    axis === "house"
      ? `/${data.locale}/meaning-of-astro-${planet?.id}-in-house-${house?.n}/`
      : `/${data.locale}/meaning-of-astro-${planet?.id}-in-${sign?.id}/`;

  const rows: [string, string][] =
    axis === "house"
      ? [
          [c.planet, `${planet?.name} ${planet?.glyph} — ${planet?.rules}`],
          [c.stage, house?.stage ?? ""],
          [c.naturalSign, house?.naturalSign ?? ""],
          [c.classification, house?.classification ?? ""],
        ]
      : [
          [c.planet, `${planet?.name} ${planet?.glyph} — ${planet?.rules}`],
          [c.rules, sign?.rules ?? ""],
          [c.element, sign?.element ?? ""],
          [c.modality, sign?.modality ?? ""],
          [c.ruler, sign?.ruler ?? ""],
        ];
  if (planet?.question) rows.push([c.question, planet.question]);

  return (
    <div className="not-prose">
      <div className="mb-6 inline-flex rounded-lg border border-border/70 p-1">
        {(["house", "sign"] as Axis[]).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAxis(a)}
            aria-pressed={axis === a}
            className={[
              "rounded-md px-4 py-1.5 text-sm transition",
              axis === a ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/60",
            ].join(" ")}
          >
            {a === "house" ? c.axisHouse : c.axisSign}
          </button>
        ))}
      </div>

      <fieldset className="mb-4">
        <legend className="mb-2 text-sm font-medium text-muted-foreground">{c.pickPlanet}</legend>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {data.planets.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === planetId}
              onClick={() => setPlanetId(p.id)} className={chip(p.id === planetId)}>
              <span aria-hidden="true">{p.glyph}</span> {p.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="mb-2 text-sm font-medium text-muted-foreground">
          {axis === "house" ? c.pickHouse : c.pickSign}
        </legend>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {axis === "house"
            ? data.houses.map((h) => (
                <button key={h.n} type="button" aria-pressed={h.n === houseN}
                  onClick={() => setHouseN(h.n)} className={chip(h.n === houseN)}>
                  {h.n} · {h.name}
                </button>
              ))
            : data.signs.map((s) => (
                <button key={s.id} type="button" aria-pressed={s.id === signId}
                  onClick={() => setSignId(s.id)} className={chip(s.id === signId)}>
                  <span aria-hidden="true">{s.glyph}</span> {s.name}
                </button>
              ))}
        </div>
      </fieldset>

      <div className="rounded-xl border border-border/60 p-6" aria-live="polite">
        <p className="text-lg font-semibold leading-relaxed [word-break:keep-all]">
          {hook ?? c.noHook}
        </p>

        <h3 className="mt-6 mb-3 text-sm font-medium text-muted-foreground">{c.facts}</h3>
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[max-content_1fr]">
          {rows.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-sm [word-break:keep-all]">{value}</dd>
            </div>
          ))}
        </dl>

        <a href={detailHref} className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          {c.detail} →
        </a>
      </div>
    </div>
  );
}
