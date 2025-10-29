// _data/news.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    const csvPath = path.join(__dirname, "../data/news.csv");
    const rows = parseCSV(csvPath);

    return rows
      // optional: skip fully empty rows
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        const title = r.title || r.name || r.headline || "";
        const desc  = r.desc || r.description || r.summary || "";
        const image = r.image || r.img || r.thumbnail || r.cover || r.image_url || "";
        const link  = r.link || r.url || r.href || "";

        // Build meta: either a single "meta" column, or metaN_label/metaN_value pairs
        let meta = [];
        if (r.meta && String(r.meta).trim()) {
          meta.push(["Info", String(r.meta).trim()]);
        }
        for (let i = 1; i <= 6; i++) {
          const l = r[`meta${i}_label`];
          const v = r[`meta${i}_value`];
          if (l && v) meta.push([String(l).trim(), String(v).trim()]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[news.js] Error:", e);
    return [];
  }
};
