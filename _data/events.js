const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - events.csv');
    
    console.log('[events.js] Looking for CSV at:', csvPath);
    console.log('[events.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[events.js] Loaded', data.length, 'events');
    
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Image_URL || '',
      link: row.URL || '',
      meta: []
    }));
  } catch (error) {
    console.error('[events.js] Error:', error.message);
    return [];
  }
};