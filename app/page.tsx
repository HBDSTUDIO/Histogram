import Image from "next/image";
import Link from "next/link";
import { floatImages, projects, siteSettings, type Project } from "@/lib/content";
import SiteChrome from "@/components/site-chrome";

function orderedProjects() {
  return [...projects].sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999) || a.sectionOrder - b.sectionOrder || a.projectOrder - b.projectOrder);
}

function FloatingImage({ image, className }: { image: (typeof floatImages)[number]; className: string }) {
  return <div className={`floating-card ${className}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 48vw, 22vw" className="floating-image" priority /></div>;
}

function ProjectCard({ project }: { project: Project }) {
  return <Link className="index-card" href={`/project/${project.slug}`}>
    <div className="index-image-wrap"><Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="index-image" /></div>
    <span className="index-card-title">{project.title}</span>
  </Link>;
}

export default function Home() {
  const ordered = orderedProjects();
  const floatClasses = ["float-one", "float-two", "float-three", "float-four"];
  return <SiteChrome><main className="site-shell" id="top"><div className="page-content">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="hero-kicker">{siteSettings.name} {siteSettings.label}</p><h1 id="hero-title">{siteSettings.name}<br /><span>{siteSettings.label}</span></h1></div>
      <div className="hero-meta"><p>Histogram<br />{siteSettings.years}</p><p className="hero-contact">{siteSettings.email}<br />{siteSettings.instagram}</p></div>
      <svg className="histogram-line" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 330 C 80 40, 130 65, 220 300 S 390 535, 520 310 S 700 35, 800 245 S 925 425, 1010 250 S 1140 165, 1245 335" /></svg>
      <div className="floating-projects" aria-label="Personal images">{floatImages.slice(0, 4).map((image, index) => <FloatingImage image={image} className={floatClasses[index]} key={image.src} />)}</div>
    </section>
    <section className="home-index" aria-label="All projects">
      <div className="project-index">{ordered.map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
    </section>
    <footer className="home-footer"><Link href="/contact">Contact ↗</Link><a href="#top">Back to top ↑</a></footer>
  </div></main></SiteChrome>;
}
