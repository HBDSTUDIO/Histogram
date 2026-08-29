import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Park Hojun — Portfolio",
  description: "Photography and content archive by Park Hojun.",
  openGraph: { title: "Park Hojun — Portfolio", description: "Photography and content archive by Park Hojun.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
