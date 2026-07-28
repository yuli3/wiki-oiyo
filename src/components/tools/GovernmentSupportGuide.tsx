import React, { useState, useCallback } from 'react';
import type { Locale } from '@/lib/i18n';
import {
  GOVERNMENT_SUPPORT_DATA,
  type CountryCode,
  type SupportCategory,
  type SupportProgram,
} from '@/data/government-support';

// ---------------------------------------------------------------------------
// UI string manifests — no hardcoded strings in JSX
// ---------------------------------------------------------------------------

type UILocale = 'ko' | 'en' | 'ja' | 'fr' | 'es' | 'zh';

const UI_LABELS: Record<UILocale, {
  pageTitle: string;
  pageSubtitle: string;
  filterAll: string;
  filterEmergency: string;
  filterMedical: string;
  filterHousing: string;
  filterChildcare: string;
  filterEmployment: string;
  filterTax: string;
  visitSite: string;
  callPhone: string;
  noPhone: string;
  disclaimer: string;
  countryLabel: string;
}> = {
  ko: {
    pageTitle: '정부 지원 가이드',
    pageSubtitle: '복지·의료·주거·취업 공식 안내',
    filterAll: '전체',
    filterEmergency: '긴급지원',
    filterMedical: '의료',
    filterHousing: '주거',
    filterChildcare: '육아',
    filterEmployment: '취업',
    filterTax: '세금',
    visitSite: '공식 사이트',
    callPhone: '전화 문의',
    noPhone: '지자체 문의',
    disclaimer: '본 정보는 공식 출처 기준이며, 변경될 수 있습니다. 최신 정보는 각 기관 공식 사이트에서 확인하세요.',
    countryLabel: '국가 선택',
  },
  en: {
    pageTitle: 'Government Support Guide',
    pageSubtitle: 'Official Welfare, Health, Housing & Employment Resources',
    filterAll: 'All',
    filterEmergency: 'Emergency',
    filterMedical: 'Medical',
    filterHousing: 'Housing',
    filterChildcare: 'Childcare',
    filterEmployment: 'Employment',
    filterTax: 'Tax',
    visitSite: 'Official Site',
    callPhone: 'Call',
    noPhone: 'Contact local office',
    disclaimer: 'This information is based on official sources and may be subject to change. Always verify the latest details on each agency\'s official website.',
    countryLabel: 'Select Country',
  },
  ja: {
    pageTitle: '政府支援ガイド',
    pageSubtitle: '福祉・医療・住居・就労の公式案内',
    filterAll: 'すべて',
    filterEmergency: '緊急支援',
    filterMedical: '医療',
    filterHousing: '住居',
    filterChildcare: '育児',
    filterEmployment: '就労',
    filterTax: '税金',
    visitSite: '公式サイト',
    callPhone: '電話相談',
    noPhone: '地域窓口へ',
    disclaimer: '本情報は公式出典に基づいており、変更される場合があります。最新情報は各機関の公式サイトでご確認ください。',
    countryLabel: '国を選択',
  },
  fr: {
    pageTitle: 'Guide des aides gouvernementales',
    pageSubtitle: 'Ressources officielles — Bien-être, Santé, Logement & Emploi',
    filterAll: 'Tout',
    filterEmergency: 'Urgence',
    filterMedical: 'Médical',
    filterHousing: 'Logement',
    filterChildcare: 'Enfance',
    filterEmployment: 'Emploi',
    filterTax: 'Impôts',
    visitSite: 'Site officiel',
    callPhone: 'Appeler',
    noPhone: 'Contacter la mairie',
    disclaimer: 'Ces informations sont basées sur des sources officielles et peuvent évoluer. Vérifiez toujours les dernières informations sur le site officiel de chaque organisme.',
    countryLabel: 'Choisir un pays',
  },
  es: {
    pageTitle: 'Guía de ayudas del gobierno',
    pageSubtitle: 'Recursos oficiales — Bienestar, Salud, Vivienda y Empleo',
    filterAll: 'Todo',
    filterEmergency: 'Emergencia',
    filterMedical: 'Médico',
    filterHousing: 'Vivienda',
    filterChildcare: 'Infancia',
    filterEmployment: 'Empleo',
    filterTax: 'Impuestos',
    visitSite: 'Sitio oficial',
    callPhone: 'Llamar',
    noPhone: 'Consultar oficina local',
    disclaimer: 'Esta información se basa en fuentes oficiales y puede cambiar. Verifique siempre la información más reciente en el sitio web oficial de cada organismo.',
    countryLabel: 'Seleccionar país',
  },
  zh: {
    pageTitle: '政府補助指南',
    pageSubtitle: '福利·醫療·住宅·就業官方資源',
    filterAll: '全部',
    filterEmergency: '緊急援助',
    filterMedical: '醫療',
    filterHousing: '住宅',
    filterChildcare: '育兒',
    filterEmployment: '就業',
    filterTax: '稅務',
    visitSite: '官方網站',
    callPhone: '電話諮詢',
    noPhone: '請聯繫地方機構',
    disclaimer: '本資訊依據官方來源，可能隨時變動，請至各機構官網確認最新資訊。',
    countryLabel: '選擇國家',
  },
};

// ---------------------------------------------------------------------------
// Category icon map — single source of truth
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: Record<SupportCategory, string> = {
  emergency: '🆘',
  medical: '🏥',
  housing: '🏠',
  childcare: '👶',
  employment: '💼',
  tax: '🧾',
};

// ---------------------------------------------------------------------------
// Country accent colors — locale-keyed to avoid binary conditionals
// ---------------------------------------------------------------------------

const COUNTRY_ACCENT: Record<CountryCode, { bg: string; border: string; text: string; chip: string }> = {
  KR: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    chip: 'bg-red-100 text-red-700 border-red-200',
  },
  JP: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    chip: 'bg-rose-100 text-rose-700 border-rose-200',
  },
  US: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    chip: 'bg-green-100 text-green-700 border-green-200',
  },
  FR: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    chip: 'bg-green-100 text-green-700 border-green-200',
  },
  ES: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-800',
    chip: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  CN: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    chip: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

// ---------------------------------------------------------------------------
// Default country selection — driven by locale map, not binary conditionals
// ---------------------------------------------------------------------------

const LOCALE_DEFAULT_COUNTRY: Record<UILocale, CountryCode> = {
  ko: 'KR',
  en: 'US',
  ja: 'JP',
  fr: 'FR',
  es: 'ES',
  zh: 'CN',
};

// ---------------------------------------------------------------------------
// Program name & description resolver — locale-driven map
// ---------------------------------------------------------------------------

function getProgramName(program: SupportProgram, locale: UILocale): string {
  const map: Record<UILocale, string> = {
    ko: program.nameKo,
    en: program.nameEn,
    ja: program.nameJa,
    fr: program.nameFr,
    es: program.nameEs,
    zh: program.nameZh,
  };
  return map[locale] ?? program.nameEn;
}

function getProgramDesc(program: SupportProgram, locale: UILocale): string {
  const map: Record<UILocale, string> = {
    ko: program.descKo,
    en: program.descEn,
    ja: program.descJa,
    fr: program.descFr,
    es: program.descEs,
    zh: program.descZh,
  };
  return map[locale] ?? program.descEn;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  locale: Locale;
}

const FILTER_ORDER: Array<SupportCategory | 'all'> = [
  'all',
  'emergency',
  'medical',
  'housing',
  'childcare',
  'employment',
  'tax',
];

const GovernmentSupportGuide: React.FC<Props> = ({ locale }) => {
  const uiLocale = (locale as UILocale) in UI_LABELS ? (locale as UILocale) : 'en';
  const t = UI_LABELS[uiLocale];

  const defaultCountry = LOCALE_DEFAULT_COUNTRY[uiLocale];
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const [activeFilter, setActiveFilter] = useState<SupportCategory | 'all'>('all');

  const countryData = GOVERNMENT_SUPPORT_DATA.find((c) => c.code === selectedCountry)!;
  const accent = COUNTRY_ACCENT[selectedCountry];

  const filteredPrograms =
    activeFilter === 'all'
      ? countryData.programs
      : countryData.programs.filter((p) => p.category === activeFilter);

  const handleCountryChange = useCallback((code: CountryCode) => {
    setSelectedCountry(code);
    setActiveFilter('all');
  }, []);

  const filterLabel: Record<SupportCategory | 'all', string> = {
    all: t.filterAll,
    emergency: t.filterEmergency,
    medical: t.filterMedical,
    housing: t.filterHousing,
    childcare: t.filterChildcare,
    employment: t.filterEmployment,
    tax: t.filterTax,
  };

  return (
    <div className="not-prose my-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.pageTitle}</h1>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">{t.pageSubtitle}</p>
      </div>

      {/* Country selector */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">
          {t.countryLabel}
        </p>
        <div className="flex justify-center gap-3 flex-wrap" role="tablist" aria-label={t.countryLabel}>
          {GOVERNMENT_SUPPORT_DATA.map((country) => {
            const isActive = country.code === selectedCountry;
            const ca = COUNTRY_ACCENT[country.code];
            return (
              <button
                key={country.code}
                role="tab"
                aria-selected={isActive}
                aria-label={`${country.flag} ${country.nameEn}`}
                onClick={() => handleCountryChange(country.code)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 ${
                  isActive
                    ? `${ca.bg} ${ca.border} ${ca.text} shadow-sm scale-105`
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span aria-hidden="true" className="text-xl">{country.flag}</span>
                <span>{{
                  ko: country.nameKo,
                  en: country.nameEn,
                  ja: country.nameJa,
                  fr: country.nameFr,
                  es: country.nameEs,
                  zh: country.nameZh,
                }[uiLocale] ?? country.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filter chips */}
      <div
        className="flex flex-wrap gap-2 mb-6 justify-center"
        role="group"
        aria-label="Category filter"
      >
        {FILTER_ORDER.map((cat) => {
          const isActive = activeFilter === cat;
          const icon = cat === 'all' ? '🗂️' : CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={isActive}
              aria-label={`${filterLabel[cat]} 필터`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400 ${
                isActive
                  ? `${accent.chip} border-current shadow-sm`
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span aria-hidden="true">{icon}</span>
              <span>{filterLabel[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Program cards grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        aria-live="polite"
        aria-label={`${filteredPrograms.length} programs listed`}
      >
        {filteredPrograms.map((program) => {
          const name = getProgramName(program, uiLocale);
          const desc = getProgramDesc(program, uiLocale);
          const icon = CATEGORY_ICONS[program.category];

          return (
            <article
              key={program.id}
              className={`flex flex-col p-5 bg-white rounded-2xl border ${accent.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Card header */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  aria-hidden="true"
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl ${accent.bg}`}
                >
                  {icon}
                </span>
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-900 text-sm leading-snug">{name}</h2>
                  <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-widest ${accent.text}`}>
                    {filterLabel[program.category]}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed flex-1 mb-4">{desc}</p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <a
                  href={program.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} — ${t.visitSite}`}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400 ${accent.chip}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  {t.visitSite}
                </a>

                {program.phone !== null ? (
                  <a
                    href={program.phone}
                    aria-label={`${name} — ${t.callPhone} ${program.phoneDisplay}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border bg-slate-50 border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.49 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {program.phoneDisplay}
                  </a>
                ) : program.phoneDisplay !== null ? (
                  <span
                    aria-label={`${name} — ${program.phoneDisplay}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border bg-slate-50 border-slate-200 text-slate-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.49 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.77-.77a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {program.phoneDisplay}
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div
        role="note"
        aria-label="Disclaimer"
        className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl"
      >
        <p className="text-xs text-slate-500 leading-relaxed text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline mr-1.5 mb-0.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default GovernmentSupportGuide;
