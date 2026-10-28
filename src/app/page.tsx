import { treks } from "@/data/treks";
import { listReports } from "@/lib/store";
import { formatDate } from "@/lib/briefing";
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
    };
  });

  return (
    <>
      <section className="mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">Know your trek before you go.</h1>
        <p className="mt-3 text-muted">
          Everything you&apos;d Google or watch vlogs for, in one 2-minute read: washrooms, safety, network, wildlife,
          how to get there and what to pack. Written with women trekkers in mind and confirmed by people who just did
          the trek.
        </p>
      </section>
      <TrekSearch treks={cards} />
    </>
  );
}
