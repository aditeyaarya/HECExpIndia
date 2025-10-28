const parseCSV = require('./csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - news.csv');
  const data = parseCSV(csvPath);
  
  // Transform CSV data to match template structure
  return data.map(row => ({
    title: row.title || row.Title || '',
    desc: row.description || row.Description || row.desc || '',
    image: row.image || row.Image || '',
    link: row.link || row.Link || '',
    meta: row.meta ? [['Info', row.meta]] : []
  }));
};