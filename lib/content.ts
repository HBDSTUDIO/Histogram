import content from "@/data/portfolio.json";

export type PortfolioImage = { src: string; width: number; height: number; alt: string };

export type PortfolioFloat = PortfolioImage;
export type Project = {
  slug: string;
  title: string;
  section: string;
  sectionOrder: number;
  projectOrder: number;
  category: string;
  summary: string;
  year: string;
  role: string;
  contribution: number;
  client: string;
  cover: PortfolioImage;
  images: PortfolioImage[];
  wallImages: PortfolioImage[];
  wallInsertAfter: number;
  featured: boolean;
  homeOrder: number | null;
};

export type Section = { title: string; order: number; categories: string[] };
export type SiteSettings = { name: string; label: string; years: string; phone: string; email: string; instagram: string; instagramUrl: string };

const portfolio = content as {
  siteSettings: SiteSettings;
  floatImages: PortfolioFloat[];
  sections: Section[];
  projects: Project[];
};

export const siteSettings = portfolio.siteSettings;
export const floatImages = portfolio.floatImages ?? [];
export const sections = portfolio.sections;
export const projects = portfolio.projects;
