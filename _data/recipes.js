const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/recipes.csv');
    console.log('[recipes.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Title || '',
      desc: `⏱️ ${row.Cooking_Time || ''} | ${row.Ingredients || ''}`.slice(0, 120),
      image: row.Image_URL || '',
      link: row.Source_URL || '',
      meta: []
    }));
  } catch (e) {
    console.error('[recipes.js] Error:', e.message);
    return [];
  }
};
