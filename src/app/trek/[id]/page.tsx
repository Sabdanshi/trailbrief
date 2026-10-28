import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrek, type TrailPoint } from "@/data/treks";
import { listReports } from "@/lib/store";
import { buildBriefing, formatDate, formatDuration, type PointSignal } from "@/lib/briefing";
import { fitnessPlan } from "@/lib/checklist";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  return { title: trek ? `${trek.name} – TrailBrief` : "TrailBrief" };
}

const washroomLabel = { yes: "Washroom", basic: "Basic washroom", no: "No washroom" } as const;
const networkLabel = { good: "Network OK", patchy: "Patchy network", none: "No network" } as const;

const sections = [
  ["overview", "Overview"],
  ["women", "For women"],
  ["trail", "Trail"],
  ["stay-eat", "Stay & eat"],
  ["fitness", "Fitness"],
  ["safety", "Safety & medical"],
] as const;

function Chip({ tone, children }: { tone: "good" | "warn" | "bad"; children: React.ReactNode }) {
  const tones = {
    good: "bg-moss text-forest-dark",
    warn: "bg-amber-soft text-ink",
    bad: "bg-alert-soft text-alert",
  };
  return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{children}</h2>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-white p-3 ${className}`}>{children}</div>;
}

function Quote({ text, name, date }: { text: string; name: string | null; date: string }) {
  return (
    <li className="rounded-lg border border-line bg-white p-3">
      “{text}”
      <span className="mt-1 block text-xs text-muted">
        {name || "A trekker"} · {formatDate(date)}
      </span>
    </li>
  );
}

function Confirmation({ point, signal }: { point: TrailPoint; signal: PointSignal }) {
  if (point.washroom === "no") return null;
  const found = signal.there + signal.dirty;
  if (signal.missing > found) {
    return (
      <p className="mt-2 text-xs text-alert">
        ⚠ {signal.missing} trekker{signal.missing > 1 ? "s" : ""} said this washroom was closed or not usable
      </p>
    );
  }
  if (found > 0) {
    return (
      <p className="mt-2 text-xs text-forest">
        ✓ Confirmed by {found} trekker{found > 1 ? "s" : ""} · last on {formatDate(signal.lastSeen)}
        {signal.dirty > 0 && <span className="text-amber"> · {signal.dirty} said not clean</span>}
        {signal.missing > 0 && <span className="text-alert"> · {signal.missing} said closed</span>}
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
  const fit = fitnessPlan(trek);

  return (
    <>
      <Link href="/" className="text-sm text-muted hover:underline">← All treks</Link>

      {reported && (
        <p role="status" className="mt-4 rounded-lg bg-moss p-3 text-sm text-forest-dark">
          Thanks! Your report is now part of this briefing.
        </p>
      )}

      <h1 className="mt-3 text-2xl font-bold tracking-tight">{trek.name}</h1>
      <p className="text-sm text-muted">{trek.region}</p>
      <p className="mt-1 text-xs text-muted">
        {briefing.reportCount
          ? `Trail data + ${briefing.reportCount} trekker report${briefing.reportCount > 1 ? "s" : ""} (latest trek ${formatDate(briefing.lastReport)})`
          : "Trail data · no trekker reports yet"}
      </p>

      <nav aria-label="Jump to section" className="-mx-4 mt-4 overflow-x-auto px-4">
        <ul className="flex gap-2 whitespace-nowrap">
          {sections.map(([anchor, label]) => (
            <li key={anchor}>
              <a href={`#${anchor}`} className="block rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-forest">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Overview */}
      <section id="overview" className="scroll-mt-20 pt-6">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          {[
            ["Difficulty", trek.difficulty],
            ["Highest point", `${trek.maxAltitudeM.toLocaleString("en-IN")} m`],
            ["Distance", `${trek.oneWayKm} km one way from ${trek.start}`],
            ["Walking time", trek.walkingTime],
          ].map(([k, v]) => (
            <Card key={k}>
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </Card>
          ))}
        </dl>
        <Card className="mt-2 text-sm">
          <p className="text-xs text-muted">Days needed</p>
          <p className="font-medium">On foot: {trek.daysNeeded.onFoot}</p>
          <p className="text-muted">Whole trip: {trek.daysNeeded.total}</p>
        </Card>
        <Card className="mt-2 text-sm">
          <p className="text-xs text-muted">Best time to go</p>
          <p className="font-medium">{trek.bestSeason}</p>
          <p className="mt-1 text-muted">{trek.bestTimeNote}</p>
        </Card>
        <Card className="mt-2 text-sm">
          <p className="text-xs text-muted">Permits</p>
          <p>{trek.permits}</p>
        </Card>
        <Card className="mt-2 text-sm">
          <p className="text-xs text-muted">How to reach</p>
          <p>{trek.gettingThere}</p>
        </Card>

        <div className="mt-4 rounded-xl border border-amber/40 bg-amber-soft p-4">
          <p className="text-sm font-medium text-amber">Longest stretch without a washroom</p>
          <p className="mt-1 text-3xl font-bold">{trek.dryStretch.hours} hours</p>
          <p className="text-sm text-muted">
            {trek.dryStretch.from} → {trek.dryStretch.to}
          </p>
        </div>
      </section>

      {/* For women */}
      <section id="women" className="scroll-mt-20 pt-8">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <SectionTitle>For women trekkers</SectionTitle>
          <p className="mb-3 shrink-0 text-sm">
            {briefing.womenComfort ? (
              <>
                <strong>{briefing.womenComfort.average}/5</strong>{" "}
                <span className="text-muted">
                  comfort · {briefing.womenComfort.count} rating{briefing.womenComfort.count > 1 ? "s" : ""}
                </span>
              </>
            ) : (
              <span className="text-muted">No comfort ratings yet</span>
            )}
          </p>
        </div>
        <Card>
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            {trek.forWomen.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Trail */}
      <section id="trail" className="scroll-mt-20 pt-8">
        <SectionTitle>On the trail, going up</SectionTitle>
        <ol className="relative space-y-4 border-l-2 border-line pl-5">
          {trek.points.map((p, i) => (
            <li key={p.id} className="relative">
              {p.day && p.day !== trek.points[i - 1]?.day && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest">Day {p.day}</p>
              )}
              <span
                aria-hidden
                className={`absolute -left-[27px] ${p.day && p.day !== trek.points[i - 1]?.day ? "top-8" : "top-1.5"} h-3 w-3 rounded-full border-2 border-paper ${
                  p.washroom === "no" ? "bg-alert" : "bg-forest"
                }`}
              />
              <Card>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <p className="shrink-0 text-xs text-muted">
                    {p.minFromStart === 0
                      ? "Start"
                      : p.day
                        ? `${formatDuration(p.minFromStart)} into the day · at km ${p.km}`
                        : `${formatDuration(p.minFromStart)} · ${p.km} km`}
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
              </Card>
            </li>
          ))}
        </ol>

        <h3 className="mb-2 mt-6 font-semibold">Wildlife seen by trekkers</h3>
        <ul className="flex flex-wrap gap-2">
          {briefing.wildlife.map((w) => (
            <li key={w.name} className="rounded-lg border border-line bg-white px-3 py-2 text-sm">
              <span className="font-medium">{w.name}</span>
              <span className="block text-xs text-muted">
                {w.count ? `${w.count} report${w.count > 1 ? "s" : ""} · last ${formatDate(w.lastSeen)}` : "Known in this area"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">
          Sightings are reported by trekkers and are not a safety guarantee. Follow forest department and local guide advice.
        </p>
      </section>

      {/* Stay & eat */}
      <section id="stay-eat" className="scroll-mt-20 pt-8">
        <SectionTitle>Where to stay and eat</SectionTitle>
        <Card className="mb-2 text-sm">
          <p className="text-xs text-muted">How people stay</p>
          <p>{trek.howPeopleStay}</p>
        </Card>
        <ul className="space-y-2 text-sm">
          {trek.stayOptions.map((s) => (
            <li key={s.place}>
              <Card>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold">🛏 {s.place}</p>
                  <p className="shrink-0 text-xs text-muted">{s.price}</p>
                </div>
                <p className="mt-1">{s.what}</p>
              </Card>
            </li>
          ))}
        </ul>
        <Card className="mt-2 text-sm">
          <p className="font-semibold">🍲 Food</p>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {trek.eatOptions.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </Card>
        <p className="mt-2 text-xs text-muted">Prices are approximate and change with the season. Last ATM: {trek.lastAtm}.</p>

        {briefing.recommendations.length > 0 && (
          <>
            <h3 className="mb-2 mt-4 font-semibold">Trekkers recommend</h3>
            <ul className="space-y-2 text-sm">
              {briefing.recommendations.map((r, i) => (
                <Quote key={i} {...r} />
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Fitness */}
      <section id="fitness" className="scroll-mt-20 pt-8">
        <SectionTitle>Get trek-fit</SectionTitle>
        <Card className="text-sm">
          <p>
            Start <strong>{fit.weeks} weeks</strong> before. Goal: <strong>{fit.target}</strong>
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {fit.items.map((i) => (
              <li key={i.id}>{i.text}</li>
            ))}
          </ul>
          <p className="mt-2 text-muted">{trek.fitnessNote}</p>
        </Card>
      </section>

      {/* Safety & medical */}
      <section id="safety" className="scroll-mt-20 pt-8">
        <SectionTitle>Safety and medical help</SectionTitle>
        <div className="rounded-xl border border-alert/30 bg-alert-soft p-4 text-sm">
          <p>
            Emergency: call{" "}
            <a href="tel:112" className="font-semibold underline">
              112
            </a>{" "}
            (all-India emergency number).
          </p>
          <p className="mt-1">
            <strong>Medical help:</strong> {trek.medical}
          </p>
          {trek.maxAltitudeM >= 3000 && (
            <p className="mt-1">
              <strong>Altitude:</strong> above 3,000 m. Go slow, drink water, and turn back if a headache or nausea gets worse.
            </p>
          )}
        </div>

        {(briefing.tips.length > 0 || trek.tips.length > 0) && (
          <>
            <h3 className="mb-2 mt-6 font-semibold">Good to know</h3>
            <ul className="space-y-2 text-sm">
              {briefing.tips.map((t, i) => (
                <Quote key={i} {...t} />
              ))}
              {trek.tips.map((t) => (
                <li key={t} className="rounded-lg border border-line bg-white p-3">
                  {t}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

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
