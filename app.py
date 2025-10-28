import os
import csv
from flask import Flask, render_template

app = Flask(__name__, static_folder="static", template_folder="templates")

# Use the current folder (your V2 folder) for CSVs
CSV_DIR = os.path.abspath(os.path.dirname(__file__))

FILES = {
    "about": "HEC Experience India Dataset - about me.csv",
    "news": "HEC Experience India Dataset - news.csv",
    "bollywood": "HEC Experience India Dataset - bollywood.csv",
    "restaurants": "HEC Experience India Dataset - restaurants.csv",
    "recipes": "HEC Experience India Dataset - recipes.csv",
    "events": "HEC Experience India Dataset - events.csv",
    "resources": "HEC Experience India Dataset - resources.csv",
}

def norm(s: str) -> str:
    return (s or "").strip().lower().replace("-", " ").replace("_", " ")

def pick(d: dict, candidates, default: str = "", exact_only: bool = False):
    # exact matches first
    for key in d.keys():
        nk = norm(key)
        for c in candidates:
            if nk == c:
                return (d[key] or "").strip(), key
    if exact_only:
        return default, None
    # relaxed contains match
    for key in d.keys():
        nk = f" {norm(key)} "
        for c in candidates:
            if f" {c} " in nk:
                return (d[key] or "").strip(), key
    return default, None

def read_csv_rows(path: str):
    rows = []
    if not os.path.exists(path):
        return rows
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({k: (v or "").strip() for k, v in r.items()})
    return rows

PREFERRED = {
    "restaurants": ["cuisine", "location", "area", "city", "neighbourhood", "rating", "price", "cost", "phone", "hours", "timings"],
    "recipes": ["ingredients", "prep time", "cook time", "total time", "servings", "difficulty", "author"],
    "news": ["source", "publisher", "date", "author", "category"],
    "events": ["date", "start date", "end date", "time", "venue", "location", "city", "organizer"],
    "resources": ["category", "topic", "organization", "publisher", "format"],
    "bollywood": ["release year", "year", "genre", "cast", "director", "platform", "runtime", "imdb"],
    "about": ["email", "phone", "role", "organization", "location", "linkedin", "website"],
}

def map_row_to_card(row, section):
    title, title_key = pick(row, ["title", "name", "heading", "headline", "movie title", "restaurant name"])
    desc,  desc_key  = pick(row, ["description", "desc", "summary", "snippet", "about", "overview"])
    image, image_key = pick(row, ["image url", "image", "img", "poster url", "poster", "thumbnail", "thumb", "photo", "photo url"])

    if section == "restaurants":
        link, link_key = pick(row, ["google maps url", "google map url", "map url", "gmap url", "url", "link"], exact_only=True)
    elif section == "news":
        link, link_key = pick(row, ["article url", "news url", "source url", "url", "link"], exact_only=True)
    elif section in ["recipes", "events", "resources"]:
        link, link_key = pick(row, ["recipe url", "page url", "website", "source url", "url", "link"], exact_only=True)
    elif section == "bollywood":
        link, link_key = "", None
    elif section == "about":
        link, link_key = pick(row, ["url", "website", "link"], exact_only=True)
    else:
        link, link_key = pick(row, ["url", "link"], exact_only=True)

    exclude_keys = {k for k in [title_key, desc_key, image_key, link_key] if k}
    meta = []
    for k, v in row.items():
        if not v or k in exclude_keys:
            continue
        nk = norm(k)
        if nk in ["image url", "image", "img", "poster url", "poster", "thumbnail", "thumb", "photo", "photo url"]:
            continue
        if nk in ["url", "link", "page url", "website", "source url", "recipe url",
                  "google maps url", "google map url", "map url", "gmap url", "article url", "news url"]:
            continue
        meta.append((k.strip(), v.strip()))

    prefs = [norm(x) for x in PREFERRED.get(section, [])]
    meta.sort(key=lambda kv: (0 if norm(kv[0]) in prefs else 1,
                              prefs.index(norm(kv[0])) if norm(kv[0]) in prefs else 9999))
    return {
        "title": title or "(Untitled)",
        "desc": desc,
        "image": image,
        "link": link,
        "section": section,
        "meta": meta,
    }

def load_dataset():
    data = {}
    about_rows = read_csv_rows(os.path.join(CSV_DIR, FILES["about"]))
    if about_rows:
        r0 = about_rows[0]
        about_card = map_row_to_card(r0, "about")
        exp, _ = pick(r0, ["experience", "bio", "profile", "long bio", "details"])
        about_card["experience"] = exp
    else:
        about_card = {"title": "About", "desc": "", "image": "", "link": "", "section": "about", "experience": "", "meta": []}
    data["about"] = about_card

    for sec in ["news", "bollywood", "restaurants", "recipes", "events", "resources"]:
        rows = read_csv_rows(os.path.join(CSV_DIR, FILES[sec]))
        data[sec] = [map_row_to_card(r, sec) for r in rows]
    return data

SITE_DATA = load_dataset()

@app.route("/")
def index():
    return render_template(
        "index.html",
        about=SITE_DATA["about"],
        news=SITE_DATA["news"],
        bollywood=SITE_DATA["bollywood"],
        restaurants=SITE_DATA["restaurants"],
        recipes=SITE_DATA["recipes"],
        events=SITE_DATA["events"],
        resources=SITE_DATA["resources"],
        CHUNK=6,  # still 6 per click, but each card is smaller now
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
