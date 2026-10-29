import type { Trek } from "@/data/treks";

export type ChecklistGroup = { title: string; items: { id: string; text: string }[] };

export type FitnessPlan = { weeks: number; target: string; items: { id: string; text: string }[] };

/** A simple training plan scaled to the trek's difficulty. */
export function fitnessPlan(trek: Trek): FitnessPlan {
  switch (trek.difficulty) {
    case "Easy":
      return {
        weeks: 2,
        target: "Walk 5 km comfortably without stopping.",
        items: [
          { id: "fit-walk", text: "Walk briskly for 30–45 minutes, 5 days a week." },
          { id: "fit-stairs", text: "Climb 10 floors of stairs, 3 times a week." },
        ],
      };
    case "Easy–moderate":
      return {
        weeks: 4,
        target: "Walk or jog 4 km in about 30 minutes.",
        items: [
          { id: "fit-cardio", text: "Brisk walk or jog 4 km, 4 days a week." },
          { id: "fit-stairs", text: "Climb 15 floors of stairs, 3 times a week." },
          { id: "fit-legs", text: "Squats and lunges, 3 sets of 15, 3 times a week." },
        ],
      };
    default:
      return {
        weeks: 6,
        target: "Jog 5 km in under 40 minutes.",
        items: [
          { id: "fit-cardio", text: "Jog 5 km, 4 days a week, getting a little faster each week." },
          { id: "fit-stairs", text: "Stair climbs with a 5 kg backpack, 3 times a week." },
          { id: "fit-legs", text: "Squats and lunges, 3 sets of 15, 3 times a week." },
          { id: "fit-long", text: "One long walk of 10 km or more every weekend." },
        ],
      };
  }
}

/** Prep checklist derived from what is (and isn't) on this trail. */
export function buildChecklist(trek: Trek): ChecklistGroup[] {
  const hasDryTop = trek.points.some((p) => p.washroom === "no");
  const hasBasic = trek.points.some((p) => p.washroom === "basic");
  const waterGaps = trek.points.filter((p) => !p.water).length;
  const noNetwork = trek.points.some((p) => p.network === "none");
  const w = new Set(trek.wildlife);

  const groups: ChecklistGroup[] = [];

  const fit = fitnessPlan(trek);
  groups.push({
    title: `Get trek-fit (start ${fit.weeks} weeks before)`,
    items: [...fit.items, { id: "fit-target", text: `Target: ${fit.target} ${trek.fitnessNote}` }],
  });

  const washroom: ChecklistGroup = { title: "Washroom plan", items: [] };
  washroom.items.push({
    id: "use-start",
    text: `Use the washroom at ${trek.dryStretch.from} before you set off. The stretch after it has no washroom for ${trek.dryStretch.hours} hours.`,
  });
  if (hasBasic) {
    washroom.items.push({ id: "seat-spray", text: "Washrooms on this trail are often not clean: carry toilet-seat sanitiser spray and your own soap." });
  }
  if (hasDryTop || hasBasic) {
    washroom.items.push(
      { id: "kit", text: "Pack a small washroom kit: tissues, wet wipes, hand sanitiser." },
      { id: "bags", text: "Carry 2–3 zip-lock bags to pack out used tissues and pads. Don't leave them on the trail." },
      { id: "fud", text: "Optional: a female urination device (FUD) makes going outdoors much easier." },
      { id: "period", text: "If you may be on your period: extra pads or a cup, plus an opaque disposal bag." },
    );
  }
  groups.push(washroom);

  const water: ChecklistGroup = { title: "Water and food", items: [] };
  water.items.push({
    id: "water",
    text: waterGaps > 0 ? "Carry at least 2 litres of water; some stretches have no refill point." : "Carry 1 litre; refill points are frequent.",
  });
  water.items.push({ id: "sip", text: "Sip small amounts often instead of skipping water to avoid a washroom break." });
  if (trek.points.some((p) => p.food !== "yes")) water.items.push({ id: "snacks", text: "Pack snacks: food is not available on every stretch." });
  water.items.push({ id: "food-plan", text: trek.foodWarning });
  groups.push(water);

  if (trek.points.some((p) => (p.day ?? 1) > 1)) {
    groups.push({
      title: "Multi-day camping",
      items: [
        { id: "camp-operator", text: "Confirm with your operator: tents, sleeping bags, meals, toilet tents (separate for women?) and permits." },
        { id: "camp-layers", text: "Warm layers for nights at camp: thermals, fleece, down jacket, woollen cap and gloves." },
        { id: "camp-light", text: "Headlamp and a power bank: there is no electricity on the trail." },
        { id: "camp-hygiene", text: "Wet wipes, dry shampoo and a small towel: there is no bathing on the trail." },
      ],
    });
  }

  const safety: ChecklistGroup = { title: "Network and safety", items: [] };
  if (noNetwork) {
    safety.items.push(
      { id: "offline", text: "Download an offline map of the area; there is no network on part of the trail." },
      { id: "tell", text: "Tell someone your route and when you expect to be back." },
    );
  }
  safety.items.push(
    { id: "dark", text: "Plan to be back before dark." },
    ...(trek.maxAltitudeM >= 3000
      ? [{ id: "altitude", text: "Above 3,000 m: go slow, drink water, and turn back if a headache or nausea gets worse." }]
      : []),
    { id: "emergency", text: `Save 112 (India emergency) and note the nearest medical help: ${trek.medical}` },
    { id: "cash", text: `Carry enough cash: the last ATM is in ${trek.lastAtm}.` },
  );
  groups.push(safety);

  const wild: ChecklistGroup = { title: "Wildlife reported on this trail", items: [] };
  if (w.has("Snakes")) wild.items.push({ id: "snakes", text: "Snakes: wear closed shoes, stay on the path, don't put hands into rock gaps." });
  if (w.has("Leeches")) wild.items.push({ id: "leeches", text: "Leeches: carry salt and wear leech socks in the wet season." });
  if (w.has("Monkeys")) wild.items.push({ id: "monkeys", text: "Monkeys: keep food zipped inside your bag; don't eat in the open." });
  if (w.has("Leopard") || w.has("Himalayan black bear"))
    wild.items.push({ id: "big-cats", text: "Leopards and bears are rarely seen: trek in a group, talk as you walk, and never trek after dark." });
  if (w.has("Elephant")) wild.items.push({ id: "elephants", text: "Elephants: keep a large distance, never block their path, follow local guides." });
  if (w.has("Mules / horses")) wild.items.push({ id: "mules", text: "Mules: step to the hill side of the path when they pass." });
  if (wild.items.length) groups.push(wild);

  return groups;
}
