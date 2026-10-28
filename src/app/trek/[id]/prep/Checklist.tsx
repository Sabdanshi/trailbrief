"use client";

import { useEffect, useState } from "react";
import type { ChecklistGroup } from "@/lib/checklist";

type Props = { trekId: string; trekName: string; dryHours: string; groups: ChecklistGroup[] };

export default function Checklist({ trekId, trekName, dryHours, groups }: Props) {
  const storageKey = `trailbrief:prep:${trekId}`;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(storageKey) ?? "{}"));
    } catch {}
  }, [storageKey]);

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const ticked = groups.reduce((n, g) => n + g.items.filter((i) => done[i.id]).length, 0);

  const url = typeof window !== "undefined" ? `${window.location.origin}/trek/${trekId}` : "";
  const message = `Doing ${trekName}? There's up to ${dryHours} h without a washroom. Here's what's on the trail and what to pack: ${url}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${trekName} – TrailBrief`, text: message });
        return;
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <>
      <div className="mt-4 rounded-xl border border-line bg-white p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Packed</span>
          <span className="text-muted">
            {ticked} of {total}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-moss">
          <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${(ticked / total) * 100}%` }} />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.title} className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">{g.title}</h2>
          <ul className="space-y-2">
            {g.items.map((item) => (
              <li key={item.id}>
                <label className="flex cursor-pointer gap-3 rounded-xl border border-line bg-white p-3 has-[:checked]:border-forest has-[:checked]:bg-moss/50">
                  <input
                    type="checkbox"
                    checked={Boolean(done[item.id])}
                    onChange={() => toggle(item.id)}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-[#2f5d46]"
                  />
                  <span className={`text-sm ${done[item.id] ? "text-muted line-through" : ""}`}>{item.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={share}
          className="w-full rounded-xl bg-forest px-4 py-3.5 font-semibold text-white shadow-lg hover:bg-forest-dark"
        >
          Share with your trek group
        </button>
      </div>
      <p className="mt-3 text-center text-sm">
        <button onClick={copy} className="text-forest underline underline-offset-4">
          {copied ? "Link copied" : "Copy link instead"}
        </button>
      </p>
    </>
  );
}
