// Base trail data, from treks done first-hand. Trekker reports (stored in Supabase)
// are layered on top of this to confirm or flag each point.

export type Washroom = "yes" | "basic" | "no";
export type Network = "good" | "patchy" | "none";

export type TrailPoint = {
  id: string;
  name: string;
  /** Typical walking time from the start, going up, in minutes. */
  minFromStart: number;
  km: number;
  washroom: Washroom;
  water: boolean;
  food: "yes" | "seasonal" | "no";
  network: Network;
  note?: string;
};

export type Trek = {
  id: string;
  name: string;
  region: string;
  start: string;
  oneWayKm: number;
  roundTripHours: string;
  bestSeason: string;
  /** The longest stretch without any washroom, written for the trekker. */
  dryStretch: { hours: string; from: string; to: string };
  difficulty: "Easy" | "Easy–moderate" | "Moderate" | "Moderate–hard";
  maxAltitudeM: number;
  permits: string;
  gettingThere: string;
  stay: string;
  lastAtm: string;
  medical: string;
  /** What women trekkers most often ask about: privacy, safety, crowds, clothing. */
  forWomen: string[];
  points: TrailPoint[];
  wildlife: string[];
  tips: string[];
};

export const WILDLIFE = [
  "Snakes",
  "Leeches",
  "Monkeys",
  "Leopard",
  "Himalayan black bear",
  "Elephant",
  "Stray dogs",
  "Mules / horses",
] as const;

export const treks: Trek[] = [
  {
    id: "valley-of-flowers",
    name: "Valley of Flowers",
    region: "Chamoli, Uttarakhand",
    start: "Ghangaria",
    oneWayKm: 4,
    roundTripHours: "5–6",
    bestSeason: "July – September",
    dryStretch: { hours: "4–5", from: "Ghangaria", to: "the valley and back" },
    difficulty: "Easy–moderate",
    maxAltitudeM: 3658,
    permits: "Forest entry permit at the park gate (per person, valid 3 days). Carry an ID.",
    gettingThere: "Rishikesh → Govindghat by road (about 10 h) → 10 km trek or helicopter to Ghangaria.",
    stay: "Hotels and guesthouses in Ghangaria. No stay inside the park.",
    lastAtm: "Joshimath",
    medical: "Basic health centre in Ghangaria; hospital in Joshimath.",
    forWomen: ["No washroom or changing spot inside the valley: change and use the washroom in Ghangaria.", "The trail is shared with Hemkund Sahib pilgrims, so you are rarely alone in daytime.", "Monsoon season: carry a poncho and quick-dry layers; wet clothes are hard to change on the trail."],
    points: [
      { id: "ghangaria", name: "Ghangaria", minFromStart: 0, km: 0, washroom: "yes", water: true, food: "yes", network: "patchy", note: "Last proper washroom. Hotels and dhabas." },
      { id: "vof-gate", name: "Park entry gate", minFromStart: 15, km: 0.5, washroom: "basic", water: false, food: "no", network: "none", note: "Entry permit checked here. Plastic is counted." },
      { id: "pushpawati", name: "Pushpawati river bridge", minFromStart: 75, km: 2, washroom: "no", water: false, food: "no", network: "none" },
      { id: "vof-meadow", name: "Main valley meadow", minFromStart: 150, km: 4, washroom: "no", water: false, food: "no", network: "none", note: "Nothing is sold inside the park. Carry food and water." },
    ],
    wildlife: ["Himalayan black bear", "Snakes"],
    tips: ["Entry closes around 2 pm and you must exit by about 5 pm.", "Carry all your plastic back out; it is checked at the gate."],
  },
  {
    id: "kedarnath",
    name: "Kedarnath Temple",
    region: "Rudraprayag, Uttarakhand",
    start: "Gaurikund",
    oneWayKm: 16,
    roundTripHours: "12–14",
    bestSeason: "May – June, September – October",
    dryStretch: { hours: "about 1.5", from: "Gaurikund", to: "Jungle Chatti" },
    difficulty: "Moderate",
    maxAltitudeM: 3583,
    permits: "Char Dham yatra registration (free, online) is required.",
    gettingThere: "Rishikesh → Sonprayag by road (about 8 h) → shared jeep to Gaurikund, where the trek starts.",
    stay: "GMVN huts, tents and dharamshalas at Kedarnath; book ahead in peak season.",
    lastAtm: "Sonprayag / Guptkashi",
    medical: "Medical posts along the route and at Kedarnath.",
    forWomen: ["Washrooms are frequent, with separate women's sections at main stops, but queues can be long.", "Very crowded in peak season; keep valuables close.", "Modest clothing is expected at the temple.", "Ponies and palkis are available if you need to stop walking."],
    points: [
      { id: "gaurikund", name: "Gaurikund", minFromStart: 0, km: 0, washroom: "yes", water: true, food: "yes", network: "good" },
      { id: "jungle-chatti", name: "Jungle Chatti", minFromStart: 90, km: 4, washroom: "yes", water: true, food: "yes", network: "good" },
      { id: "bhimbali", name: "Bhimbali", minFromStart: 180, km: 7, washroom: "yes", water: true, food: "yes", network: "patchy", note: "Medical post." },
      { id: "linchauli", name: "Linchauli", minFromStart: 300, km: 11, washroom: "yes", water: true, food: "yes", network: "patchy", note: "Medical post." },
      { id: "kedar-base", name: "Kedarnath base camp", minFromStart: 420, km: 15, washroom: "yes", water: true, food: "yes", network: "good" },
      { id: "kedar-temple", name: "Kedarnath Temple", minFromStart: 450, km: 16, washroom: "yes", water: true, food: "yes", network: "good" },
    ],
    wildlife: ["Mules / horses"],
    tips: ["Most people walk up one day, stay overnight and come down the next.", "Washrooms are frequent but queues are long in peak season.", "Walk on the hill side of the path; mules pass constantly."],
  },
  {
    id: "tungnath-chandrashila",
    name: "Tungnath – Chandrashila",
    region: "Chopta, Uttarakhand",
    start: "Chopta",
    oneWayKm: 5,
    roundTripHours: "5–6",
    bestSeason: "April – June, September – November",
    dryStretch: { hours: "about 1.5", from: "Tungnath Temple", to: "Chandrashila peak and back" },
    difficulty: "Easy–moderate",
    maxAltitudeM: 4000,
    permits: "No trek permit needed for day hikes.",
    gettingThere: "Rishikesh → Chopta by road via Ukhimath (about 8–9 h).",
    stay: "Camps and basic lodges at Chopta; more options in Ukhimath.",
    lastAtm: "Ukhimath",
    medical: "Nearest health centre in Ukhimath.",
    forWomen: ["Washrooms at Chopta camps are usually shared and basic.", "Busy in daytime; the Chandrashila stretch is quieter, so go with company.", "Modest clothing is expected at the temple."],
    points: [
      { id: "chopta", name: "Chopta", minFromStart: 0, km: 0, washroom: "basic", water: true, food: "yes", network: "patchy" },
      { id: "tungnath-dhabas", name: "Mid-way dhabas", minFromStart: 60, km: 1.8, washroom: "no", water: true, food: "yes", network: "patchy" },
      { id: "tungnath-temple", name: "Tungnath Temple", minFromStart: 135, km: 3.5, washroom: "basic", water: true, food: "yes", network: "patchy" },
      { id: "chandrashila", name: "Chandrashila peak", minFromStart: 195, km: 5, washroom: "no", water: false, food: "no", network: "none", note: "Steep and exposed. Nothing at the top." },
    ],
    wildlife: ["Leopard", "Monkeys"],
    tips: ["Start early; clouds usually roll in by noon.", "Part of a wildlife sanctuary: Himalayan monal and musk deer live here."],
  },
  {
    id: "deoria-tal",
    name: "Deoria Tal",
    region: "Sari village, Uttarakhand",
    start: "Sari village",
    oneWayKm: 2.5,
    roundTripHours: "3",
    bestSeason: "Year-round (snow December – February)",
    dryStretch: { hours: "about 2.5", from: "Sari village", to: "the lake and back" },
    difficulty: "Easy",
    maxAltitudeM: 2438,
    permits: "Forest entry fee at the checkpost.",
    gettingThere: "Rishikesh → Sari village by road via Ukhimath (about 8 h).",
    stay: "Homestays in Sari. No overnight camping at the lake.",
    lastAtm: "Ukhimath",
    medical: "Nearest health centre in Ukhimath.",
    forWomen: ["Use a homestay washroom in Sari before you start; there is none at the lake.", "Short, popular trail; comfortable for small groups of women.", "Start back well before dark: the forest path has no lights."],
    points: [
      { id: "sari", name: "Sari village", minFromStart: 0, km: 0, washroom: "yes", water: true, food: "yes", network: "good", note: "Homestays and shops." },
      { id: "deoria-mid", name: "Mid-trail stall", minFromStart: 45, km: 1.3, washroom: "no", water: true, food: "seasonal", network: "patchy" },
      { id: "deoria-lake", name: "Deoria Tal lake", minFromStart: 90, km: 2.5, washroom: "no", water: true, food: "yes", network: "patchy", note: "Forest entry fee. Overnight camping at the lake is not allowed." },
    ],
    wildlife: ["Leopard"],
    tips: ["Use the washroom in Sari before you start.", "Head back before dark."],
  },
  {
    id: "double-decker",
    name: "Double Decker Root Bridge",
    region: "Nongriat, Meghalaya",
    start: "Tyrna village",
    oneWayKm: 3,
    roundTripHours: "5–6",
    bestSeason: "October – April",
    dryStretch: { hours: "about 2", from: "Tyrna", to: "Nongriat village" },
    difficulty: "Moderate",
    maxAltitudeM: 1100,
    permits: "Small entry fee at the bridges.",
    gettingThere: "Shillong → Sohra (Cherrapunji) → Tyrna village by road (about 2.5 h).",
    stay: "Homestays in Nongriat (shared bathrooms) or hotels in Sohra.",
    lastAtm: "Sohra (Cherrapunji)",
    medical: "Health centre in Sohra.",
    forWomen: ["Nongriat homestays have shared, basic bathrooms; carry your own toiletries.", "Changing spots near the natural pools are limited: wear quick-dry clothes.", "Very steep steps: knees take a beating on the way down."],
    points: [
      { id: "tyrna", name: "Tyrna village (top of the steps)", minFromStart: 0, km: 0, washroom: "yes", water: true, food: "yes", network: "good" },
      { id: "steps-shops", name: "Shops on the steps", minFromStart: 60, km: 1.5, washroom: "no", water: true, food: "yes", network: "patchy" },
      { id: "single-bridge", name: "Single root bridge", minFromStart: 90, km: 2.2, washroom: "no", water: false, food: "no", network: "none" },
      { id: "nongriat", name: "Nongriat village & Double Decker bridge", minFromStart: 120, km: 3, washroom: "yes", water: true, food: "yes", network: "none", note: "Homestay washrooms, usually a small fee." },
    ],
    wildlife: ["Snakes", "Leeches"],
    tips: ["About 3,500 steps each way; the climb back up is the hard part.", "In monsoon carry salt or leech socks."],
  },
  {
    id: "visapur",
    name: "Visapur Fort",
    region: "Lonavala, Maharashtra",
    start: "Malavli station",
    oneWayKm: 4,
    roundTripHours: "4–5",
    bestSeason: "June – September (monsoon)",
    dryStretch: { hours: "3–4", from: "Bhaje village", to: "the fort and back" },
    difficulty: "Easy–moderate",
    maxAltitudeM: 1084,
    permits: "No permit needed.",
    gettingThere: "Local train from Pune or Lonavala to Malavli station, then walk to Bhaje village.",
    stay: "No stay at the fort; hotels in Lonavala.",
    lastAtm: "Malavli / Lonavala",
    medical: "Hospitals in Lonavala.",
    forWomen: ["No washroom on the climb or the fort: plan for 3–4 hours without one.", "Very crowded on monsoon weekends; weekdays are quieter.", "Rocks are slippery: wear shoes with grip, not sports sandals."],
    points: [
      { id: "malavli", name: "Malavli station", minFromStart: 0, km: 0, washroom: "yes", water: true, food: "yes", network: "good" },
      { id: "bhaje", name: "Bhaje village (base)", minFromStart: 30, km: 2, washroom: "basic", water: true, food: "yes", network: "good", note: "Restaurants may let you use their washroom." },
      { id: "visapur-mid", name: "Mid-climb stalls", minFromStart: 90, km: 3, washroom: "no", water: true, food: "seasonal", network: "good", note: "Stalls open mostly in monsoon." },
      { id: "visapur-top", name: "Visapur Fort top", minFromStart: 130, km: 4, washroom: "no", water: false, food: "no", network: "good", note: "Fort water tanks are not safe to drink." },
    ],
    wildlife: ["Snakes", "Monkeys"],
    tips: ["Rocks are very slippery in monsoon; wear shoes with grip.", "Keep food inside your bag; monkeys grab it."],
  },
];

export function getTrek(id: string) {
  return treks.find((t) => t.id === id);
}
