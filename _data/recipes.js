// _data/recipes.js
const path = require("path");
const parseCSV = require("../_includes/csvParser");

module.exports = function () {
  try {
    // Stable path (works locally & on Netlify)
    const csvPath = path.join(__dirname, "../data/recipes.csv");
    const rows = parseCSV(csvPath);

    return (rows || [])
      .filter(r => Object.values(r).some(v => (v ?? "").toString().trim() !== ""))
      .map(r => {
        // Aliases (parser normalizes headers to lowercase snake_case)
        const title = r.title || r.name || r.recipe || "";
        const image = r.image_url || r.image || r.img || r.thumbnail || "";
        const link  = r.source_url || r.url || r.link || r.href || "";

        const cookingTime = r.cooking_time || r.time || r.total_time || r.prep_time || "";
        const servings    = r.servings || r.yield || r.portions || "";
        const difficulty  = r.difficulty || r.level || "";
        const cuisine     = r.cuisine || r.region || "";

        // Ingredients: prefer a compact summary
        const ingredients = r.ingredients || r.ingredient_list || "";
        const ingredientsCount =
          r.ingredients_count ||
          (ingredients ? String(ingredients).split(/[,|·•]/).filter(s => s.trim()).length : "");

        // Description line (trim & clamp)
        const parts = [];
        if (cookingTime) parts.push(`⏱️ ${cookingTime}`);
        if (servings) parts.push(`👥 ${servings}`);
        if (difficulty) parts.push(`📈 ${capitalize(difficulty)}`);
        if (ingredientsCount && !isNaN(ingredientsCount)) parts.push(`🧂 ${ingredientsCount} ingredients`);
        const desc = parts.join(" | ").slice(0, 140); // short card blurb

        // Meta tags shown under the card (top 3 are displayed by your template)
        const meta = [];
        if (cuisine)     meta.push(["Cuisine", String(cuisine)]);
        if (cookingTime) meta.push(["Time", String(cookingTime)]);
        if (servings)    meta.push(["Servings", String(servings)]);
        if (difficulty)  meta.push(["Difficulty", capitalize(String(difficulty))]);

        // Support meta1_label/meta1_value ... meta10_value in CSV
        for (let i = 1; i <= 10; i++) {
          const l = r[`meta${i}_label`] || r[`meta_${i}_label`];
          const v = r[`meta${i}_value`] || r[`meta_${i}_value`];
          if (l && v) meta.push([String(l), String(v)]);
        }

        return { title, desc, image, link, meta };
      });
  } catch (e) {
    console.error("[recipes.js] Error:", e);
    return [];
  }
};

function capitalize(s) {
  s = String(s || "");
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
