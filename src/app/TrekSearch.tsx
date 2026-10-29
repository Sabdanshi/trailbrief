"use client";

import Image from "next/image";
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
  photo: string | null;
  photoAlt: string;
  status: "issues" | "clear" | "unknown";
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
          className="block w-full rounded-2xl border border-line bg-white py-3.5 pl-10 pr-3 text-base shadow-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </label>

      <h2 className="mb-3 mt-6 font-display text-2xl font-semibold tracking-tight">
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
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.map((trek) => (
            <li key={trek.id}>
              <Link
                href={`/trek/${trek.id}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-forest"
              >
                <div className="relative aspect-[16/10] bg-moss">
                  {trek.photo && (
                    <Image
                      src={trek.photo}
                      alt={trek.photoAlt}
                      fill
                      sizes="(min-width: 640px) 320px, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {trek.status !== "unknown" && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        trek.status === "issues" ? "bg-alert text-white" : "bg-forest text-white"
                      }`}
                    >
                      {trek.status === "issues" ? "⚠ Trail issue reported" : "● Clear lately"}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink">
                    {trek.difficulty}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="font-display text-xl font-semibold leading-tight">{trek.name}</p>
                    <p className="text-sm text-white/85">
                      {trek.region} · {trek.daysOnFoot.replace(/ \(.*\)$/, "")}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <p className="inline-block rounded-md bg-amber-soft px-2 py-1 text-sm text-ink">
                    🚻 Up to <strong>{trek.dryHours} h</strong> without a washroom
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {trek.reportCount
                      ? `${trek.reportCount} trekker report${trek.reportCount > 1 ? "s" : ""} · last trek ${trek.lastReport}`
                      : "No trekker reports yet · be the first"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
