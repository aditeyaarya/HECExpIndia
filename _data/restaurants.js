const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - restaurants.csv');
    
    console.log('[restaurants.js] Looking for CSV at:', csvPath);
    console.log('[restaurants.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[restaurants.js] Loaded', data.length, 'restaurants');
    
    return data.map(row => ({
      title: row.Name || '',
      desc: `${row.Location || ''} | ${row.Cuisine_Type || ''} | ${row.Price_Range || ''}`,
      image: row.Image_URL || '',
      link: row.Google_Maps_URL || '',
      meta: [['Rating', row.Rating || 'N/A']]
    }));
  } catch (error) {
    console.error('[restaurants.js] Error:', error.message);
    return [];
  }
};