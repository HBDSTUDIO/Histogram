"use client";

import Link from "next/link";
import { useState } from "react";
import { projects, sections, siteSettings } from "@/lib/content";

function sectionId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const childProjects = (project: (typeof projects)[number]) => project.children ?? [];
  return <>
    <aside className="sidebar" aria-label="Portfolio navigation">
      <Link className="brand-link" href="/">{siteSettings.name}</Link>
      <nav className="section-nav">
        {sections.map((section) => <div className="nav-group" key={section.title}>
          <Link className="nav-heading" href={`/#${sectionId(section.title)}`}>{section.title}</Link>
          <div className="nav-projects">{projects.filter((project) => project.section === section.title).map((project) => childProjects(project).length > 0 ? <div className="nav-subgroup" key={project.slug}><Link className="nav-project-parent" href={`/project/${project.slug}`}>{project.title}</Link>{childProjects(project).map((child) => <Link href={`/project/${child.slug}`} key={child.slug}>{child.title}</Link>)}</div> : <Link href={`/project/${project.slug}`} key={project.slug}>{project.title}</Link>)}</div>
        </div>)}
        <Link className="nav-heading contact-link" href="/contact">Contact</Link>
      </nav>
    </aside>
    <div className="mobile-bar"><Link className="brand-link" href="/">{siteSettings.name}</Link><button type="button" className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Close" : "Menu"}</button></div>
    {menuOpen && <div className="mobile-menu"><div className="mobile-menu-inner"><p className="eyebrow">Index</p>{sections.map((section) => <div className="mobile-menu-group" key={section.title}><a href={`/#${sectionId(section.title)}`} onClick={() => setMenuOpen(false)}>{section.title}</a>{projects.filter((project) => project.section === section.title).map((project) => childProjects(project).length > 0 ? <div className="mobile-subgroup" key={project.slug}><Link href={`/project/${project.slug}`} onClick={() => setMenuOpen(false)}>{project.title}</Link>{childProjects(project).map((child) => <Link className="mobile-child-link" href={`/project/${child.slug}`} key={child.slug} onClick={() => setMenuOpen(false)}>{child.title}</Link>)}</div> : <Link href={`/project/${project.slug}`} key={project.slug} onClick={() => setMenuOpen(false)}>{project.title}</Link>)}</div>)}<Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></div></div>}
    {children}
  </>;
}
