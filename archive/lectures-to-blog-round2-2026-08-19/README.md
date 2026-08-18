# 강의 전량 이관 완료 — 20과목 614편 → blog (2026-08-19)

## 파일이 없는 이유

blog로 옮겼다 — `blog/src/content/blog/*/education-*.mdx`, blog `3bec4935`.
**이로써 wiki에 `education-*` 문서는 0편이다.**

1차(2026-08-18 `8456f70`)에서 blog에 대응이 없고 노출이 있는 10과목 248편을
옮겼고, 이번에 나머지 20과목 614편을 마저 옮겼다.

## 왜 전부 옮겼나

세운 방침(2026-08-18): **wiki는 축소하고 수익은 oiyo·blog·game에서 낸다.**
wiki는 광고를 싣지 않는다. 강의는 편당 분량이 있고 체류가 긴 콘텐츠라 광고
도메인에 있는 편이 맞다.

| 과목 | 편수 | | 과목 | 편수 |
|---|---|---|---|---|
| economics | 78 | | history-everywhere | 29 |
| psychology | 58 | | pm | 25 |
| business | 58 | | technical-analysis | 25 |
| accounting | 45 | | crypto | 25 |
| english-grammar | 45 | | law | 24 |
| public-admin | 45 | | cs | 22 |
| finance | 38 | | behavioral-economics | 6 |
| art-psychotherapy | 33 | | biology·food-nutrition·calculus·economics-math | 각 4 |
| statistics | 30 | | business-scholars + economics-ch25_29 계열 | 12 |

## 중복이 아님을 먼저 확인했다

과목 **이름**이 아니라 **챕터 제목**을 blog academy 167과목과 대조했다.
전 쌍이 유사도 0.45 미만이다 — wiki `education-economics`는 blog
`academy-economics-core`가 아니고, `education-statistics`는
`statistics-basics`가 아니다. 이름만 보고 합쳤으면 다른 강좌를 지웠을 것이다.

(반대로 `경제 갈림길`·`연금 부자`는 제목이 순서까지 일치해서 **중복으로 판정하고
blog 것을 남겼다** → `../dup-blog-merge-2026-08-18/`)

## 빌드가 한 번 막혔다

첫 시도가 `es/education-psychology-ch3.mdx`의 미해결 import로 실패했다 —
`@/components/content/academy/CognitiveDissonanceLab`이 blog에 없었다.
1차 이관 때는 컴포넌트를 대조했는데 이번 배치에서 그 단계를 건너뛴 것이 원인이다.
해당 컴포넌트를 wiki에서 복사했다. 나머지 40여 개 import는 blog에 이미 있었다.

**교훈: repo 간 MDX 이동은 본문이 아니라 import가 결정한다.**

## 리다이렉트

과목당 **1줄**이다. `/:lang/education-<과목>*` 의 splat이 맨끝 경로와 슬래시
버전을 **둘 다** 잡는다(`4ae617b`에서 291쌍을 접으며 확인).

```
wiki 규칙 318 → 338 · 컷오프 #622 까지 여유 284
```

이 여유는 같은 커밋 직전에 만든 것이다. 파일이 621줄로 만석이라 이 이관이
아예 불가능했는데, 슬래시 중복 291쌍을 접고 완전 중복 12줄을 지워 303줄을
되찾았다.

## blog 쪽 규칙 5줄도 지웠다

`/:lang/education-{economics,business,public-admin,calculus,crypto}-*` 가
blog → wiki 를 가리키고 있었다. 이제 blog가 그 문서를 직접 갖고 있으므로
**옛 blog URL이 리다이렉트 대신 실제 페이지가 된다.** 그 URL들에는 노출이 있었다
(economics 27, business 21).

## 현재 wiki 규모

```
사이트맵 URL   4,530 (08-18 아침)  →  450
빌드 페이지     8,762            →  4,194
```
