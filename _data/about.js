const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/about_me.csv');
    console.log('[about.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    if (!data.length) {
      return { title: 'About', desc: '', meta: [], experience: '' };
    }

    const row = data[0];
    const meta = [];
    if (row.Email) meta.push(['Email', row.Email]);

    return {
      title: row.Name || 'About',
      desc: row.Bio || '',
      meta,
      experience: row.Bio || ''
    };
  } catch (e) {
    console.error('[about.js] Error:', e.message);
    return { title: 'About', desc: '', meta: [], experience: '' };
  }
};
