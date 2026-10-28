import type { Trek } from "@/data/treks";

export type ChecklistGroup = { title: string; items: { id: string; text: string }[] };

/** Prep checklist derived from what is (and isn't) on this trail. */
export function buildChecklist(trek: Trek): ChecklistGroup[] {
  const hasDryTop = trek.points.some((p) => p.washroom === "no");
  const waterGaps = trek.points.filter((p) => !p.water).length;
  const noNetwork = trek.points.some((p) => p.network === "none");
  const w = new Set(trek.wildlife);

  const groups: ChecklistGroup[] = [];

  const washroom: ChecklistGroup = { title: "Washroom plan", items: [] };
  washroom.items.push({
    id: "use-start",
    text: `Use the washroom at ${trek.dryStretch.from} before you set off. The stretch after it has no washroom for ${trek.dryStretch.hours} hours.`,
  });
  if (hasDryTop) {
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
  groups.push(water);

  const safety: ChecklistGroup = { title: "Network and safety", items: [] };
  if (noNetwork) {
    safety.items.push(
      { id: "offline", text: "Download an offline map of the area; there is no network on part of the trail." },
      { id: "tell", text: "Tell someone your route and when you expect to be back." },
    );
  }
  safety.items.push({ id: "dark", text: "Plan to be back before dark." });
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
