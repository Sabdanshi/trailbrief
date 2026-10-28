import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrek, type TrailPoint } from "@/data/treks";
import { listReports } from "@/lib/store";
import { buildBriefing, formatDate, formatDuration, type PointSignal } from "@/lib/briefing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  return { title: trek ? `${trek.name} – TrailBrief` : "TrailBrief" };
}

const washroomLabel = { yes: "Washroom", basic: "Basic washroom", no: "No washroom" } as const;
const networkLabel = { good: "Network OK", patchy: "Patchy network", none: "No network" } as const;

function Chip({ tone, children }: { tone: "good" | "warn" | "bad"; children: React.ReactNode }) {
  const tones = {
    good: "bg-moss text-forest-dark",
    warn: "bg-amber-soft text-ink",
    bad: "bg-alert-soft text-alert",
  };
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function Confirmation({ point, signal }: { point: TrailPoint; signal: PointSignal }) {
  if (point.washroom === "no") return null;
  if (signal.missing > signal.there) {
    return (
      <p className="mt-2 text-xs text-alert">
        ⚠ {signal.missing} trekker{signal.missing > 1 ? "s" : ""} said this washroom was closed or not usable
      </p>
    );
  }
  if (signal.there > 0) {
    return (
      <p className="mt-2 text-xs text-forest">
        ✓ Confirmed by {signal.there} trekker{signal.there > 1 ? "s" : ""} · last on {formatDate(signal.lastSeen)}
        {signal.missing > 0 && <span className="text-alert"> · {signal.missing} said not usable</span>}
      </p>
    );
  }
  return <p className="mt-2 text-xs text-muted">Not confirmed by a trekker yet</p>;
}

export default async function TrekPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reported?: string }>;
}) {
  const { id } = await params;
  const { reported } = await searchParams;
  const trek = getTrek(id);
  if (!trek) notFound();

  const briefing = buildBriefing(trek, await listReports(trek.id));

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:underline">← All treks</Link>

      {reported && (
        <p role="status" className="mt-4 rounded-lg bg-moss p-3 text-sm text-forest-dark">
          Thanks! Your report is now part of this briefing.
        </p>
      )}

      <h1 className="mt-3 text-2xl font-bold tracking-tight">{trek.name}</h1>
      <p className="text-sm text-muted">
        {trek.region} · starts at {trek.start} · {trek.oneWayKm} km one way · {trek.roundTripHours} h round trip
      </p>

      <section className="mt-5 rounded-xl border border-amber/40 bg-amber-soft p-4">
        <p className="text-sm font-medium text-amber">Longest stretch without a washroom</p>
        <p className="mt-1 text-3xl font-bold">{trek.dryStretch.hours} hours</p>
        <p className="text-sm text-muted">
          {trek.dryStretch.from} → {trek.dryStretch.to}
        </p>
      </section>

      <p className="mt-3 text-xs text-muted">
        {briefing.reportCount
          ? `Based on trail data + ${briefing.reportCount} trekker report${briefing.reportCount > 1 ? "s" : ""} (latest trek ${formatDate(briefing.lastReport)}).`
          : "Based on trail data. No trekker reports yet."}{" "}
        Best season: {trek.bestSeason}.
      </p>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">On the trail, going up</h2>
        <ol className="relative space-y-4 border-l-2 border-line pl-5">
          {trek.points.map((p) => (
            <li key={p.id} className="relative">
              <span
                aria-hidden
                className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-paper ${
                  p.washroom === "no" ? "bg-alert" : "bg-forest"
                }`}
              />
              <div className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <p className="shrink-0 text-xs text-muted">
                    {p.minFromStart === 0 ? "Start" : `${formatDuration(p.minFromStart)} · ${p.km} km`}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Chip tone={p.washroom === "yes" ? "good" : p.washroom === "basic" ? "warn" : "bad"}>
                    🚻 {washroomLabel[p.washroom]}
                  </Chip>
                  <Chip tone={p.water ? "good" : "bad"}>💧 {p.water ? "Water" : "No water"}</Chip>
                  <Chip tone={p.food === "yes" ? "good" : p.food === "seasonal" ? "warn" : "bad"}>
                    🍲 {p.food === "yes" ? "Food" : p.food === "seasonal" ? "Food (seasonal)" : "No food"}
                  </Chip>
                  <Chip tone={p.network === "good" ? "good" : p.network === "patchy" ? "warn" : "bad"}>
                    📶 {networkLabel[p.network]}
                  </Chip>
                </div>
                {p.note && <p className="mt-2 text-sm text-muted">{p.note}</p>}
                <Confirmation point={p} signal={briefing.points[p.id]} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Wildlife seen by trekkers</h2>
        {briefing.wildlife.length ? (
          <ul className="flex flex-wrap gap-2">
            {briefing.wildlife.map((w) => (
              <li key={w.name} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
                <span className="font-medium">{w.name}</span>
                <span className="block text-xs text-muted">
                  {w.count
                    ? `${w.count} report${w.count > 1 ? "s" : ""} · last ${formatDate(w.lastSeen)}`
                    : "Known in this area"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nothing reported.</p>
        )}
        <p className="mt-2 text-xs text-muted">
          Sightings are reported by trekkers and are not a safety guarantee. Follow forest department and local guide advice.
        </p>
      </section>

      {(briefing.tips.length > 0 || trek.tips.length > 0) && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Good to know</h2>
          <ul className="space-y-2 text-sm">
            {briefing.tips.map((t, i) => (
              <li key={`r${i}`} className="rounded-lg bg-white p-3 border border-line">
                “{t.text}”
                <span className="mt-1 block text-xs text-muted">
                  {t.name || "A trekker"} · {formatDate(t.date)}
                </span>
              </li>
            ))}
            {trek.tips.map((t) => (
              <li key={t} className="rounded-lg bg-white p-3 border border-line">{t}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="sticky bottom-4 mt-8">
        <Link
          href={`/trek/${trek.id}/prep`}
          className="block rounded-xl bg-forest px-4 py-3.5 text-center font-semibold text-white shadow-lg hover:bg-forest-dark"
        >
          Get my prep checklist
        </Link>
      </div>
      <p className="mt-4 text-center text-sm">
        Done this trek recently?{" "}
        <Link href={`/trek/${trek.id}/report`} className="font-medium text-forest underline underline-offset-4">
          Report what you saw
        </Link>
      </p>
    </>
  );
}
