# Sanity 어드민 연결

현재 프론트는 `lib/content.ts`의 샘플 데이터로 동작한다. Sanity 프로젝트를 만든 뒤 아래 스키마를 Studio에 등록하고, 프론트의 데이터 조회 함수만 Sanity GROQ 쿼리로 교체하면 된다.

## 연결 순서

1. Sanity 계정을 만든다.
2. 새 프로젝트를 만들고 이 폴더의 `schemaTypes`를 복사한다.
3. Studio에서 `Section`, `Category`, `Project`, `Site settings`를 만든다.
4. 이미지와 대표 이미지를 업로드한다.
5. `featuredOnHome`과 `homeOrder`로 홈 이미지를 선택·정렬한다.
6. Preview 후 Publish한다.
7. 프론트 환경 변수에 `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`을 추가한다.
8. Sanity Publish webhook이 프론트의 revalidation endpoint를 호출하게 한다.

## 이미지 원칙

- `hotspot`은 사용하지 않는다.
- 본문은 이미지의 원본 종횡비를 그대로 렌더링한다.
- 대표 썸네일도 `contain`을 기본값으로 사용한다.
- 이미지마다 alt 텍스트를 입력한다.

프론트와 Sanity 계정 연결은 운영자 계정과 프로젝트 ID가 필요하므로 다음 단계에서 진행한다. 계정 비밀번호나 API 토큰은 채팅으로 보내지 않는다.
