# Codex 대기분 정리 — 2026-08-18

Codex의 `agent/business-wiki-retirement` worktree(작업트리)에는 커밋되지 않은 diff만 있었다.
2026-08-11 기준(main 68bfdff)으로 만든 것이라, 그 뒤 이 세션이 wiki main을 c61ba44까지 옮기면서
같은 기준점이 낡았다. 이 폴더는 그 diff를 검토·통합하며 판단이 바뀐 부분을 기록한다.

## 세운 판정 (2026-08-18)

1. **AI 리터러시(영어 ch1~5, 일본어 ch1, 한국어 ch1~5, `education-ai-literacy` feature)**: Codex는
   삭제 대상에 넣었으나 **유지로 결정**. 90일 GSC 실측: `education-ai-literacy-ch2/3/4`(영어)가
   노출 5·평균 순위 2.0~5.5위 — 이 배치 전체에서 유일하게 1페이지권 신호가 있는 콘텐츠였다.
   wiki 사이트 전체가 클릭 1·노출 795인 상황에서 이 5회는 결코 작지 않다. **삭제 목록에서 뺐다.**
2. **삭제 방식**: Codex는 `git rm`(하드 삭제)을 썼으나, 이 저장소는 "삭제 대신 아카이브 +
   설계의도 기록" 관례를 따른다. 이번에 통합하는 항목은 전부 아카이브로 전환했다.

## 이 폴더에 아카이브한 것

- `education-business-ch19.ko.mdx`(공기업 경영학 — 글로벌 경영: 다국적기업·Hofstede)
- `education-business-ch20.ko.mdx`(공기업 경영학 — 기업윤리·CSR·ESG)

**흡수 확인**: 두 챕터의 핵심 내용(다국적기업·Hofstede 문화 차원, Carroll CSR 피라미드·ESG 투자
기준)이 blog `academy-management-core-ch11.mdx`·`ch12.mdx`에 **이미 살아 있다**(2026-08-14
Codex 배치에서 흡수·머지된 것으로 추정). GSC 90일: 두 챕터 모두 노출·클릭 0. 원본을 archive로
옮겨도 내용 자체는 blog에 남아 있으므로 순손실이 아니다.

## 이 커밋에 포함된 나머지 변경 (파일 이동 없음)

- `src/components/IntentBundles.astro`: 랜딩 퀵액세스에서 "Psychology Tests"·"Games & Puzzles"
  카드 제거. blog에서 같은 배치가 배열 자체에서 항목을 뺐다면, wiki는 `referenceBundles` 필터로
  렌더 시점에 걸러낸다(배열 자체는 유지) — 방식은 다르지만 목표는 같다.
- `public/_redirects`: 리다이렉트 대상 도메인 정정(`blog.oiyo.net` → `oiyo.net`, 여러 심리테스트
  slug) + `/cn/` 레거시 로케일 규칙 정리(→ `zh`). 오라클·AI리터러시와 경로 겹침 없음.

## 이 배치에서 하지 않은 것

- Codex가 원래 하드 삭제했던 나머지 항목(위 두 챕터 제외)은 diff에 더 없었다 — 이 worktree의
  전체 삭제 목록은 딱 이 둘 + AI리터러시(유지로 뺌) 뿐이었다.
