// _data/events.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    // Use file-relative path (works locally & on Netlify)
    const csvPath = path.join(__dirname, "../data/events.csv");
    const rows = parseCSV(csvPath);

    return (rows || [])
      // skip fully empty rows
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        // Headers are normalized to lowercase snake_case by your parser
        const title = r.title || r.name || r.event || "";
        const desc  = r.desc || r.description || r.summary || "";
        const image = r.image_url || r.image || r.img || r.thumbnail || "";
        const link  = r.url || r.link || r.href || "";

        // Build meta tags from common event fields
        const meta = [];
        if (r.date || r.datetime || r.start_date)  meta.push(["Date", String(r.date || r.datetime || r.start_date)]);
        if (r.time || r.start_time)                meta.push(["Time", String(r.time || r.start_time)]);
        if (r.city || r.location_city)             meta.push(["City", String(r.city || r.location_city)]);
        if (r.venue || r.location || r.place)      meta.push(["Venue", String(r.venue || r.location || r.place)]);
        if (r.price || r.ticket_price)             meta.push(["Price", String(r.price || r.ticket_price)]);
        if (r.organizer)                           meta.push(["Organizer", String(r.organizer)]);

        // Also support flexible meta pairs: meta1_label/meta1_value ... meta10_value
        for (let i = 1; i <= 10; i++) {
          const l = r[`meta${i}_label`] || r[`meta_${i}_label`];
          const v = r[`meta${i}_value`] || r[`meta_${i}_value`];
          if (l && v) meta.push([String(l), String(v)]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[events.js] Error:", e);
    return [];
  }
};
