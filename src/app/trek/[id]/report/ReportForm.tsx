"use client";

import { useActionState } from "react";
import { submitReport, type FormState } from "@/app/actions";

type Props = {
  trekId: string;
  washroomPoints: { id: string; name: string }[];
  wildlife: string[];
  allPoints: { id: string; name: string }[];
  issues: { id: string; label: string }[];
};

const choices = [
  { value: "there", label: "Clean" },
  { value: "dirty", label: "Not clean" },
  { value: "missing", label: "Closed / none" },
  { value: "", label: "Didn't check" },
];

export default function ReportForm({ trekId, washroomPoints, wildlife, allPoints, issues }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitReport, {});
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="mt-5 space-y-6">
      <input type="hidden" name="trekId" value={trekId} />

      <label className="block">
        <span className="text-sm font-semibold">When did you do this trek?</span>
        <input
          type="date"
          name="trekDate"
          required
          max={today}
          className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5"
        />
      </label>

      <fieldset className="rounded-2xl border border-amber/40 bg-amber-soft/60 p-3">
        <legend className="sr-only">Trail problems</legend>
        <p className="text-sm font-semibold">Any problems on the trail?</p>
        <p className="mt-1 text-xs text-muted">Shown as a warning to people doing this trek in the next 3 weeks. Skip if none.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {issues.map((i) => (
            <label
              key={i.id}
              className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-sm has-[:checked]:border-alert has-[:checked]:bg-alert-soft has-[:checked]:font-medium has-[:checked]:text-alert"
            >
              <input type="checkbox" name="issues" value={i.id} className="sr-only" />
              {i.label}
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block text-xs text-muted">
            Where? (optional)
            <select name="issuePoint" defaultValue="" className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink">
              <option value="">Not sure / whole trail</option>
              {allPoints.map((p) => (
                <option key={p.id} value={p.id}>
                  Near {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-muted">
            Details (optional)
            <input
              name="issueNote"
              maxLength={140}
              placeholder="e.g. Path cleared, but a 20 min wait"
              className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Were these washrooms there, and were they clean?</legend>
        <div className="mt-2 space-y-3">
          {washroomPoints.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-white p-3">
              <p className="text-sm font-medium">{p.name}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {choices.map((c) => (
                  <label
                    key={c.value}
                    className="cursor-pointer rounded-lg border border-line px-2 py-2 text-center text-xs has-[:checked]:border-forest has-[:checked]:bg-moss has-[:checked]:font-semibold"
                  >
                    <input
                      type="radio"
                      name={`point:${p.id}`}
                      value={c.value}
                      defaultChecked={c.value === ""}
                      className="sr-only"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">If you&apos;re a woman: how safe and comfortable did you feel on this trek?</legend>
        <p className="mt-1 text-xs text-muted">Think washrooms, privacy, crowds and safety. Optional.</p>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-lg border border-line bg-white py-2.5 text-center has-[:checked]:border-forest has-[:checked]:bg-moss has-[:checked]:font-semibold"
            >
              <input type="radio" name="womenComfort" value={n} className="sr-only" />
              {n}
            </label>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>Uncomfortable</span>
          <span>Very comfortable</span>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Any wildlife on the trail?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {wildlife.map((w) => (
            <label
              key={w}
              className="cursor-pointer rounded-full border border-line bg-white px-3 py-1.5 text-sm has-[:checked]:border-forest has-[:checked]:bg-moss has-[:checked]:font-medium"
            >
              <input type="checkbox" name="wildlife" value={w} className="sr-only" />
              {w}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">One tip for the next trekker (optional)</span>
        <textarea
          name="tip"
          maxLength={280}
          rows={3}
          placeholder="e.g. The dhaba at the halfway point lets you use their washroom for ₹10."
          className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold">Recommend a place to stay or eat (optional)</span>
        <input
          name="recommendation"
          maxLength={200}
          placeholder="e.g. Stayed at a homestay in Sari, great food, ₹1,200 a night."
          className="mt-2 block w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm"
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
        {pending ? "Saving…" : "Submit report"}
      </button>
    </form>
  );
}
