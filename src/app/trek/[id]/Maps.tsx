import type { Trek } from "@/data/treks";
import type { PlaceKind, TrekMaps } from "@/data/maps";

const ROUTE = "#d9480f";
const kindLabel: Record<PlaceKind, string> = {
  start: "🚩 Trek start",
  stay: "🛏 Stay",
  food: "🍲 Food",
  medical: "✚ Medical",
  atm: "₹ ATM",
  sight: "★ Nearby trek",
};

function Route({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d={d} fill="none" stroke={ROUTE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function MapFrame({ src, alt, label, children }: { src: string; alt: string; label: string; children: React.ReactNode }) {
  return (
    <div className="relative aspect-[10/7] bg-moss">
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static map, no optimisation needed */}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <svg viewBox="0 0 1000 700" className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
        {children}
      </svg>
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="space-y-1.5 border-t border-line p-3 text-xs text-muted">{children}</figcaption>;
}

export function TrailMap({ trek, map }: { trek: Trek; map: TrekMaps["trail"] }) {
  const first = map.points[0];
  const last = map.points[map.points.length - 1];
  const labels = [
    { p: first, text: trek.points[0].name },
    { p: last, text: trek.points[trek.points.length - 1].name },
  ];
  const google = `https://www.google.com/maps/search/?api=1&query=${map.start[0]},${map.start[1]}`;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <MapFrame
        src={map.src}
        alt={`Topographic map of the ${trek.name} trek`}
        label={`Route of the ${trek.name} trek from ${trek.points[0].name}, with ${map.points.length} numbered stops`}
      >
        <Route d={map.route} />
        {labels.map(({ p, text }) => {
          const right = p.x < 700;
          return (
            <text
              key={text}
              x={p.x + (right ? 30 : -30)}
              y={p.y + 8}
              textAnchor={right ? "start" : "end"}
              className="map-label"
              fontSize="26"
              fontWeight="600"
              fill="#1f2a24"
            >
              {text}
            </text>
          );
        })}
        {map.points.map((p, i) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r="19" fill={trek.points[i].washroom === "no" ? "#b4432f" : "#2f5d46"} stroke="#fff" strokeWidth="4" />
            <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
          </g>
        ))}
      </MapFrame>
      <Caption>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-5 rounded-full" style={{ background: ROUTE }} /> Trek route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-forest" /> Stop with washroom
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-alert" /> No washroom
          </span>
        </p>
        <p>Numbers match the stops below. Route from OpenStreetMap paths; stop positions are approximate.</p>
        <a href={google} target="_blank" rel="noopener noreferrer" className="inline-block font-medium text-forest underline underline-offset-4">
          Open the start point in Google Maps ↗
        </a>
      </Caption>
    </figure>
  );
}

export function NearbyMap({ trek, map }: { trek: Trek; map: TrekMaps["nearby"] }) {
  const letter = (i: number) => String.fromCharCode(65 + i);
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <MapFrame
        src={map.src}
        alt={`Map of the area around the ${trek.name} trek`}
        label={`Places near the ${trek.name} trek: ${map.places.map((p) => p.name).join(", ")}`}
      >
        <Route d={map.route} />
        {map.places.map((p, i) => (
          <g key={p.name}>
            <circle cx={p.x} cy={p.y} r="21" fill="#1f2a24" stroke="#fff" strokeWidth="4" />
            <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize="21" fontWeight="700" fill="#fff">
              {letter(i)}
            </text>
          </g>
        ))}
      </MapFrame>
      <Caption>
        <ul className="space-y-2 text-sm text-ink">
          {map.places.map((p, i) => (
            <li key={p.name} className="flex gap-2.5">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                {letter(i)}
              </span>
              <span>
                <span className="font-medium">{p.name}</span>
                <span className="text-muted"> · {p.note}</span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {p.kinds.map((k) => (
                    <span key={k} className="rounded bg-paper px-1.5 py-0.5 text-[11px] text-muted">
                      {kindLabel[k]}
                    </span>
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Caption>
    </figure>
  );
}
