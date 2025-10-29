const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'restaurants.csv'); // changed
    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Name || '',
      desc: `${row.Location || ''} | ${row.Cuisine_Type || ''} | ${row.Price_Range || ''}`,
      image: row.Image_URL || '',
      link: row.Google_Maps_URL || '',
      meta: [['Rating', row.Rating || 'N/A']]
    }));
  } catch { return []; }
};
