import Link from "next/link";
import { treks } from "@/data/treks";
import { listReports } from "@/lib/store";
import { formatDate } from "@/lib/briefing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const reports = await listReports();

  return (
    <>
      <section className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight">Know what&apos;s on the trail before you go.</h1>
        <p className="mt-3 text-muted">
          Where the last washroom is, where you can refill water, where the network drops and what wildlife trekkers have
          seen, confirmed by people who just walked it.
        </p>
      </section>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Pick your trek</h2>
      <ul className="space-y-3">
        {treks.map((trek) => {
          const mine = reports.filter((r) => r.trek_id === trek.id);
          const last = mine.reduce<string | null>((m, r) => (!m || r.trek_date > m ? r.trek_date : m), null);
          return (
            <li key={trek.id}>
              <Link
                href={`/trek/${trek.id}`}
                className="block rounded-xl border border-line bg-white p-4 shadow-sm transition hover:border-forest focus-visible:outline-2 focus-visible:outline-forest"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{trek.name}</p>
                    <p className="text-sm text-muted">{trek.region}</p>
                  </div>
                  <span aria-hidden className="text-muted">→</span>
                </div>
                <p className="mt-3 inline-block rounded-md bg-amber-soft px-2 py-1 text-sm text-ink">
                  🚻 Up to <strong>{trek.dryStretch.hours} h</strong> without a washroom
                </p>
                <p className="mt-2 text-xs text-muted">
                  {mine.length
                    ? `${mine.length} trekker report${mine.length > 1 ? "s" : ""} · last trek ${formatDate(last)}`
                    : "No trekker reports yet · be the first"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
