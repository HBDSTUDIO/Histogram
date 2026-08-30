import Link from "next/link";
import SiteChrome from "@/components/site-chrome";
import { siteSettings } from "@/lib/content";

export const metadata = { title: "Contact — Park Hojun", description: "Contact Park Hojun." };

export default function ContactPage() {
  return <SiteChrome><main className="contact-page" id="top"><div className="page-content">
    <section className="contact-inner"><p className="eyebrow">Contact</p><h1>Let&apos;s make<br />something clear.</h1><div className="contact-details"><a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a><a href={`tel:${siteSettings.phone.replaceAll(" ", "")}`}>{siteSettings.phone}</a><a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer">{siteSettings.instagram}</a></div></section>
    <footer className="contact-footer"><Link href="/">← Back to index</Link><a href="#top">Back to top ↑</a></footer>
  </div></main></SiteChrome>;
}
