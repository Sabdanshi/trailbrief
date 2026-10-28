import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrailBrief – know your trek before you go",
  description: "Everything to know before an Indian trek, for women trekkers especially: washrooms, safety, network, wildlife and what to pack.",
};

export const viewport: Viewport = { themeColor: "#2f5d46", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${fraunces.variable} antialiased`}>
        <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
              <svg aria-hidden width="28" height="28" viewBox="0 0 28 28" className="rounded-lg bg-forest">
                <path d="M5 21 11.5 10l3.5 6 2.5-4L23 21Z" fill="#f6f3ec" />
                <path d="m11.5 10 1.8 3.1-1.8-.9-1.6 1Z" fill="#2f5d46" />
              </svg>
              TrailBrief
            </Link>
            <Link href="/feedback" className="text-sm text-muted underline-offset-4 hover:underline">
              Give feedback
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">{children}</main>
        <footer className="mx-auto max-w-2xl px-4 pb-10 text-xs leading-relaxed text-muted">
          Photos from Wikimedia Commons, credited on each trek. Maps: ©{" "}
          <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap</a> contributors, style ©{" "}
          <a href="https://opentopomap.org" className="underline">OpenTopoMap</a> (CC-BY-SA). Trail data is a guide, not a
          safety guarantee.
        </footer>
      </body>
    </html>
  );
}
