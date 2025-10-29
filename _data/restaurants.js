const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/restaurants.csv');
    console.log('[restaurants.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Name || '',
      desc: `${row.Location || ''} | ${row.Cuisine_Type || ''} | ${row.Price_Range || ''}`,
      image: row.Image_URL || '',
      link: row.Google_Maps_URL || '',
      meta: [['Rating', row.Rating || 'N/A']]
    }));
  } catch (e) {
    console.error('[restaurants.js] Error:', e.message);
    return [];
  }
};
