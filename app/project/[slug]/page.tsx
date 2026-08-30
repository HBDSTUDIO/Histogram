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
  if (!project) return { title: siteSettings.name };
  const title = `${project.title} — ${siteSettings.name}`;
  const productionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null;
  const socialImages = productionOrigin ? [{
    url: new URL(project.cover.src, productionOrigin).toString(),
    width: project.cover.width,
    height: project.cover.height,
    alt: project.cover.alt,
  }] : [];
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.summary, images: socialImages },
    twitter: { card: "summary_large_image", title, description: project.summary, images: socialImages },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const gallery = project.images;
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
          <div><dt>Contribution</dt><dd>{project.contribution}%</dd></div>
          {project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}
        </dl>
      </section>
      <section className="project-gallery" aria-label={`${project.title} images`}>
        {gallery.map((image, index) => (
          <figure key={image.src}>
            <Image src={image.src} alt={image.alt || `${project.title} image ${index + 1}`} width={image.width} height={image.height} sizes="100vw" />
          </figure>
        ))}
      </section>
      <footer className="project-footer"><Link href="/">← All work</Link><Link href="/#contact">Contact</Link></footer>
    </main>
  );
}
