"use client";

import { useActionState } from "react";
import { submitTrekRequest, type FormState } from "@/app/actions";

export default function RequestForm({ trek }: { trek: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitTrekRequest, {});

  return (
    <form action={action} className="mt-5 space-y-5">
      <label className="block">
        <span className="text-sm font-semibold">Which trek should we add?</span>
        <input
          name="trek"
          defaultValue={trek}
          required
          maxLength={80}
          className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5"
        />
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
        {pending ? "Sending…" : "Request this trek"}
      </button>
    </form>
  );
}
