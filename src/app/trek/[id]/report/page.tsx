import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrek, WILDLIFE } from "@/data/treks";
import ReportForm from "./ReportForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  return { title: trek ? `Report ${trek.name} – TrailBrief` : "TrailBrief" };
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const trek = getTrek((await params).id);
  if (!trek) notFound();

  return (
    <>
      <Link href={`/trek/${trek.id}`} className="text-sm text-muted hover:underline">← {trek.name} briefing</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight">What did you see on {trek.name}?</h1>
      <p className="mt-1 text-sm text-muted">
        Takes about a minute. Your answers update the briefing for the next trekker.
      </p>
      <ReportForm
        trekId={trek.id}
        washroomPoints={trek.points.filter((p) => p.washroom !== "no").map((p) => ({ id: p.id, name: p.name }))}
        wildlife={[...WILDLIFE]}
      />
    </>
  );
}
