import Image from "next/image";
import Link from "next/link";
import { projects, sections, siteSettings } from "@/lib/content";

function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Portfolio navigation">
      <Link className="brand-link" href="/">{siteSettings.name}</Link>
      <nav className="section-nav">
        {sections.map((section) => (
          <div className="nav-group" key={section.title}>
            <Link className="nav-heading" href={`/#${section.title.toLowerCase().replaceAll(" ", "-")}`}>
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

function FloatingProject({ slug, className }: { slug: string; className: string }) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;
  return (
    <Link className={`floating-card ${className}`} href={`/project/${project.slug}`} aria-label={`View ${project.title}`}>
      <Image src={project.cover} alt="" fill sizes="(max-width: 767px) 56vw, 22vw" className="floating-image" priority={project.featured} />
      <span className="floating-caption"><span>{project.title}</span><small>{project.category}</small></span>
    </Link>
  );
}

function IndexSection({ title, number, items }: { title: string; number: string; items: typeof projects }) {
  return (
    <section className="index-section" id={title.toLowerCase().replaceAll(" ", "-")} aria-labelledby={`${number}-title`}>
      <div className="index-heading"><p className="eyebrow">{number}</p><h2 id={`${number}-title`}>{title}</h2></div>
      <div className="project-index">
        {items.map((project) => (
          <Link className="index-card" href={`/project/${project.slug}`} key={project.slug}>
            <div className="index-image-wrap"><Image src={project.cover} alt="" fill sizes="(max-width: 767px) 100vw, 38vw" className="index-image" /></div>
            <div className="index-card-meta"><span>{project.title}</span><span>{project.category}</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const personal = projects.filter((project) => project.section === "Personal Work");
  const commercial = projects.filter((project) => project.section === "Commercial Work");
  return (
    <main className="site-shell">
      <Sidebar />
      <div className="mobile-bar"><Link className="brand-link" href="/">{siteSettings.name}</Link><a href="#menu" className="menu-toggle">Menu</a></div>
      <div className="page-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow">{siteSettings.label} / {siteSettings.years}</p><h1 id="hero-title">Park Hojun<br /><span>Portfolio</span></h1></div>
          <div className="hero-meta"><p>Histogram<br />{siteSettings.years}</p><p className="hero-contact">{siteSettings.email}<br />{siteSettings.instagram}</p></div>
          <svg className="histogram-line" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 330 C 80 40, 130 65, 220 300 S 390 535, 520 310 S 700 35, 800 245 S 925 425, 1010 250 S 1140 165, 1245 335" /></svg>
          <div className="floating-projects" aria-label="Featured projects"><FloatingProject slug="quiet-hours" className="float-one" /><FloatingProject slug="danang-notes" className="float-two" /><FloatingProject slug="ruffntuff" className="float-three" /><FloatingProject slug="wisetable" className="float-four" /></div>
        </section>
        <IndexSection title="Personal Work" number="01" items={personal} />
        <IndexSection title="Commercial Work" number="02" items={commercial} />
        <footer className="site-footer" id="contact"><div><p className="eyebrow">Contact</p><h2>Let&apos;s make<br />something clear.</h2></div><div className="footer-details"><a href={`tel:${siteSettings.phone.replaceAll(" ", "")}`}>{siteSettings.phone}</a><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">{siteSettings.instagram}</a></div></footer>
      </div>
    </main>
  );
}
