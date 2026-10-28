import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrek } from "@/data/treks";
import { buildChecklist } from "@/lib/checklist";
import Checklist from "./Checklist";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  return { title: trek ? `Prep for ${trek.name} – TrailBrief` : "TrailBrief" };
}

export default async function PrepPage({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  if (!trek) notFound();

  return (
    <>
      <Link href={`/trek/${trek.id}`} className="text-sm text-muted hover:underline">← {trek.name} briefing</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight">Your prep for {trek.name}</h1>
      <p className="mt-1 text-sm text-muted">Built from what is, and isn&apos;t, on this trail. Tick things off as you pack.</p>
      <Checklist trekId={trek.id} trekName={trek.name} dryHours={trek.dryStretch.hours} groups={buildChecklist(trek)} />
    </>
  );
}
