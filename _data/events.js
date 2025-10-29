const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/events.csv');
    console.log('[events.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Image_URL || '',
      link: row.URL || '',
      meta: []
    }));
  } catch (e) {
    console.error('[events.js] Error:', e.message);
    return [];
  }
};
