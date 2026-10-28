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
  /** Extra advice on when to go (and when not to). */
  bestTimeNote: string;
  stayOptions: { place: string; what: string; price: string }[];
  eatOptions: string[];
  /** The part of this trek that needs specific training. */
  fitnessNote: string;
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
    lastAtm: "Joshimath",
    medical: "Basic health centre in Ghangaria; hospital in Joshimath.",
    forWomen: ["No washroom or changing spot inside the valley: change and use the washroom in Ghangaria.", "The trail is shared with Hemkund Sahib pilgrims, so you are rarely alone in daytime.", "Monsoon season: carry a poncho and quick-dry layers; wet clothes are hard to change on the trail."],
    bestTimeNote: "Flowers peak from mid-July to mid-August. The park is open June to October and closed in winter.",
    stayOptions: [{"place": "Ghangaria", "what": "Guesthouses, hotels and a GMVN rest house; the Gurudwara also offers simple stay", "price": "₹1,500–4,000 a night (more in peak season)"}, {"place": "Govindghat", "what": "Hotels, if you arrive late before the climb to Ghangaria", "price": "₹1,000–3,000 a night"}],
    eatOptions: ["Dhabas in Ghangaria: dal-chawal, parathas, Maggi.", "Free langar at the Ghangaria Gurudwara.", "Nothing is sold inside the valley: pack lunch from Ghangaria."],
    fitnessNote: "Day 1 is a 10 km climb from Govindghat to Ghangaria before you even reach the valley.",
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
    roundTripHours: "16–18",
    bestSeason: "May – June, September – October",
    dryStretch: { hours: "about 2", from: "Gaurikund", to: "Jungle Chatti" },
    difficulty: "Moderate",
    maxAltitudeM: 3583,
    permits: "Char Dham yatra registration (free, online) is required.",
    gettingThere: "Rishikesh → Sonprayag by road (about 8 h) → shared jeep to Gaurikund, where the trek starts.",
    lastAtm: "Sonprayag / Guptkashi",
    medical: "Medical posts along the route and at Kedarnath.",
    forWomen: ["Washrooms are frequent but often not clean, and queues are long. Carry toilet-seat sanitiser spray, tissues and your own soap.", "Very crowded in peak season; keep valuables close.", "Modest clothing is expected at the temple.", "Ponies and palkis are available if you need to stop walking."],
    bestTimeNote: "The temple opens around May and closes around Diwali. Avoid July–August: monsoon landslides often close the route.",
    stayOptions: [{"place": "Kedarnath", "what": "GMVN cottages and tents, dharamshalas", "price": "₹1,000–5,000 a night; book early"}, {"place": "Sonprayag / Guptkashi", "what": "Hotels the night before the trek", "price": "₹1,000–3,000 a night"}],
    eatOptions: ["Dhabas all along the route: tea, Maggi, parathas.", "Simple meals and bhandaras at Kedarnath."],
    fitnessNote: "16 km uphill, usually 10+ hours: build endurance with long walks, not just short runs.",
    points: [
      { id: "gaurikund", name: "Gaurikund", minFromStart: 0, km: 0, washroom: "basic", water: true, food: "yes", network: "good", note: "Washrooms available but often not clean." },
      { id: "jungle-chatti", name: "Jungle Chatti", minFromStart: 120, km: 4, washroom: "basic", water: true, food: "yes", network: "good", note: "Washrooms available but often not clean." },
      { id: "bhimbali", name: "Bhimbali", minFromStart: 240, km: 7, washroom: "basic", water: true, food: "yes", network: "patchy", note: "Medical post. Washrooms often not clean." },
      { id: "linchauli", name: "Linchauli", minFromStart: 390, km: 11, washroom: "basic", water: true, food: "yes", network: "patchy", note: "Medical post. Washrooms often not clean." },
      { id: "kedar-base", name: "Kedarnath base camp", minFromStart: 570, km: 15, washroom: "basic", water: true, food: "yes", network: "good" },
      { id: "kedar-temple", name: "Kedarnath Temple", minFromStart: 620, km: 16, washroom: "basic", water: true, food: "yes", network: "good" },
    ],
    wildlife: ["Mules / horses"],
    tips: ["Most people walk up one day, stay overnight and come down the next.", "The climb up alone takes 10 hours or more for most people; start early.", "Walk on the hill side of the path; mules pass constantly."],
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
    lastAtm: "Ukhimath",
    medical: "Nearest health centre in Ukhimath.",
    forWomen: ["Washrooms at Chopta camps are usually shared and basic.", "Busy in daytime; the Chandrashila stretch is quieter, so go with company.", "Modest clothing is expected at the temple."],
    bestTimeNote: "Clearest Himalayan views in October–November. Snow from December to March; the Chopta road can close.",
    stayOptions: [{"place": "Chopta", "what": "Camps and tents, usually with meals", "price": "₹1,000–3,000 a night"}, {"place": "Ukhimath / Sari", "what": "Homestays and small hotels", "price": "₹800–2,500 a night"}],
    eatOptions: ["Dhabas at Chopta.", "Maggi and tea points along the trail up to Tungnath."],
    fitnessNote: "Short but steep throughout; the last stretch to Chandrashila is the steepest.",
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
    lastAtm: "Ukhimath",
    medical: "Nearest health centre in Ukhimath.",
    forWomen: ["Use a homestay washroom in Sari before you start; there is none at the lake.", "Short, popular trail; comfortable for small groups of women.", "Start back well before dark: the forest path has no lights."],
    bestTimeNote: "October–November mornings give the clearest Chaukhamba reflection in the lake.",
    stayOptions: [{"place": "Sari village", "what": "Homestays with home-cooked meals", "price": "₹800–2,000 a night"}],
    eatOptions: ["Homestay meals in Sari.", "Tea and snack stalls near the lake."],
    fitnessNote: "A gentle climb; fine for beginners with basic fitness.",
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
    lastAtm: "Sohra (Cherrapunji)",
    medical: "Health centre in Sohra.",
    forWomen: ["Nongriat homestays have shared, basic bathrooms; carry your own toiletries.", "Changing spots near the natural pools are limited: wear quick-dry clothes.", "Very steep steps: knees take a beating on the way down."],
    bestTimeNote: "Avoid heavy monsoon (June–August): the steps get slippery and rivers rise. Winter is dry and pleasant.",
    stayOptions: [{"place": "Nongriat", "what": "Village homestays, shared bathrooms, meals included", "price": "₹500–1,500 a night"}, {"place": "Sohra (Cherrapunji)", "what": "Hotels and resorts", "price": "₹1,500–5,000 a night"}],
    eatOptions: ["Home-cooked Khasi meals at Nongriat homestays.", "Snack and juice shops along the steps."],
    fitnessNote: "About 3,500 steps down and then back up: train on stairs.",
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
    lastAtm: "Malavli / Lonavala",
    medical: "Hospitals in Lonavala.",
    forWomen: ["No washroom on the climb or the fort: plan for 3–4 hours without one.", "Very crowded on monsoon weekends; weekdays are quieter.", "Rocks are slippery: wear shoes with grip, not sports sandals."],
    bestTimeNote: "Best in monsoon for waterfalls and greenery, but very slippery. Go on a weekday to avoid crowds.",
    stayOptions: [{"place": "Lonavala", "what": "Hotels and homestays (no stay at the fort)", "price": "₹1,500–5,000 a night"}],
    eatOptions: ["Vada pav and bhajiya at Bhaje village.", "Seasonal stalls on the climb in monsoon.", "Dhabas near Malavli station."],
    fitnessNote: "Rocky, steep sections, some through waterfalls: practise uphill walking.",
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
