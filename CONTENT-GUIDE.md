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
- 원본은 GitHub에 올라가지 않습니다. 자동 변환된 최대 3200px, 품질 90의 WebP만 올라갑니다.
- 프로젝트 이미지 파일명에 `-wall`을 붙이면 선택형 포토월에 들어갑니다. 예: `07-wall.jpg` (안전하게 `wall-07.jpg`도 인식합니다.)
- 파일 번호 순서에서 연속된 wall 이미지끼리 각각 하나의 포토월이 됩니다. 일반 이미지가 중간에 나오면 wall이 끝나고, 다음 wall 구간은 별도의 포토월로 시작합니다.
- 예: `04-wall`~`09-wall`은 첫 번째 wall, `10`~`13`은 일반 이미지, `14-wall`~`20-wall`은 두 번째 wall입니다.
- wall 내부에서도 파일 순서를 유지하며 사진 비율은 자르지 않습니다.
- `-wall`이 없는 프로젝트에는 포토월이 생기지 않습니다.

## 하위 프로젝트(시즌/에디션)

프로젝트 폴더 안에 하위 폴더를 만들면 상위 프로젝트가 목록 페이지가 됩니다.

```text
03 RUFFNTUFF/
├── info.txt
├── 01 21 FW/
│   ├── info.txt
│   ├── 01.jpg
│   └── 02.jpg
└── 02 22 SS/
    ├── info.txt
    ├── 01.jpg
    └── 02.jpg
```

상위 프로젝트를 누르면 `21 FW`, `22 SS` 썸네일이 보이고, 각 썸네일을 누르면 해당 시즌의 상세 이미지가 열립니다. 하위 폴더의 `01.jpg`가 시즌 대표 이미지가 됩니다. 하위 폴더 안에서도 `-wall` 규칙을 그대로 사용할 수 있습니다.

## info.txt 형식

```text
제목: ROADIC
슬러그: roadic
카테고리: Lifestyle
연도: 2024
역할 및 기여도: Photography 100 / Direction 80 / Retouching 70
클라이언트: ROADIC
```

`제목`과 `슬러그`를 생략하면 폴더 이름으로 자동 생성합니다. 이미 공개한 프로젝트의 슬러그는 주소가 바뀌므로 가급적 유지합니다.
프로젝트 설명은 입력하지 않습니다. 이미지 설명도 파일 순서에 맞춰 자동 생성됩니다.
`역할 및 기여도`에는 역할과 해당 기여도를 `/`로 구분해 원하는 만큼 입력합니다. 예: `Creative director 100 / Retouching 100 / Visual identity 50`

## 배포 전 한 번만 할 일

1. GitHub Desktop 또는 `gh auth login`으로 GitHub에 로그인합니다.
2. 이 폴더를 개인 GitHub 저장소에 연결합니다.
3. Vercel에서 그 저장소를 Import하고 Production Branch를 `main`으로 둡니다.
4. 이후에는 `Publish.command`만 더블클릭합니다.

## 용량 운영 원칙

- GitHub 일반 Git 파일은 개별 100MiB를 넘길 수 없습니다.
- 이 프로젝트는 저장소 전체를 1GB 아래로 유지하는 것을 목표로 합니다.
- 원본 사진은 `portfolio-content`에만 두고 Git에는 넣지 않습니다.
- Git에는 자동 변환된 WebP만 들어갑니다. 품질 90 설정으로 디테일과 로딩 속도의 균형을 맞춥니다.
- 원본 사진의 백업은 GitHub가 아니라 별도 외장 디스크나 클라우드 드라이브를 사용합니다.
