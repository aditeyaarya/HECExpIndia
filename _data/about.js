// _data/about.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    const csvPath = path.join(__dirname, "../data/about_me.csv");
    const rows = parseCSV(csvPath);

    if (!rows || rows.length === 0) {
      return { title: "About", desc: "", meta: [], experience: "", image: "" };
    }

    const r = rows[0] || {};

    // --- Core fields (your CSV has: Name, Bio, Email, Profile_Image_URL) ---
    const title =
      r.title || r.name || r.full_name || "About";

    const desc =
      r.desc || r.description || r.bio || "";

    const experience =
      r.experience || r.body || r.story || r.bio || "";

    // Prefer explicit image fields; fall back through common aliases
    const image =
      r.image ||
      r.profile_image_url ||
      r.image_url ||
      r.photo ||
      r.avatar ||
      r.img ||
      "";

    // --- Meta list shown as label/value pairs under the bio ---
    const meta = [];
    if (r.email)        meta.push(["Email", String(r.email)]);
    if (r.phone)        meta.push(["Phone", String(r.phone)]);
    if (r.city)         meta.push(["City", String(r.city)]);
    if (r.location)     meta.push(["Location", String(r.location)]);
    if (r.program)      meta.push(["Program", String(r.program)]);
    if (r.website)      meta.push(["Website", String(r.website)]);
    if (r.linkedin)     meta.push(["LinkedIn", String(r.linkedin)]);
    if (r.twitter || r.x) meta.push(["Twitter", String(r.twitter || r.x)]);
    if (r.instagram)    meta.push(["Instagram", String(r.instagram)]);

    // Flexible custom pairs: meta_1_label/meta_1_value ... meta_10_value
    for (let i = 1; i <= 10; i++) {
      const l = r[`meta_${i}_label`] || r[`meta${i}_label`];
      const v = r[`meta_${i}_value`] || r[`meta${i}_value`];
      if (l && v) meta.push([String(l), String(v)]);
    }

    return { title, desc, meta, experience, image };
  } catch (e) {
    console.error("[about.js] Error:", e);
    return { title: "About", desc: "", meta: [], experience: "", image: "" };
  }
};
