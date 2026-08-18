# 경제 갈림길 · 연금 부자 — blog에 정본이 있어 wiki에서 내림 (2026-08-18)

## 왜

wiki와 blog가 **같은 시리즈를 각자 갖고 있었다.** 제목을 한 편씩 대조해
확인했다(정규화 후 유사도 0.6 이상을 중복으로 판정).

| 시리즈 | wiki | blog | 중복 |
|---|---|---|---|
| 경제 갈림길 / crossroads-economy | 20편 | 18편 | 18/18 일치 |
| 연금 부자 / pension-rich | 8편 | 8편 | 8/8 일치 |

blog 쪽이 정본이다. 광고를 싣는 도메인이고, 제목·설명이 더 다듬어져 있다
(예: wiki `은퇴 자금, 얼마나 필요할까?` → blog `은퇴 자금 얼마나 필요할까 —
현실적인 3억 vs …`). blog에는 `pension-irp-tax-refund`,
`pension-tax-credit-calculator` 같은 도구 글도 붙어 있어 시리즈가 더 두껍다.

## 리다이렉트를 걸지 않은 이유

이 28편의 90일 GSC **노출이 0**이다. wiki `_redirects`는 규칙 #622에서 잘리고
현재 577줄이라 여유가 45줄뿐인데, 노출 0인 URL에 그 예산을 쓰지 않는다.
예산은 노출 3 이상인 40개 슬러그에 쓴다. → [[feedback_cloudflare_redirects_limit]]

## wiki에만 있던 2편은 blog로 옮겼다

`econ-crossroads-prologue` · `econ-crossroads-epilogue` 는 blog에 대응이 없었다.
버리지 않고 `blog/src/content/blog/ko/crossroads-economy-{prologue,epilogue}.mdx`
로 이식했다. frontmatter 변환: `track: academy → magazine`,
`category: 경제 갈림길 → "Finance"`, `series: econ-crossroads → crossroads-economy`,
`chapter` 제거.

`chapter`를 뺀 것은 blog 시리즈가 이미 1~18로 차 있어 0을 넣을 수 없기 때문이다
(스키마가 `positive` 정수만 받는다). 18편을 전부 +1 하는 대신 **번호 없는 시리즈
구성원**으로 두었다 — blog에 이미 series는 있고 chapter는 없는 글이 35편 있다.

## 되살리려면

이 폴더의 mdx를 `src/content/blog/ko/`로 되돌리면 된다. 다만 되살리기 전에
blog 쪽 정본을 먼저 지워야 한다 — 그러지 않으면 중복이 그대로 돌아온다.
