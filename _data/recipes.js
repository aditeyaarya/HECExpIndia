const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.join(__dirname, '..', 'HEC Experience India Dataset - recipes.csv');
  const data = parseCSV(csvPath);
  
  return data.map(row => ({
    title: row.title || row.Title || '',
    desc: row.description || row.Description || row.desc || '',
    image: row.image || row.Image || '',
    link: row.link || row.Link || '',
    meta: row.meta ? [['Info', row.meta]] : []
  }));
};