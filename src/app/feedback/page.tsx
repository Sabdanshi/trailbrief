import Link from "next/link";
import FeedbackForm from "./FeedbackForm";
import RequestForm from "./RequestForm";

export const metadata = { title: "Feedback – TrailBrief" };

function Thanks({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6 text-center">
      <h1 className="font-display text-2xl font-semibold">Thank you!</h1>
      <p className="mt-2 text-sm text-muted">{text}</p>
      <Link href="/" className="mt-4 inline-block font-medium text-forest underline underline-offset-4">
        Back to treks
      </Link>
    </div>
  );
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ thanks?: string; request?: string; requested?: string }>;
}) {
  const { thanks, request, requested } = await searchParams;

  if (thanks) return <Thanks text="Your feedback goes straight into the next version of TrailBrief." />;
  if (requested) return <Thanks text="We'll prioritise the treks people ask for most." />;

  if (request !== undefined) {
    return (
      <>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">Request a trek</h1>
        <p className="mt-1 text-sm text-muted">We add new treks based on what trekkers ask for.</p>
        <RequestForm trek={request} />
      </>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight">How was TrailBrief?</h1>
      <p className="mt-1 text-sm text-muted">Three quick questions. Honest answers help most.</p>
      <FeedbackForm />
    </>
  );
}
