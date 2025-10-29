const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/news.csv');
    console.log('[news.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    console.log('[news.js] loaded:', data.length);

    return data.map(row => ({
      title: row.title || row.Title || '',
      desc: row.description || row.Description || row.desc || '',
      image: row.image || row.Image || '',
      link: row.link || row.Link || '',
      meta: row.meta ? [['Info', row.meta]] : []
    }));
  } catch (e) {
    console.error('[news.js] Error:', e.message);
    return [];
  }
};
