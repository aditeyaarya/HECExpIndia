// _data/about.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    // Use path relative to this file (works locally & on Netlify)
    const csvPath = path.join(__dirname, "../data/about_me.csv");
    const rows = parseCSV(csvPath);

    if (!rows || rows.length === 0) {
      return { title: "About", desc: "", meta: [], experience: "" };
    }

    const r = rows[0]; // single-row "about" CSV

    // Core fields with aliases (headers are normalized to lowercase snake_case)
    const title      = r.title || r.name || "About";
    const desc       = r.desc || r.description || r.bio || "";
    const experience = r.experience || r.body || r.story || r.bio || "";

    // Build meta list
    const meta = [];

    // Common direct fields
    if (r.email)    meta.push(["Email", String(r.email)]);
    if (r.phone)    meta.push(["Phone", String(r.phone)]);
    if (r.city)     meta.push(["City", String(r.city)]);
    if (r.location) meta.push(["Location", String(r.location)]);
    if (r.website)  meta.push(["Website", String(r.website)]);

    // Socials (support both old/new names)
    if (r.linkedin) meta.push(["LinkedIn", String(r.linkedin)]);
    if (r.twitter || r.x) meta.push(["Twitter", String(r.twitter || r.x)]);
    if (r.instagram) meta.push(["Instagram", String(r.instagram)]);

    // Flexible pairs: meta1_label/meta1_value ... meta10_value
    for (let i = 1; i <= 10; i++) {
      const l = r[`meta_${i}_label`] || r[`meta${i}_label`];
      const v = r[`meta_${i}_value`] || r[`meta${i}_value`];
      if (l && v) meta.push([String(l), String(v)]);
    }

    return { title, desc, meta, experience };
  } catch (e) {
    console.error("[about.js] Error:", e);
    return { title: "About", desc: "", meta: [], experience: "" };
  }
};
