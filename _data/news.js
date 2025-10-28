const parseCSV = require('../_includes/csvParser');  // FIXED: was './csvParser'
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - news.csv');
    
    console.log('[news.js] Looking for CSV at:', csvPath);
    console.log('[news.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[news.js] Loaded', data.length, 'news items');
    
    return data.map(row => ({
      title: row.title || row.Title || '',
      desc: row.description || row.Description || row.desc || '',
      image: row.image || row.Image || '',
      link: row.link || row.Link || '',
      meta: row.meta ? [['Info', row.meta]] : []
    }));
  } catch (error) {
    console.error('[news.js] Error:', error.message);
    return [];
  }
};