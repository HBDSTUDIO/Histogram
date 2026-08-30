# 로컬 폴더 사용법

`portfolio-content` 폴더가 어드민입니다. 폴더와 이미지 순서를 바꾼 뒤 `Publish.command`를 더블클릭하면 웹용 이미지 생성, 사이트 검사, GitHub 업로드가 차례로 실행됩니다. GitHub와 연결된 Vercel은 `main` 브랜치가 갱신되면 자동으로 배포합니다.

## 폴더 구조

```text
portfolio-content/
├── Float/
│   ├── 01.jpg
│   ├── 02.jpg
│   ├── 03.jpg
│   └── 04.jpg
├── 00 Main/
│   ├── 01 Quiet Hours/
│   ├── 02 Danang Notes/
│   └── 03 RUFFNTUFF/
├── 01 Personal Work/
│   └── contents/
│       ├── 01 Quiet Hours/
│       │   ├── info.txt
│       │   ├── 01.jpg
│       │   └── 02.jpg
│       └── 02 Danang Notes/
├── 02 Commercial Work/
│   └── contents/
│       └── 01 ROADIC/
│           ├── info.txt
│           ├── 01.jpg
│           └── 02.jpg
└── site.txt
```

- 앞의 `00`, `01`, `02`는 정렬 순서이며 사이트 화면에는 표시되지 않습니다.
- `00 Main`에는 홈에 띄울 프로젝트와 순서만 빈 폴더로 지정합니다. 이미지를 복사해 넣을 필요가 없습니다.
- `Float`의 `01`~`04` 이미지는 홈 장식 이미지로만 사용되며 프로젝트 링크가 없습니다.
- 프로젝트 폴더의 첫 번째 이미지가 대표 이미지가 됩니다.
- 지원 형식: JPG, JPEG, PNG, WebP, TIFF, AVIF.
- 원본은 GitHub에 올라가지 않습니다. 자동 변환된 최대 3200px, 품질 95의 WebP만 올라갑니다.
- 프로젝트 이미지 파일명에 `-wall`을 붙이면 선택형 포토월에 들어갑니다. 예: `07-wall.jpg` (안전하게 `wall-07.jpg`도 인식합니다.)
- wall 이미지는 첫 wall 이미지가 있는 위치에 하나의 자동 그리드로 배치되며, wall 내부는 사진 방향에 맞춰 재배열됩니다.
- `-wall`이 없는 프로젝트에는 포토월이 생기지 않습니다.

## info.txt 형식

```text
제목: ROADIC
슬러그: roadic
카테고리: Lifestyle
설명: 움직임이 있는 라이프스타일 제품을 차분한 프레임으로 기록.
연도: 2024
역할: Photography / Retouching
기여도: 80
클라이언트: ROADIC
이미지1설명: ROADIC 캠페인 대표 이미지
```

`제목`과 `슬러그`를 생략하면 폴더 이름으로 자동 생성합니다. 이미 공개한 프로젝트의 슬러그는 주소가 바뀌므로 가급적 유지합니다.

## 배포 전 한 번만 할 일

1. GitHub Desktop 또는 `gh auth login`으로 GitHub에 로그인합니다.
2. 이 폴더를 개인 GitHub 저장소에 연결합니다.
3. Vercel에서 그 저장소를 Import하고 Production Branch를 `main`으로 둡니다.
4. 이후에는 `Publish.command`만 더블클릭합니다.

## 용량 운영 원칙

- GitHub 일반 Git 파일은 개별 100MiB를 넘길 수 없습니다.
- 이 프로젝트는 저장소 전체를 1GB 아래로 유지하는 것을 목표로 합니다.
- 원본 사진은 `portfolio-content`에만 두고 Git에는 넣지 않습니다.
- Git에는 자동 변환된 WebP만 들어갑니다. 품질 95 설정이라 이전 품질 82보다 파일이 커질 수 있으므로 프로젝트별 이미지 용량을 확인합니다.
- 원본 사진의 백업은 GitHub가 아니라 별도 외장 디스크나 클라우드 드라이브를 사용합니다.
