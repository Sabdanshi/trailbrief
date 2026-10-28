# TrailBrief

Know what's on the trail before you go: washrooms, water, network and wildlife on Indian treks,
confirmed by trekkers who just walked them.

One journey: pick a trek → read the briefing → get a prep checklist → report back after the trek.

## Run locally

```bash
npm install
cp .env.example .env.local   # add your Supabase URL and anon key (optional for local)
npm run dev
```

Without Supabase keys the app keeps reports in memory, which is fine for a quick local try.

## Data

- Base trail data: `src/data/treks.ts` (from treks done first-hand).
- Trekker reports and feedback: Supabase tables in `supabase/schema.sql`.

Built with Next.js, Tailwind CSS and Supabase; deployed on Vercel.

## Photos and maps

- Trek photos are openly licensed images from Wikimedia Commons (`public/photos`), credited on each page (see `src/data/photos.ts`).
- Static trail maps (`public/maps`) are stitched OpenTopoMap tiles with the route traced from OpenStreetMap foot paths. `scripts/build_maps.py` generates the images and `src/data/maps.ts`. Map data © OpenStreetMap contributors; map style © OpenTopoMap (CC-BY-SA).
