"""Builds static topo maps for each trek: a stitched OpenTopoMap image plus
pixel positions of the route, trail points and nearby places, written to
src/data/maps.ts so the app can draw them as an SVG overlay."""
import json, math, os, subprocess, time, io
from PIL import Image

APP = "/Users/sabdanshinegi/Desktop/Assignment3Claude/trailbrief"
TILE_CACHE = "tiles"
UA = "TrailBrief/1.0 (student project; ishantchoudhry87@gmail.com)"
os.makedirs(TILE_CACHE, exist_ok=True)
os.makedirs(f"{APP}/public/maps", exist_ok=True)

routes = json.load(open("routes.json"))  # [lon, lat] lists from the OSM foot router

# Extra straight segments where OSM has no mapped path.
extra = {
    "tungnath-chandrashila": [(30.48646, 79.22123)],
    "har-ki-dun": [(31.11259, 78.33406), (31.1189, 78.34277), (31.1380, 78.4000), (31.14813, 78.43242)],
}

# km of each trail point, in order (mirrors src/data/treks.ts).
points = {
    "valley-of-flowers": [("ghangaria", 0), ("vof-gate", 0.5), ("pushpawati", 2), ("vof-meadow", 4)],
    "kedarnath": [("gaurikund", 0), ("jungle-chatti", 4), ("bhimbali", 7), ("linchauli", 11), ("kedar-base", 15), ("kedar-temple", 16)],
    "tungnath-chandrashila": [("chopta", 0), ("tungnath-dhabas", 1.8), ("tungnath-temple", 3.5), ("chandrashila", 5)],
    "deoria-tal": [("sari", 0), ("deoria-mid", 1.3), ("deoria-lake", 2.5)],
    "double-decker": [("tyrna", 0), ("steps-shops", 1.5), ("single-bridge", 2.2), ("nongriat", 3)],
    "visapur": [("malavli", 0), ("bhaje", 2), ("visapur-mid", 3), ("visapur-top", 4)],
    "har-ki-dun": [("taluka", 0), ("gangad", 7), ("pauni-garaat", 11), ("kalkattiyadhar", 19), ("har-ki-dun", 24)],
}

# Nearby places: name, kinds, lat, lon, note
nearby = {
    "valley-of-flowers": [
        ("Ghangaria", ["stay", "food", "medical"], 30.70145, 79.5938, "Hotels, dhabas, basic health centre"),
        ("Govindghat", ["start", "stay"], 30.61923, 79.56197, "Road ends here; 10 km climb to Ghangaria"),
        ("Joshimath", ["medical", "atm", "stay"], 30.55558, 79.56126, "Hospital, last ATM"),
    ],
    "kedarnath": [
        ("Kedarnath", ["stay", "food"], 30.7352, 79.0669, "GMVN tents, dharamshalas"),
        ("Hospital", ["medical"], 30.72454, 79.06986, "Charitable hospital near base camp"),
        ("Gaurikund", ["start"], 30.6534, 79.02682, "Trek starts here"),
        ("Sonprayag", ["stay", "atm"], 30.63171, 78.99866, "Parking, shared jeeps, hotels"),
        ("Guptkashi", ["stay", "atm"], 30.52832, 79.08178, "Hotels the night before"),
    ],
    "tungnath-chandrashila": [
        ("Chopta", ["start", "stay", "food"], 30.4782, 79.2106, "Camps and dhabas"),
        ("Sari", ["stay"], 30.51688, 79.13526, "Homestays"),
        ("Deoria Tal", ["sight"], 30.52211, 79.12754, "Lake trek, often combined"),
        ("Ukhimath", ["medical", "atm", "stay"], 30.51395, 79.09476, "Health centre, last ATM"),
    ],
    "deoria-tal": [
        ("Sari", ["start", "stay", "food"], 30.51688, 79.13526, "Homestays with meals"),
        ("Ukhimath", ["medical", "atm", "stay"], 30.51395, 79.09476, "Health centre, last ATM"),
        ("Chopta", ["stay", "sight"], 30.4782, 79.2106, "Camps; start of Tungnath trek"),
    ],
    "double-decker": [
        ("Tyrna", ["start", "food"], 25.24112, 91.68078, "Top of the steps"),
        ("Nongriat", ["stay", "food"], 25.25102, 91.67138, "Village homestays"),
        ("Sohra (Cherrapunji)", ["medical", "atm", "stay"], 25.27773, 91.72924, "Health centre, ATMs, hotels"),
    ],
    "visapur": [
        ("Malavli station", ["start", "food"], 18.74486, 73.48332, "Local train stop"),
        ("Bhaje village", ["food"], 18.72891, 73.48131, "Vada pav, base of the climb"),
        ("Lonavala", ["medical", "atm", "stay"], 18.75486, 73.40167, "Hospitals, ATMs, hotels"),
    ],
    "har-ki-dun": [
        ("Sankri", ["stay", "atm"], 31.07802, 78.18411, "Guesthouses, forest permit office"),
        ("Taluka", ["start"], 31.07782, 78.24579, "Road head, jeep from Sankri"),
        ("Osla", ["stay"], 31.1189, 78.34277, "Village homestays"),
        ("Mori", ["medical"], 31.01921, 78.04625, "Basic health centre"),
    ],
}


def world(lat, lon, z):
    n = 256 * 2 ** z
    s = math.sin(math.radians(lat))
    return (lon + 180) / 360 * n, (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n


def tile(z, x, y):
    path = f"{TILE_CACHE}/{z}_{x}_{y}.png"
    if not os.path.exists(path):
        sub = "abc"[(x + y) % 3]
        subprocess.run(["curl", "-s", "-f", "-m", "30", "-A", UA, "-o", path,
                        f"https://{sub}.tile.opentopomap.org/{z}/{x}/{y}.png"], check=True)
        time.sleep(0.3)
    return Image.open(path).convert("RGB")


def render(name, coords, W, H, pad, maxz, minz=8):
    lats = [c[0] for c in coords]; lons = [c[1] for c in coords]
    z = maxz
    while z > minz:
        x0, y0 = world(max(lats), min(lons), z); x1, y1 = world(min(lats), max(lons), z)
        if x1 - x0 <= W - 2 * pad and y1 - y0 <= H - 2 * pad:
            break
        z -= 1
    x0, y0 = world(max(lats), min(lons), z); x1, y1 = world(min(lats), max(lons), z)
    left, top = (x0 + x1) / 2 - W / 2, (y0 + y1) / 2 - H / 2
    img = Image.new("RGB", (W, H))
    for tx in range(int(left // 256), int((left + W) // 256) + 1):
        for ty in range(int(top // 256), int((top + H) // 256) + 1):
            img.paste(tile(z, tx, ty), (int(tx * 256 - left), int(ty * 256 - top)))
    img.save(f"{APP}/public/maps/{name}.jpg", quality=82, optimize=True, progressive=True)

    def proj(lat, lon):
        x, y = world(lat, lon, z)
        return round(x - left, 1), round(y - top, 1)
    return proj, z


def path_d(xy):
    out, last = [], None
    for x, y in xy:
        if last and abs(x - last[0]) + abs(y - last[1]) < 2:
            continue
        out.append(f"{x} {y}"); last = (x, y)
    if last != xy[-1]:
        out.append(f"{xy[-1][0]} {xy[-1][1]}")
    return "M" + " L".join(out)


def along(route, frac):
    """Point at a fraction of the route's length."""
    seg = [math.dist(route[i], route[i + 1]) for i in range(len(route) - 1)]
    target = frac * sum(seg)
    for i, d in enumerate(seg):
        if target <= d or i == len(seg) - 1:
            t = 0 if d == 0 else min(1, target / d)
            (a, b), (c, e) = route[i], route[i + 1]
            return a + (c - a) * t, b + (e - b) * t
        target -= d


result = {}
for trek, geom in routes.items():
    route = [(lat, lon) for lon, lat in geom] + extra.get(trek, [])
    maxkm = points[trek][-1][1]
    pts = [(pid, *along(route, km / maxkm)) for pid, km in points[trek]]

    proj, z = render(f"{trek}-trail", route, 1000, 700, 80, 16)
    trail = {"start": [round(route[0][0], 5), round(route[0][1], 5)], "src": f"/maps/{trek}-trail.jpg", "w": 1000, "h": 700, "zoom": z,
             "route": path_d([proj(*c) for c in route]),
             "points": [{"id": pid, "x": proj(la, lo)[0], "y": proj(la, lo)[1]} for pid, la, lo in pts]}

    places = nearby[trek]
    proj2, z2 = render(f"{trek}-nearby", route + [(p[2], p[3]) for p in places], 1000, 700, 110, 14)
    near = {"src": f"/maps/{trek}-nearby.jpg", "w": 1000, "h": 700, "zoom": z2,
            "route": path_d([proj2(*c) for c in route]),
            "places": [{"name": n, "kinds": k, "note": note, "x": proj2(la, lo)[0], "y": proj2(la, lo)[1]}
                       for n, k, la, lo, note in places]}
    result[trek] = {"trail": trail, "nearby": near}
    print(trek, "trail z", z, "nearby z", z2)

ts = """// Generated by scripts/build_maps.py from OpenStreetMap data. Do not edit by hand.
// Map tiles: OpenTopoMap (CC-BY-SA), map data © OpenStreetMap contributors.

export type PlaceKind = "start" | "stay" | "food" | "medical" | "atm" | "sight";

export type TrekMaps = {
  trail: { start: [number, number]; src: string; w: number; h: number; zoom: number; route: string; points: { id: string; x: number; y: number }[] };
  nearby: {
    src: string; w: number; h: number; zoom: number; route: string;
    places: { name: string; kinds: PlaceKind[]; note: string; x: number; y: number }[];
  };
};

export const trekMaps: Record<string, TrekMaps> = """ + json.dumps(result, indent=1) + ";\n"
open(f"{APP}/src/data/maps.ts", "w").write(ts)
