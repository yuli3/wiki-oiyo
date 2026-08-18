# 조합격자 1,806편 → oiyo 도구로 301 (2026-08-19)

## 무엇을

| 편수 | 계열 | → oiyo |
|---|---|---|
| 354 | meaning-of-saju-ilju-* (60갑자) | /saju/calculator/ |
| 138~144 ×8 | meaning-of-astro-{sun,mercury,venus,mars,jupiter,saturn,neptune,pluto}-in-* | /natal/chart/ |
| 72 | meaning-of-saju-branch-* | /saju/calculator/ |
| 60 | meaning-of-saju-god-* | /saju/calculator/ |
| 168 | meaning-of-tarot-* (카드 전체) | /tarot/reading/ |

규칙 15줄. `/:lang/<계열>*` 하나가 6로케일 × 계열 전체를 덮는다.

## 왜 blog가 아니라 oiyo인가

앞선 배치에서 신화 606편과 강의 862편은 **blog로 옮겼다.** 이건 옮기지 않고
**도구로 보냈다.** 이유가 다르다.

1. **이건 격자다.** 행성 × 별자리, 천간 × 지지, 카드 × 수트. 2026-07-14 크롤예산
   조사가 scaled content abuse 위험으로 지목한 형태이고, 점성 격자 일부는 이미
   noindex였다(`7b17d2f`). **광고 도메인으로 옮기면 그 부담을 수익 내는 쪽에
   그대로 이식한다.**
2. **blog 빌드가 못 받는다.** blog는 오늘 10,304 페이지에서 heap OOM으로 죽었고
   (`670579b9`에서 페이지네이션을 줄여 9,138로 내렸다), 여기에 1,806편을 더하면
   다시 그 위로 간다.
3. **검색 의도가 도구로 이어진다.** "병자일주 해석"은 사주 계산기가, "화성
   황소자리"는 출생차트가 답한다. 오늘 개별 슬러그
   (`meaning-of-saju-ilju-byeongja` 등)에 이미 같은 판정을 내렸다 —
   `../oiyo-tool-merge-2026-08-18/`.

배포 전에 목적지 3개가 전부 라이브 200임을 확인했다.

## 스트레이 하나

`meaning-of-tarot-wheel-of-fortune`은 24편 미만이라 격자 판정에서 빠졌는데,
`meaning-of-tarot*` 규칙이 삼키는 자리에 있었다. **리다이렉트되면서 페이지도
남아 있는 상태**를 만들지 않으려고 같은 배치에 넣었다. 같은 타로 카드다.

## 남은 wiki

```
문서        1,984편 → 178편
사이트맵 URL   450 →  120     (2026-08-18 아침 4,530)
빌드 페이지  4,194 → 1,908
```

남은 178편은 격자가 아닌 실제 사전 항목이다 — `meaning-of-akashic-records`,
`big5`, `burnout`, `circadian-rhythm`, `attachment-theory` 등. **wiki가 원래
하기로 한 일**(정의)만 남았다.
