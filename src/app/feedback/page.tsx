import Link from "next/link";
import FeedbackForm from "./FeedbackForm";

export const metadata = { title: "Feedback – TrailBrief" };

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ thanks?: string }> }) {
  const { thanks } = await searchParams;

  if (thanks) {
    return (
      <div className="rounded-xl border border-line bg-white p-6 text-center">
        <h1 className="text-xl font-bold">Thank you!</h1>
        <p className="mt-2 text-sm text-muted">Your feedback goes straight into the next version of TrailBrief.</p>
        <Link href="/" className="mt-4 inline-block font-medium text-forest underline underline-offset-4">
          Back to treks
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">How was TrailBrief?</h1>
      <p className="mt-1 text-sm text-muted">Three quick questions. Honest answers help most.</p>
      <FeedbackForm />
    </>
  );
}
