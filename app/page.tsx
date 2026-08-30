"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, sections, siteSettings, type Project } from "@/lib/content";

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
}

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Portfolio navigation">
      <Link className="brand-link" href="/">{siteSettings.name}</Link>
      <nav className="section-nav">
        {sections.map((section) => (
          <div className="nav-group" key={section.title}>
            <Link className="nav-heading" href={`/#${sectionId(section.title)}`}>
              {section.title}
            </Link>
            <div className="nav-projects">
              {projects.filter((project) => project.section === section.title).map((project) => (
                <Link href={`/project/${project.slug}`} key={project.slug}>{project.title}</Link>
              ))}
            </div>
          </div>
        ))}
        <a className="nav-heading contact-link" href="#contact">Contact</a>
      </nav>
    </aside>
  );
}

function FloatingProject({ project, className }: { project: Project; className: string }) {
  return (
    <Link className={`floating-card ${className}`} href={`/project/${project.slug}`} aria-label={`View ${project.title}`}>
      <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 767px) 56vw, 22vw" className="floating-image" priority={project.featured} />
      <span className="floating-caption"><span>{project.title}</span><small>{project.category}</small></span>
    </Link>
  );
}

function IndexSection({ title, number, items }: { title: string; number: string; items: typeof projects }) {
  return (
    <section className="index-section" id={sectionId(title)} aria-labelledby={`${number}-title`}>
      <div className="index-heading"><p className="eyebrow">{number}</p><h2 id={`${number}-title`}>{title}</h2></div>
      <div className="project-index">
        {items.map((project) => (
          <Link className="index-card" href={`/project/${project.slug}`} key={project.slug}>
            <div className="index-image-wrap"><Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 767px) 100vw, 38vw" className="index-image" /></div>
            <div className="index-card-meta"><span>{project.title}</span><span>{project.category}</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProjects = projects.filter((project) => project.featured).sort((a, b) => (a.homeOrder ?? 9999) - (b.homeOrder ?? 9999)).slice(0, 4);
  const floatingClasses = ["float-one", "float-two", "float-three", "float-four"];
  return (
    <main className="site-shell">
      <Sidebar />
      <div className="mobile-bar"><Link className="brand-link" href="/">{siteSettings.name}</Link><button type="button" className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Close" : "Menu"}</button></div>
      {menuOpen && <div className="mobile-menu" id="mobile-menu"><div className="mobile-menu-inner"><p className="eyebrow">Index</p>{sections.map((section) => <div className="mobile-menu-group" key={section.title}><a href={`#${sectionId(section.title)}`} onClick={() => setMenuOpen(false)}>{section.title}</a>{projects.filter((project) => project.section === section.title).map((project) => <Link href={`/project/${project.slug}`} key={project.slug} onClick={() => setMenuOpen(false)}>{project.title}</Link>)}</div>)}<a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></div></div>}
      <div className="page-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow">{siteSettings.label} / {siteSettings.years}</p><h1 id="hero-title">{siteSettings.name}<br /><span>{siteSettings.label}</span></h1></div>
          <div className="hero-meta"><p>Histogram<br />{siteSettings.years}</p><p className="hero-contact">{siteSettings.email}<br />{siteSettings.instagram}</p></div>
          <svg className="histogram-line" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 330 C 80 40, 130 65, 220 300 S 390 535, 520 310 S 700 35, 800 245 S 925 425, 1010 250 S 1140 165, 1245 335" /></svg>
          <div className="floating-projects" aria-label="Featured projects">{featuredProjects.map((project, index) => <FloatingProject project={project} className={floatingClasses[index]} key={project.slug} />)}</div>
        </section>
        {sections.map((section, index) => <IndexSection title={section.title} number={String(index + 1).padStart(2, "0")} items={projects.filter((project) => project.section === section.title)} key={section.title} />)}
        <footer className="site-footer" id="contact"><div><p className="eyebrow">Contact</p><h2>Let&apos;s make<br />something clear.</h2></div><div className="footer-details"><a href={`tel:${siteSettings.phone.replaceAll(" ", "")}`}>{siteSettings.phone}</a><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">{siteSettings.instagram}</a></div></footer>
      </div>
    </main>
  );
}
