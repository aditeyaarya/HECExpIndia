const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - resources.csv');
    
    console.log('[resources.js] Looking for CSV at:', csvPath);
    console.log('[resources.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[resources.js] Loaded', data.length, 'resources');
    
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Image_URL || '',
      link: row.URL || '',
      meta: []
    }));
  } catch (error) {
    console.error('[resources.js] Error:', error.message);
    return [];
  }
};