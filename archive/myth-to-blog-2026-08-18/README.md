# 신화 인물 사전 101종 → blog (2026-08-18)

## 파일이 없는 이유

이 폴더에는 mdx가 없다. **버린 게 아니라 blog로 옮겼기 때문이다** —
`blog/src/content/blog/{en,es,fr,ja,ko,zh}/meaning-of-myth-*.mdx`, blog `88854d2a`.
606편 전부 그대로 있다. 여기 사본을 또 두면 같은 글이 두 repo에 남는다.

## 왜 옮겼나

**신화는 wiki에서 가장 잘 도는 콘텐츠다.** 90일 GSC에서 26개 슬러그가 145노출로,
wiki의 어떤 묶음보다 많다.

```
31  meaning-of-myth-imugi          9  meaning-of-myth-thanatos
22  meaning-of-myth-sif            7  meaning-of-myth-ungnyeo
21  meaning-of-myth-jeoseung-saja  6  meaning-of-myth-horus / sansin
```

그런데 **wiki는 광고를 싣지 않는다.** 세운 방침(2026-08-18): wiki를 축소하고
수익은 oiyo·blog·game에서 낸다. 그래서 가장 잘 도는 것을 광고가 있는 쪽으로
보냈다.

## frontmatter 변환

| wiki | blog | 이유 |
|---|---|---|
| `track: dictionary` | `magazine` | blog enum에 dictionary가 없다 |
| `category: Mysticism` | `Mythology` | 더 정확하고, blog 6로케일 전부에 이름이 있다 |
| `series: "신화 인물 사전"` | `myth-dictionary` | 한국어 series id는 나머지 5로케일에 그대로 노출된다 |

`definition`·`reviewer`·`reviewedDate`는 남겼다. blog 스키마가 선언하지 않아
Zod가 렌더 데이터에서 떼어내지만 파일에는 남는다 — **두 repo를 통틀어 reviewer가
있는 글은 이것뿐이라** 버릴 이유가 없다.

## 리다이렉트 — 규칙 2줄, 그리고 미검증

```
/:lang/meaning-of-myth-*   https://blog.oiyo.net/:lang/meaning-of-myth-:splat  301
/:lang/meaning-of-myth-*/  https://blog.oiyo.net/:lang/meaning-of-myth-:splat/ 301
```

슬러그마다 걸면 202줄인데 **이 파일은 규칙 #622에서 죽는다**(2026-08-18 실측,
그 뒤 약 200줄이 에러 없이 안 걸리고 있었다). 601줄인 지금 202줄은 불가능하다.

⚠️ **이 와일드카드는 검증되지 않았다.** splat이 세그먼트 중간
(`meaning-of-myth-*`)에 있는 형태이고, Cloudflare 문서는 경로 **끝**의 `*`만
설명한다. 배포 후 캐시버스터를 붙여 찍어야 한다:

```bash
curl -s -o /dev/null -w '%{http_code}' "https://wiki.oiyo.net/ko/meaning-of-myth-imugi/?cb=$RANDOM"
```

**404가 나오면** 이 두 줄을 지우고 노출 상위 10개 슬러그에 개별 규칙을 건다
(20줄, 여유 21줄 안). → [[feedback_cloudflare_redirects_limit]]
