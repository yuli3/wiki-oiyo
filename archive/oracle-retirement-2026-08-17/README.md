# 오라클 원문 전량 퇴장 — 2026-08-17

세운 지시: "오라클 카드뽑기, 오라클 글귀, 노자 등 조언이 되는 글귀, 텍스트들은 아카이브로 옮기기."

같은 날 앞 배치에서 오라클 400(스토아 100) · 속담 20 · 손자병법 13을 이미 접었고
(`archive/content-prune-2026-08-17/`), 이번에 **남은 전량**을 접었다.

| 폴더 | 편수 | 내용 |
|---|--:|---|
| `oracle-300/` | 300 | 발타자르 그라시안 처세 잠언 |
| `oracle-laozi/` | 18 | 노자 도덕경 |
| `oracle-sages-hub.mdx` | 1 | 현인의 카드 허브 |

앞 배치 133편과 합쳐 **오라클 계열 452편 전부**가 wiki에서 빠졌다. `src/content/blog/*/oracle-*.mdx` 잔여 0.

## 왜 전부 접었나

- **실측(GSC 90일)**: 오라클 계열 전체가 노출 24 · 클릭 0. wiki 사이트 전체가 클릭 1 · 노출 781인 규모에서도 눈에 띄지 않는다.
- **구조**: 잠언 한 줄이 한 URL을 차지하는 형태라 URL은 452개를 먹는데 개별 검색 수요가 없다. 크롤 예산 반전 판정(병목=콘텐츠가 아니라 색인)에서 정확히 줄여야 할 형태다.
- **제품**: 실행층이던 oiyo `/oracle/draw`·`/oracle/sages`가 타로와 역할이 겹쳐 함께 접혔다. 읽을 원문만 남기면 향할 곳이 없다.

## 같이 바뀐 것

- `data/catalog/category-registry.yaml`에서 `oracle-300`·`oracle-laozi` 제거 → `npm run sync:category-registry` 재생성. 앞 배치의 5건과 합쳐 **67 → 60 카테고리**.
- `mystic-trinity.json`(wiki 사본)에서 `oracle` 토픽 제거, `MysticTrinity.astro`의 oracle 추론 제거.

## 검증

type-check 0 errors(624 files) · build **8,942 pages**(앞 배치 9,346에서 404 감소 = 오라클 319편 + 카테고리/페이지네이션).

## 되돌리려면

`git mv archive/oracle-retirement-2026-08-17/oracle-300/*.mdx src/content/blog/ko/` 식으로 되돌리고,
카테고리 레지스트리 항목을 복구한 뒤 `npm run sync:category-registry`를 다시 돌린다.
oiyo 쪽 실행층(`oiyo/archive/oracle-retirement-2026-08-17/`)도 함께 복구해야 허브가 성립한다.
