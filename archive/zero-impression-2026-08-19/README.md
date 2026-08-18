# 90일 노출 0 계열 2,024편 아카이브 (2026-08-19)

## 판정 기준

**계열 단위로 판정했다.** 파일 단위로 하면 ko만 노출이 있는 계열에서 ja·es 사본만
빠져 hreflang과 시리즈가 깨진다. 그래서 `meaning-of-astro-moon-*` 처럼 접두사로
묶고, **그 계열 전체의 90일 노출이 0일 때만** 내렸다.

```
wiki 본문        4,622편 · 계열 496개
노출 0 계열        430개 / 2,066편
blog 규칙 보호      -42편
실제 아카이브      2,024편  →  잔여 2,598편
```

GSC `sc-domain:oiyo.net`, 2026-05-20~08-18, host=wiki.oiyo.net.

## 무엇이 내려갔나 — 대부분 조합격자다

| 편수 | 계열 |
|---|---|
| 144 | meaning-of-astro-moon-in-* |
| 144 | meaning-of-astro-uranus-in-* |
| 72 | meaning-of-chinese-zodiac-* |
| 66 | meaning-of-saju-stage-* |
| 60 | meaning-of-saju-stem-* |
| 24×8 | meaning-of-tarot-{four,five,six,seven,nine,ten,knight,queen}-of-* |

**행성 × 별자리**, **천간 × 지지**, **카드 × 수트**. 2026-07-14 크롤예산 조사가
scaled content abuse 위험으로 지목한 바로 그 패턴이고, 점성 조합 일부는 오늘
`7b17d2f`로 이미 noindex 상태였다 — 색인되지도 않으면서 크롤 예산만 쓰고 있었다.

## 리다이렉트가 없는 이유

**두 가지 다 해당한다.**

1. 90일 노출이 0이다. 보낼 트래픽이 없다.
2. `public/_redirects`가 **621줄로 만석**이다. 라이브 컷오프가 #622이고 그 뒤
   규칙은 에러 없이 죽는다. 규칙을 쓸 여유가 1줄뿐이라, 있어도 여기 쓰지 않는다.

## 42편을 남긴 이유

`education-{economics,business,calculus,crypto}` · `meaning-of-akashic-records`는
wiki 노출이 0이지만 **blog `_redirects`가 이쪽을 가리킨다**(blog `21a3d64a`).
내리면 그 규칙이 404를 향한다. blog 쪽 옛 URL에는 노출이 있다(economics 27,
business 21, crypto 3, akashic-records 3).

## 되살리려면

`archive/zero-impression-2026-08-19/<locale>/<slug>.mdx` 를
`src/content/blog/<locale>/` 로 되돌리면 된다. 다만 되돌리기 전에 **왜 노출이
0이었는지**를 먼저 답해야 한다 — 같은 글을 같은 자리에 돌려놓으면 결과도 같다.
