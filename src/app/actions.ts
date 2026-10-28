"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTrek, WILDLIFE } from "@/data/treks";
import { addFeedback, addReport, addTrekRequest, type PointStatus } from "@/lib/store";

export type FormState = { error?: string };

const clean = (v: FormDataEntryValue | null, max: number) => {
  const s = typeof v === "string" ? v.trim().slice(0, max) : "";
  return s || null;
};

export async function submitReport(_: FormState, form: FormData): Promise<FormState> {
  const trek = getTrek(String(form.get("trekId")));
  if (!trek) return { error: "Unknown trek." };

  const date = String(form.get("trekDate") ?? "");
  const today = new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: "Please add the date you did the trek." };
  if (date > today) return { error: "The trek date can't be in the future." };

  const points: Record<string, PointStatus> = {};
  for (const p of trek.points) {
    const v = form.get(`point:${p.id}`);
    if (v === "there" || v === "dirty" || v === "missing") points[p.id] = v;
  }
  const wildlife = form.getAll("wildlife").map(String).filter((w) => (WILDLIFE as readonly string[]).includes(w));
  const tip = clean(form.get("tip"), 280);
  const recommendation = clean(form.get("recommendation"), 200);
  const comfort = Number(form.get("womenComfort"));
  const women_comfort = comfort >= 1 && comfort <= 5 ? comfort : null;

  if (!Object.keys(points).length && !wildlife.length && !tip && !women_comfort && !recommendation) {
    return { error: "Tell us about at least one washroom, your comfort rating, a wildlife sighting or a tip." };
  }

  try {
    await addReport({ trek_id: trek.id, trek_date: date, points, wildlife, women_comfort, tip, recommendation, name: clean(form.get("name"), 40) });
  } catch {
    return { error: "Couldn't save your report. Please try again." };
  }

  revalidatePath("/");
  revalidatePath(`/trek/${trek.id}`);
  redirect(`/trek/${trek.id}?reported=1`);
}

export async function submitTrekRequest(_: FormState, form: FormData): Promise<FormState> {
  const trek = clean(form.get("trek"), 80);
  if (!trek || trek.length < 2) return { error: "Please type the trek you want us to add." };
  try {
    await addTrekRequest({ trek, name: clean(form.get("name"), 40) });
  } catch {
    return { error: "Couldn't save your request. Please try again." };
  }
  redirect("/feedback?requested=1");
}

export async function submitFeedback(_: FormState, form: FormData): Promise<FormState> {
  const helpful = Number(form.get("helpful"));
  if (!(helpful >= 1 && helpful <= 5)) return { error: "Please pick how helpful TrailBrief was." };
  try {
    await addFeedback({
      helpful,
      stuck: clean(form.get("stuck"), 1000),
      change: clean(form.get("change"), 1000),
      name: clean(form.get("name"), 40),
    });
  } catch {
    return { error: "Couldn't save your feedback. Please try again." };
  }
  redirect("/feedback?thanks=1");
}
