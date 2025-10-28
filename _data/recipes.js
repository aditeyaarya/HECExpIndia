const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.join(__dirname, '..', 'HEC Experience India Dataset - recipes.csv');
  const data = parseCSV(csvPath);
  
  return data.map(row => ({
    title: row.Title || '',
    desc: `⏱️ ${row.Cooking_Time || ''} | ${row.Ingredients || ''}`.substring(0, 120),
    image: row.Image_URL || '',
    link: row.Source_URL || '',
    meta: []
  }));
};