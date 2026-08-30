import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { projects, siteSettings, type GalleryBlock, type PortfolioImage, type Project } from "@/lib/content";
import SiteChrome from "@/components/site-chrome";

function flatten(items: Project[]): Project[] { return items.flatMap((item) => [item, ...flatten(item.children ?? [])]); }
const allProjects = flatten(projects);

export function generateStaticParams() { return allProjects.map((project) => ({ slug: project.slug.split("/") })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug.join("/"));
  if (!project) return { title: siteSettings.name };
  return { title: `${project.title} — ${siteSettings.name}`, description: `${project.title} portfolio project` };
}

function GalleryImage({ image }: { image: PortfolioImage }) { return <figure><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="100vw" unoptimized={image.animated} /></figure>; }

function legacyBlocks(project: Project): GalleryBlock[] {
  const before = project.images.slice(0, project.wallInsertAfter);
  const after = project.images.slice(project.wallInsertAfter);
  return [
    ...before.map((image) => ({ type: "image" as const, images: [image] })),
    ...(project.wallImages.length ? [{ type: "wall" as const, images: project.wallImages }] : []),
    ...after.map((image) => ({ type: "image" as const, images: [image] })),
  ];
}

function wallRows(images: PortfolioImage[], targetRatio: number) {
  const rows: PortfolioImage[][] = [];
  let row: PortfolioImage[] = [];
  let ratio = 0;
  for (const image of images) {
    row.push(image);
    ratio += image.width / image.height;
    if (ratio >= targetRatio) { rows.push(row); row = []; ratio = 0; }
  }
  if (row.length) rows.push(row);
  const last = rows.at(-1);
  const previous = rows.at(-2);
  if (last?.length === 1 && previous && previous.length > 2) last.unshift(previous.pop()!);
  return rows;
}

function PhotoWallRows({ rows }: { rows: PortfolioImage[][] }) {
  return <>{rows.map((row, rowIndex) => <div className="photo-wall-row" key={rowIndex}>{row.map((image) => <figure key={image.src} style={{ "--image-ratio": image.width / image.height } as CSSProperties}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 700px) 60vw, 35vw" unoptimized={image.animated} /></figure>)}</div>)}</>;
}

function PhotoWall({ images, label }: { images: PortfolioImage[]; label: string }) {
  return <div className="photo-wall" aria-label={label}><div className="photo-wall-desktop"><PhotoWallRows rows={wallRows(images, 5.2)} /></div><div className="photo-wall-mobile"><PhotoWallRows rows={wallRows(images, 2.1)} /></div></div>;
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.slug === slug.join("/"));
  if (!project) notFound();
  const galleryBlocks = project.galleryBlocks ?? legacyBlocks(project);
  const isNestedProject = project.slug.includes("/");
  return <SiteChrome><main className="project-page" id="top"><div className="page-content">
    <header className="project-header"><Link className="back-link" href="/">Back to index ↗</Link></header>
    <section className={`project-intro${isNestedProject ? " project-intro-nested" : ""}`}><div className="project-title-block"><p className="eyebrow">{project.section} / {project.category}</p><h1>{project.title}</h1></div>{!isNestedProject && <dl className="project-facts"><div><dt>Year</dt><dd>{project.year}</dd></div><div className="project-role-fact"><dt>Role / Contribution</dt><dd>{(project.roles?.length ? project.roles : [{ name: project.role, contribution: project.contribution }]).map((role) => <span key={role.name}><b>{role.name}</b><em>{role.contribution}%</em></span>)}</dd></div>{project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}{project.referenceUrl && <div><dt>Reference</dt><dd><a className="project-reference-link" href={project.referenceUrl} target="_blank" rel="noreferrer">Visit project ↗</a></dd></div>}</dl>}</section>
    {project.isCollection ? <section className="child-project-grid" aria-label={`${project.title} projects`}>{(project.children ?? []).map((child) => <Link className="child-project-card" href={`/project/${child.slug}`} key={child.slug}><div className="child-project-image"><Image src={child.cover.src} alt={child.cover.alt} fill sizes="(max-width: 700px) 100vw, 40vw" unoptimized={child.cover.animated} /></div><span>{child.title}</span></Link>)}</section> : <section className="project-gallery" aria-label={`${project.title} images`}>
      {galleryBlocks.map((block, index) => block.type === "wall"
        ? <PhotoWall images={block.images} label={`${project.title} photo wall ${index + 1}`} key={`wall-${index}`} />
        : <GalleryImage image={block.images[0]} key={block.images[0].src} />)}
    </section>}
    <footer className="project-footer"><Link href="/">← All work</Link><Link href="/contact">Contact</Link><a href="#top">Back to top ↑</a></footer>
  </div></main></SiteChrome>;
}
