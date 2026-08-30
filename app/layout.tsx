import type { Metadata } from "next";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";

const metadataOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin),
  title: "Park Hojun — Portfolio",
  description: "Photography and content archive by Park Hojun.",
  openGraph: { title: "Park Hojun — Portfolio", description: "Photography and content archive by Park Hojun.", type: "website", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Park Hojun — Portfolio", description: "Photography and content archive by Park Hojun.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
