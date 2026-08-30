import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, siteSettings, type PortfolioImage } from "@/lib/content";
import SiteChrome from "@/components/site-chrome";

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: siteSettings.name };
  return { title: `${project.title} — ${siteSettings.name}`, description: project.summary };
}

function GalleryImage({ image }: { image: PortfolioImage }) {
  return <figure><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" /></figure>;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const before = project.images.slice(0, project.wallInsertAfter);
  const after = project.images.slice(project.wallInsertAfter);
  return <SiteChrome><main className="project-page" id="top"><div className="page-content">
    <header className="project-header"><Link className="back-link" href="/">Back to index ↗</Link></header>
    <section className="project-intro"><div><p className="eyebrow">{project.section} / {project.category}</p><h1>{project.title}</h1><p className="project-summary">{project.summary}</p></div><dl className="project-facts"><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Contribution</dt><dd>{project.contribution}%</dd></div>{project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}</dl></section>
    <section className="project-gallery" aria-label={`${project.title} images`}>
      {before.map((image) => <GalleryImage image={image} key={image.src} />)}
      {project.wallImages.length > 0 && <div className="photo-wall" aria-label={`${project.title} photo wall`}>{project.wallImages.map((image) => <GalleryImage image={image} key={image.src} />)}</div>}
      {after.map((image) => <GalleryImage image={image} key={image.src} />)}
    </section>
    <footer className="project-footer"><Link href="/">← All work</Link><Link href="/contact">Contact</Link><a href="#top">Back to top ↑</a></footer>
  </div></main></SiteChrome>;
}
