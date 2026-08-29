export type Project = {
  slug: string;
  title: string;
  section: "Personal Work" | "Commercial Work";
  category: string;
  summary: string;
  year: string;
  role: string;
  contribution: number;
  cover: string;
  images: string[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "quiet-hours",
    title: "Quiet Hours",
    section: "Personal Work",
    category: "PAPILLON",
    summary: "일상의 온도와 색을 관찰하며 기록한 개인 사진 아카이브.",
    year: "2024—2026",
    role: "Photography",
    contribution: 100,
    cover: "/images/portfolio-cover.jpg",
    images: ["/images/portfolio-cover.jpg", "/images/project-2.jpg"],
    featured: true,
  },
  {
    slug: "danang-notes",
    title: "Danang Notes",
    section: "Personal Work",
    category: "Danang",
    summary: "낯선 장소의 표면과 빛을 따라간 짧은 여행 기록.",
    year: "2025",
    role: "Photography / Editing",
    contribution: 100,
    cover: "/images/project-3.jpg",
    images: ["/images/project-3.jpg", "/images/project-4.jpg"],
    featured: true,
  },
  {
    slug: "ruffntuff",
    title: "RUFFNTUFF",
    section: "Commercial Work",
    category: "Fashion",
    summary: "브랜드의 질감과 움직임을 이미지 언어로 정리한 캠페인.",
    year: "2025",
    role: "Photography / Content Direction",
    contribution: 70,
    cover: "/images/project-5.jpg",
    images: ["/images/project-5.jpg", "/images/project-6.jpg"],
    featured: true,
  },
  {
    slug: "wisetable",
    title: "Wisetable",
    section: "Commercial Work",
    category: "Food",
    summary: "제품의 재료감과 사용 장면을 담은 콘텐츠 시리즈.",
    year: "2024",
    role: "Photography",
    contribution: 60,
    cover: "/images/project-4.jpg",
    images: ["/images/project-4.jpg", "/images/project-2.jpg"],
    featured: true,
  },
  {
    slug: "roadic",
    title: "ROADIC",
    section: "Commercial Work",
    category: "Lifestyle",
    summary: "움직임이 있는 라이프스타일 제품을 차분한 프레임으로 기록.",
    year: "2024",
    role: "Photography / Retouching",
    contribution: 80,
    cover: "/images/project-6.jpg",
    images: ["/images/project-6.jpg", "/images/project-3.jpg"],
    featured: false,
  },
];

export const sections = [
  { title: "Personal Work", categories: ["Danang", "USA", "PAPILLON"] },
  { title: "Commercial Work", categories: ["RUFFNTUFF", "ROADIC", "Wisetable", "Beauty", "Fashion", "Lifestyle", "Food"] },
];

export const siteSettings = {
  name: "Park Hojun",
  label: "Portfolio",
  years: "2020 to 2026",
  phone: "+82 10 0000 0000",
  email: "hello@parkhojun.com",
  instagram: "@parkhojun",
  instagramUrl: "https://instagram.com/",
};
