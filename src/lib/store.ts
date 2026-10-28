import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type PointStatus = "there" | "missing";

export type Report = {
  id: string;
  trek_id: string;
  trek_date: string;
  points: Record<string, PointStatus>;
  wildlife: string[];
  women_comfort: number | null;
  tip: string | null;
  name: string | null;
  created_at: string;
};

export type NewReport = Omit<Report, "id" | "created_at">;

export type Feedback = {
  helpful: number;
  stuck: string | null;
  change: string | null;
  name: string | null;
};

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

// Local-only fallback so the app runs before Supabase is connected.
const memory: { reports: Report[]; feedback: Feedback[] } = { reports: [], feedback: [] };

export const usingDatabase = Boolean(supabase);

export async function listReports(trekId?: string): Promise<Report[]> {
  if (!supabase) {
    return memory.reports
      .filter((r) => !trekId || r.trek_id === trekId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  let query = supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(500);
  if (trekId) query = query.eq("trek_id", trekId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Report[];
}

export async function addReport(report: NewReport) {
  if (!supabase) {
    memory.reports.push({ ...report, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    return;
  }
  const { error } = await supabase.from("reports").insert(report);
  if (error) throw new Error(error.message);
}

export async function addFeedback(feedback: Feedback) {
  if (!supabase) {
    memory.feedback.push(feedback);
    return;
  }
  const { error } = await supabase.from("feedback").insert(feedback);
  if (error) throw new Error(error.message);
}
