// _data/resources.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    const csvPath = path.join(__dirname, "../data/resources.csv");
    const rows = parseCSV(csvPath);

    return (rows || [])
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        // Parser normalizes headers to lowercase_snake_case
        const title = r.title || r.name || r.resource || "";
        const desc  = r.desc || r.description || r.summary || "";
        const image = r.image_url || r.image || r.img || r.thumbnail || "";
        const link  = r.url || r.link || r.href || "";

        const meta = [];
        if (r.category || r.type) meta.push(["Category", String(r.category || r.type)]);
        if (r.author || r.source) meta.push(["Author", String(r.author || r.source)]);
        if (r.level)              meta.push(["Level", String(r.level)]);
        if (r.language)           meta.push(["Language", String(r.language)]);
        if (r.tags)               meta.push(["Tags", String(r.tags)]);

        // Flexible meta pairs: meta1_label/meta1_value ... meta10_value
        for (let i = 1; i <= 10; i++) {
          const l = r[`meta${i}_label`] || r[`meta_${i}_label`];
          const v = r[`meta${i}_value`] || r[`meta_${i}_value`];
          if (l && v) meta.push([String(l), String(v)]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[resources.js] Error:", e);
    return [];
  }
};
