const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'resources.csv'); // changed
    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Image_URL || '',
      link: row.URL || '',
      meta: []
    }));
  } catch { return []; }
};
