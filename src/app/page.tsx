import { treks } from "@/data/treks";
import { listReports } from "@/lib/store";
import { buildBriefing, formatDate } from "@/lib/briefing";
import Image from "next/image";
import { heroPhoto, trekPhotos } from "@/data/photos";
import TrekSearch, { type TrekCard } from "./TrekSearch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reports = await listReports();

  const cards: TrekCard[] = treks.map((trek) => {
    const mine = reports.filter((r) => r.trek_id === trek.id);
    const last = mine.reduce<string | null>((m, r) => (!m || r.trek_date > m ? r.trek_date : m), null);
    return {
      id: trek.id,
      name: trek.name,
      region: trek.region,
      start: trek.start,
      difficulty: trek.difficulty,
      bestSeason: trek.bestSeason,
      daysOnFoot: trek.daysNeeded.onFoot,
      dryHours: trek.dryStretch.hours,
      reportCount: mine.length,
      lastReport: last ? formatDate(last) : null,
      status: buildBriefing(trek, mine).status.kind,
      photo: trekPhotos[trek.id]?.src ?? null,
      photoAlt: trekPhotos[trek.id]?.alt ?? "",
    };
  });

  return (
    <>
      <section className="relative -mx-4 -mt-6 overflow-hidden bg-forest-dark sm:mx-0 sm:mt-0 sm:rounded-3xl">
        <Image src={heroPhoto.src} alt={heroPhoto.alt} fill priority sizes="(min-width: 672px) 672px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative flex min-h-96 flex-col justify-end px-5 pb-6 pt-24 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Trek briefings for India</p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Know your trek
            <br />
            before you go.
          </h1>
          <p className="mt-3 max-w-md text-white/90">
            Everything you&apos;d Google or watch vlogs for, in one 2-minute read. Written with women trekkers in mind and
            confirmed by people who just did the trek.
          </p>
        </div>
      </section>
      <p className="mt-1.5 text-[11px] text-muted">
        Photo:{" "}
        <a href={heroPhoto.source} className="underline" target="_blank" rel="noopener noreferrer">
          {heroPhoto.author}
        </a>
        , {heroPhoto.license}, via Wikimedia Commons
      </p>

      <ul className="my-6 grid grid-cols-3 gap-2 text-center text-xs">
        {[
          ["🚻", "Washrooms, water & network at every stop"],
          ["👩", "Written for women trekkers"],
          ["🗺", "Trail maps & what's nearby"],
        ].map(([icon, text]) => (
          <li key={text} className="rounded-2xl border border-line bg-white px-2 py-3 shadow-sm">
            <span aria-hidden className="block text-xl">
              {icon}
            </span>
            <span className="mt-1 block leading-snug text-muted">{text}</span>
          </li>
        ))}
      </ul>

      <TrekSearch treks={cards} />
    </>
  );
}
