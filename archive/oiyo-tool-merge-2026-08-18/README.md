# 정의 11종 → oiyo 도구로 301 (2026-08-18)

## 무엇을

노출이 있는 슬러그만 골랐다. 90일 GSC에서 **3회 이상 노출**된 것이고,
그 외 wiki 정의는 이 배치에 넣지 않았다.

| slug | 노출(로케일) | → oiyo |
|---|---|---|
| meaning-of-tarot | 18 (en) | /:lang/tarot/reading/ |
| meaning-of-hsp | 10 (ko) | /:lang/hsp-test/ |
| meaning-of-blood-type | 5 (ja·en·zh) | /:lang/blood-type/ |
| meaning-of-biorhythms | 4 (ja) | /:lang/biorhythm/calculator/ |
| meaning-of-saju-stage-geonrok | 4 (ko) | /:lang/saju/calculator/ |
| meaning-of-astro-mars-in-taurus | 4 (ja·ko) | /:lang/natal/chart/ |
| meaning-of-tarot-major-arcana | 3 (en) | /:lang/tarot/reading/ |
| meaning-of-tarot-eight-of-swords | 3 (ja) | /:lang/tarot/reading/ |
| meaning-of-chinese-zodiac | 3 (en) | /:lang/chinese-zodiac/ |
| meaning-of-enneagram | 3 (ko) | /:lang/enneagram/test/ |
| meaning-of-saju-ilju-byeongja | 3 (ko) | /:lang/saju/calculator/ |

66편(11 슬러그 × 6로케일) 아카이브, 규칙 22줄.

## 목적지를 섹션 루트로 잡지 않은 이유

**oiyo에는 `tarot/`·`enneagram/`·`biorhythm/`·`saju/`·`natal/` 밑에
`index.astro`가 없다.** `/ko/tarot/`로 보냈으면 전부 404가 됐다. 실재하는
페이지를 하나씩 확인해서 겨눴고, 배포 전에 8개 목적지 전부 라이브 200을 찍었다.

`chinese-zodiac`과 `blood-type`만 index가 있다.

## 등가 판정

2026-07-14 ahoxy 교훈 — **등가 아닌 곳으로 301하면 트래픽이 죽는다**(전면 301로
ahoxy -73%, 패밀리 -35%). 그래서 "wiki에 있으니 oiyo 아무 데나"가 아니라
검색 의도가 이어지는 곳인지 봤다. 타로 정의 → 타로 리딩, HSP 정의 → HSP 검사,
사주 용어 → 사주 계산기.

가장 약한 연결은 `meaning-of-astro-mars-in-taurus`(행성-별자리 조합) →
`/natal/chart/`다. 조합별 페이지가 oiyo에 없어 출생차트 도구로 보냈다.
4노출이라 잃어도 작지만, 조합 페이지가 생기면 다시 겨눠야 한다.

## 옮기지 않은 것

같은 배치에서 노출 3+ 였지만 **oiyo에 대응이 없어 보류**:
신화 13편(약 120노출) · 강의 동물학(52)·의학(17)·PM(5) ·
human-design(5) · archetypes(5) · dream(3).

**신화가 wiki에서 가장 잘 도는 콘텐츠인데 oiyo에 신화 라우트가 없다.**
목적지를 먼저 만들어야 한다. 지금 아무 데나 보내면 위 ahoxy 사고다.

## 예산

`_redirects` 577 → 599. 라이브 컷오프는 **#622**이고 그 뒤 규칙은
**에러 없이 그냥 안 걸린다**(2026-08-18 실측, 약 200줄이 그렇게 죽어 있었다).
남은 여유 **23줄**. 다음 배치는 이 파일이 아니라 다른 방법을 써야 한다.
