"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type TrekCard = {
  id: string;
  name: string;
  region: string;
  start: string;
  difficulty: string;
  bestSeason: string;
  daysOnFoot: string;
  dryHours: string;
  reportCount: number;
  lastReport: string | null;
};

const normalise = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function TrekSearch({ treks }: { treks: TrekCard[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const words = normalise(query).split(/\s+/).filter(Boolean);
    if (!words.length) return treks;
    return treks.filter((t) => {
      const haystack = normalise(`${t.name} ${t.region} ${t.start} ${t.difficulty} ${t.bestSeason}`);
      return words.every((w) => haystack.includes(w));
    });
  }, [query, treks]);

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search treks</span>
        <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search treks, places or states"
          className="block w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3 text-base shadow-sm outline-none focus:border-forest"
        />
      </label>

      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-muted">
        {query.trim() ? `${results.length} trek${results.length === 1 ? "" : "s"} found` : "Pick your trek"}
      </h2>

      {results.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-4 text-sm">
          <p className="font-medium">We don&apos;t cover “{query.trim()}” yet.</p>
          <p className="mt-1 text-muted">We&apos;re adding treks based on what people ask for.</p>
          <Link
            href={`/feedback?request=${encodeURIComponent(query.trim())}`}
            className="mt-3 inline-block font-medium text-forest underline underline-offset-4"
          >
            Request this trek
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((trek) => (
            <li key={trek.id}>
              <Link
                href={`/trek/${trek.id}`}
                className="block rounded-xl border border-line bg-white p-4 shadow-sm transition hover:border-forest focus-visible:outline-2 focus-visible:outline-forest"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{trek.name}</p>
                    <p className="text-sm text-muted">
                      {trek.region} · {trek.difficulty} · {trek.daysOnFoot.replace(/ \(.*\)$/, "")}
                    </p>
                  </div>
                  <span aria-hidden className="text-muted">→</span>
                </div>
                <p className="mt-3 inline-block rounded-md bg-amber-soft px-2 py-1 text-sm text-ink">
                  🚻 Up to <strong>{trek.dryHours} h</strong> without a washroom
                </p>
                <p className="mt-2 text-xs text-muted">
                  {trek.reportCount
                    ? `${trek.reportCount} trekker report${trek.reportCount > 1 ? "s" : ""} · last trek ${trek.lastReport}`
                    : "No trekker reports yet · be the first"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
