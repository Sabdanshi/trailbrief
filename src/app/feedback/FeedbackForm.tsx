"use client";

import { useActionState } from "react";
import { submitFeedback, type FormState } from "@/app/actions";

export default function FeedbackForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitFeedback, {});

  return (
    <form action={action} className="mt-5 space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold">How helpful would this be before your next trek?</legend>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-lg border border-line bg-white py-2.5 text-center has-[:checked]:border-forest has-[:checked]:bg-moss has-[:checked]:font-semibold"
            >
              <input type="radio" name="helpful" value={n} required className="sr-only" />
              {n}
            </label>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Not helpful</span>
          <span>Very helpful</span>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Where did you get stuck or confused?</span>
        <textarea name="stuck" rows={3} maxLength={1000} className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">What one thing would you change or add?</span>
        <textarea name="change" rows={3} maxLength={1000} className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm" />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Your first name (optional)</span>
        <input name="name" maxLength={40} className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5" />
      </label>

      {state.error && (
        <p role="alert" className="rounded-lg bg-alert-soft p-3 text-sm text-alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-forest px-4 py-3.5 font-semibold text-white shadow-lg hover:bg-forest-dark disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
