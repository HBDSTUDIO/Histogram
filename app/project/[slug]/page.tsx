import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, siteSettings } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project ? `${project.title} — ${siteSettings.name}` : siteSettings.name };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const gallery = [project.cover, ...(project.gallery ?? [])];
  return (
    <main className="project-page">
      <header className="project-header">
        <Link className="brand-link" href="/">{siteSettings.name}</Link>
        <Link className="back-link" href="/">Back to index ↗</Link>
      </header>
      <section className="project-intro">
        <div>
          <p className="eyebrow">{project.section} / {project.category}</p>
          <h1>{project.title}</h1>
          <p className="project-summary">{project.summary}</p>
        </div>
        <dl className="project-facts">
          <div><dt>Year</dt><dd>{project.year}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Contribution</dt><dd>{project.contribution}</dd></div>
          {project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}
        </dl>
      </section>
      <section className="project-gallery" aria-label={`${project.title} images`}>
        {gallery.map((src, index) => (
          <figure key={`${src}-${index}`}>
            <Image src={src} alt={index === 0 ? `${project.title} cover` : `${project.title} image ${index + 1}`} width={1600} height={1200} sizes="100vw" />
          </figure>
        ))}
      </section>
      <footer className="project-footer"><Link href="/">← All work</Link><a href="#contact">Contact</a></footer>
    </main>
  );
}
