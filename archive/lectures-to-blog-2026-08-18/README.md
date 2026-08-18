# 강의 10과목 248편 → blog (2026-08-18)

## 파일이 없는 이유

blog로 옮겼기 때문이다 — `blog/src/content/blog/{en,ja,ko}/education-*.mdx`,
blog `4d144de2`. 사본을 여기 또 두지 않는다.

## 무엇을, 왜

wiki 강의는 **73과목 1,041편**이다. 그중 **blog에 대응 과목이 없으면서 노출이
있는 10과목**만 옮겼다.

| 과목 | 편수 | 90일 노출 |
|---|---|---|
| zoology | 30 | 53 |
| medicine | 28 | 17 |
| nursing | 39 | 15 |
| music-history | 42 | 10 |
| financial-engineering | 36 | 5 |
| ai-literacy | 11 | 5 |
| actuarial-science | 30 | 4 |
| advanced-bonds | 25 | 3 |
| geology | 3 | 3 |
| urban-planning | 4 | 3 |

es/fr/zh에는 애초에 없었다. en/ja/ko 뿐이다.

**충돌 오판을 피하려고 blog 167과목과 대조했다.** 문자열만 보면 겹쳐 보이는 둘이
실제로는 다른 것이었다 — `academy-bonded-clerk-exam`은 **보세사**지 채권 심화가
아니고, `ai-literacy-future-skills`는 매거진 1편이지 11장짜리 강좌가 아니다.

## 옮길 수 있었던 진짜 이유 — 컴포넌트

이 강의들은 MDX 컴포넌트를 쓴다(`LectureTable` 95회 · `LectureProcess` 59 ·
`Callout` 40 · 차트 31). **blog에 같은 게 이미 있어서** 옮길 수 있었다:

```
src/components/mdx/Callout.astro                        양쪽 존재
src/features/education-common/components/LectureVisuals 양쪽 존재, export 4개 일치
src/features/education-ai-literacy (PromptPlayground)   양쪽 존재
```

없었으면 본문이 조용히 깨졌을 것이다. 빌드에서 `education-zoology-ch2`가 실제
`<table>`을 뱉는 것까지 확인했다.

## 파일명을 academy-* 로 바꾸지 않은 이유

blog 관례는 `academy-*`지만 `education-*`을 유지했다. **접두사가 같아야
`/:lang/education-<과목>-*` 두 줄로 과목 전체를 리다이렉트할 수 있기 때문이다.**
장별로 걸면 약 500줄인데 이 파일은 그만큼 못 받는다.

## ⚠️ 예산이 끝났다

```
규칙 601 → 621.  라이브 컷오프 #622.  남은 여유 1줄.
```

**다음 이주는 `_redirects`를 쓸 수 없다.** 남은 선택지는

1. blog에서 쓰는 `OiyoCanonicalRedirect` 식 **페이지 스텁** (규칙 0줄, 대신
   URL이 살아 있어 색인이 안 줄어든다)
2. 노출 0인 것은 **리다이렉트 없이 아카이브**(404) — 지금까지 4,137 URL에 이미
   이렇게 했다
3. 컷오프 원인 규명 — 2026-08-12에 "반복 배포 비용 대비 무가치"로 **하지 않기로
   결정**했다

## 미검증 와일드카드

myth 블록과 같은 **세그먼트 중간 splat**이다. 배포 후 함께 찍어야 한다.

```bash
cb=$RANDOM
curl -s -o /dev/null -w '%{http_code}\n' "https://wiki.oiyo.net/ko/education-zoology-ch2/?cb=$cb"
curl -s -o /dev/null -w '%{http_code}\n' "https://wiki.oiyo.net/ko/meaning-of-myth-imugi/?cb=$cb"
```

404면 와일드카드를 버리고 상위 슬러그 개별 규칙으로 바꾼다 — 그런데 **여유가
1줄뿐이라 그 대체도 불가능하다.** 그 경우 스텁 방식으로 가야 한다.
