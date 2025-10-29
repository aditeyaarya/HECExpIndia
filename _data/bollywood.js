// _data/bollywood.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    const csvPath = path.join(__dirname, "../data/bollywood.csv");
    const rows = parseCSV(csvPath);

    return (rows || [])
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        // Your parser normalizes headers to lowercase snake_case
        const title = r.title || r.name || r.movie || "";
        const desc  = r.desc || r.description || r.overview || "";
        const image = r.poster_url || r.image || r.image_url || r.img || "";
        const tmdb  = r.tmdb_id || r.tmdb || "";
        const link  = tmdb ? `https://www.themoviedb.org/movie/${String(tmdb).trim()}` : (r.link || r.url || r.href || "");

        // Build meta tags from common fields
        const meta = [];
        if (r.genre)            meta.push(["Genre", String(r.genre)]);
        if (r.year || r.release_year) meta.push(["Year", String(r.year || r.release_year)]);
        if (r.rating)           meta.push(["Rating", String(r.rating)]);
        if (r.director)         meta.push(["Director", String(r.director)]);
        if (r.cast)             meta.push(["Cast", String(r.cast)]);

        // Also support flexible meta pairs: meta1_label/meta1_value ... meta10_value
        for (let i = 1; i <= 10; i++) {
          const l = r[`meta${i}_label`] || r[`meta_${i}_label`];
          const v = r[`meta${i}_value`] || r[`meta_${i}_value`];
          if (l && v) meta.push([String(l), String(v)]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[bollywood.js] Error:", e);
    return [];
  }
};
