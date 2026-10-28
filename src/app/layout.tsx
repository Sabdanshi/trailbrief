import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrailBrief – know what's on the trail before you go",
  description: "Washrooms, water, network and wildlife on Indian treks, confirmed by trekkers who just walked them.",
};

export const viewport: Viewport = { themeColor: "#2f5d46", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span aria-hidden className="grid h-7 w-7 place-items-center rounded-md bg-forest text-sm text-white">▲</span>
              TrailBrief
            </Link>
            <Link href="/feedback" className="text-sm text-muted underline-offset-4 hover:underline">
              Give feedback
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-4 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}
