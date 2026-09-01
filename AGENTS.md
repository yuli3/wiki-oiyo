# Wiki 작업 규칙

시작·안전·승인 계약은 `/Users/seuncho/coding/AGENTS.md`, 현재 작업은 `/Users/seuncho/coding/company-brain/NOW.md`를 따른다.

## 역할·콘텐츠

- 출처 있는 참고 지식과 개념 연결을 다룬다. 정의/설명이라는 형식만으로 Wiki를 owner로 선택하지 않는다. 기존 canonical을 보존하고 이관은 route/topic 정본에 근거를 기록한다.
- 폐기된 courses/magazine/interactive 공개 허브를 복원하지 않는다. 남아 있는 콘텐츠의 track 메타데이터와 공개 허브 존재는 별개다.
- 새 MDX는 `data/catalog/content-inventory.master.csv` 행과 함께 변경한다. 새 카테고리는 `data/catalog/category-registry.yaml`을 먼저 갱신한다.
- 기존 track별 스키마를 보존한다: academy의 series/chapter, magazine의 제한된 컴포넌트 범위, interactive의 읽기 우선 산문. interactive 첫 컴포넌트 전 산문 400자 기준에서 제목·import·표·컴포넌트는 제외한다.
- 실제 콘텐츠가 있는 로케일만 hreflang에 포함하고 `availableLocales`를 하드코딩으로 우회하지 않는다. 불확실한 확장·이관 후보는 보류한다.

## 렌더링

- 이 저장소의 `src/lib/mdx-component-registry.ts`를 사용한다. Blog 레지스트리를 수정해 Wiki 기능을 바꾸려 하지 않는다.
- route에서 MDX 컴포넌트를 직접 확장하지 않는다. magazine 허용 범위는 좁게 유지하고 legacy bridge는 실제 필요할 때만 쓴다.
- 이미지 위주 구조를 강요하지 않는다. 두 번째 이후 island는 `client:visible`, 사용자 입력 HTML은 DOMPurify 등으로 정화한다.

## 검증

- 기본: `npm run type-check`, `npm run validate:i18n`, `npm run verify:harness`, `npm run build`.
- 카테고리는 `npm run check:category-registry`, 해당 콘텐츠 변경은 `npm run audit:magazine-compat`·`npm run validate:personality`를 추가한다. 빌드 후 내부 링크·schema·canonical도 검증한다.
- 실행 명령은 package.json, 콘텐츠 현황은 catalog, 계획은 NOW가 정본이다. 오래된 페이지 수·배포 준비 상태를 이 파일에 저장하지 않는다.

- `public/_headers`를 건드리면 `npm run audit:headers-collision`을 함께 돌린다. **Cloudflare Pages는 매칭되는 규칙을 전부 적용하고 같은 헤더를 이어 붙인다**(교체가 아니다). 넓은 규칙(`/*`)에 Cache-Control을 두면 자산별 정책과 충돌해 `max-age`가 두 개인 헤더가 나가고, RFC 9111이 반복 지시어 처리를 구현에 맡기므로 실효 정책이 모호해진다. 2026-09-01에 다섯 사이트 전부 그 상태였고 해시 자산의 1년 불변 캐시가 무효화돼 있었다. 캐시 정책은 좁은 경로에만 건다. 스크립트 정본은 `shared/scripts/`다.
