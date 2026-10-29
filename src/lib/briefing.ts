import { TRAIL_ISSUES, type Trek } from "@/data/treks";
import type { Report } from "@/lib/store";

export type PointSignal = { there: number; dirty: number; missing: number; lastSeen: string | null };

/** Reports from treks done in the last RECENT_DAYS count towards the current trail status. */
export const RECENT_DAYS = 21;

export type TrailStatus =
  | { kind: "issues"; issues: { id: string; label: string; count: number; lastDate: string; where: string | null; note: string | null }[] }
  | { kind: "clear"; recentReports: number; lastDate: string }
  | { kind: "unknown" };

export type Briefing = {
  status: TrailStatus;
  reportCount: number;
  lastReport: string | null;
  points: Record<string, PointSignal>;
  womenComfort: { average: number; count: number } | null;
  wildlife: { name: string; count: number; lastSeen: string | null; fromBase: boolean }[];
  tips: { text: string; name: string | null; date: string }[];
  recommendations: { text: string; name: string | null; date: string }[];
};

/** Combine the base trail data with what trekkers reported. */
export function buildBriefing(trek: Trek, reports: Report[]): Briefing {
  const points: Record<string, PointSignal> = {};
  for (const p of trek.points) points[p.id] = { there: 0, dirty: 0, missing: 0, lastSeen: null };

  const wildlife = new Map<string, { count: number; lastSeen: string | null; fromBase: boolean }>();
  for (const w of trek.wildlife) wildlife.set(w, { count: 0, lastSeen: null, fromBase: true });

  for (const r of reports) {
    for (const [pointId, status] of Object.entries(r.points ?? {})) {
      const signal = points[pointId];
      if (!signal) continue;
      signal[status] += 1;
      if (status !== "missing" && (!signal.lastSeen || r.trek_date > signal.lastSeen)) signal.lastSeen = r.trek_date;
    }
    for (const w of r.wildlife ?? []) {
      const entry = wildlife.get(w) ?? { count: 0, lastSeen: null, fromBase: false };
      entry.count += 1;
      if (!entry.lastSeen || r.trek_date > entry.lastSeen) entry.lastSeen = r.trek_date;
      wildlife.set(w, entry);
    }
  }

  const cutoff = new Date(Date.now() - RECENT_DAYS * 86_400_000).toISOString().slice(0, 10);
  const recent = reports.filter((r) => r.trek_date >= cutoff).sort((a, b) => b.trek_date.localeCompare(a.trek_date));
  let status: TrailStatus = { kind: "unknown" };
  if (recent.length) {
    const issues = TRAIL_ISSUES.flatMap(({ id, label }) => {
      const hits = recent.filter((r) => (r.issues ?? []).includes(id));
      if (!hits.length) return [];
      const latest = hits[0];
      const where = trek.points.find((p) => p.id === latest.issue_point)?.name ?? null;
      return [{ id, label, count: hits.length, lastDate: latest.trek_date, where, note: latest.issue_note }];
    });
    status = issues.length
      ? { kind: "issues", issues: issues.sort((a, b) => b.lastDate.localeCompare(a.lastDate)) }
      : { kind: "clear", recentReports: recent.length, lastDate: recent[0].trek_date };
  }

  const ratings = reports.map((r) => r.women_comfort).filter((n): n is number => typeof n === "number");

  return {
    status,
    reportCount: reports.length,
    lastReport: reports.reduce<string | null>((max, r) => (!max || r.trek_date > max ? r.trek_date : max), null),
    points,
    womenComfort: ratings.length
      ? { average: Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10, count: ratings.length }
      : null,
    wildlife: [...wildlife.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count),
    tips: reports
      .filter((r) => r.tip)
      .slice(0, 5)
      .map((r) => ({ text: r.tip as string, name: r.name, date: r.trek_date })),
    recommendations: reports
      .filter((r) => r.recommendation)
      .slice(0, 5)
      .map((r) => ({ text: r.recommendation as string, name: r.name, date: r.trek_date })),
  };
}

export function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "today", "yesterday", "5 days ago" for a yyyy-mm-dd date. */
export function daysAgo(iso: string) {
  const days = Math.round((Date.now() - new Date(iso + "T00:00:00").getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
