const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - recipes.csv');
    
    console.log('[recipes.js] Looking for CSV at:', csvPath);
    console.log('[recipes.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[recipes.js] Loaded', data.length, 'recipes');
    
    return data.map(row => ({
      title: row.Title || '',
      desc: `⏱️ ${row.Cooking_Time || ''} | ${row.Ingredients || ''}`.substring(0, 120),
      image: row.Image_URL || '',
      link: row.Source_URL || '',
      meta: []
    }));
  } catch (error) {
    console.error('[recipes.js] Error:', error.message);
    return [];
  }
};