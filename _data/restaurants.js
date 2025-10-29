// _data/restaurants.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    const csvPath = path.join(__dirname, "../data/restaurants.csv");
    const rows = parseCSV(csvPath);

    return (rows || [])
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        // Parser normalizes headers to lowercase_snake_case
        const title = r.name || r.restaurant || r.title || "";

        // Common aliases
        const image = r.image_url || r.image || r.img || r.thumbnail || "";
        const link  = r.google_maps_url || r.maps_url || r.url || r.link || r.href || "";

        const city        = r.city || r.location_city || "";
        const area        = r.neighborhood || r.area || "";
        const location    = r.location || r.address || [area, city].filter(Boolean).join(", ");
        const cuisine     = r.cuisine_type || r.cuisine || "";
        const priceRange  = r.price_range || r.price || r.cost || "";

        // Short on-card description
        const parts = [];
        if (location)   parts.push(location);
        if (cuisine)    parts.push(cuisine);
        if (priceRange) parts.push(priceRange);
        const desc = parts.join(" | ").slice(0, 140);

        // Meta (your template shows up to 3 tags)
        const meta = [];
        if (r.rating)                    meta.push(["Rating", String(r.rating)]);
        if (r.phone)                     meta.push(["Phone", String(r.phone)]);
        if (r.hours || r.opening_hours)  meta.push(["Hours", String(r.hours || r.opening_hours)]);
        if (r.vegetarian_friendly)       meta.push(["Veg-friendly", yesNo(r.vegetarian_friendly)]);
        if (r.vegan_friendly)            meta.push(["Vegan", yesNo(r.vegan_friendly)]);
        if (r.reservations)              meta.push(["Reservations", yesNo(r.reservations)]);
        if (r.delivery)                  meta.push(["Delivery", yesNo(r.delivery)]);
        if (r.takeaway || r.take_out)    meta.push(["Takeaway", yesNo(r.takeaway || r.take_out)]);

        // Flexible meta pairs: meta1_label/meta1_value ... meta10_value
        for (let i = 1; i <= 10; i++) {
          const l = r[`meta${i}_label`] || r[`meta_${i}_label`];
          const v = r[`meta${i}_value`] || r[`meta_${i}_value`];
          if (l && v) meta.push([String(l), String(v)]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[restaurants.js] Error:", e);
    return [];
  }
};

function yesNo(val) {
  const s = String(val).trim().toLowerCase();
  if (["1","true","yes","y"].includes(s)) return "Yes";
  if (["0","false","no","n"].includes(s)) return "No";
  return String(val);
}
