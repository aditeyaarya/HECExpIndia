const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'data/bollywood.csv');
    console.log('[bollywood.js] CSV:', csvPath, 'exists:', fs.existsSync(csvPath));

    const data = parseCSV(csvPath);
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Poster_URL || '',
      link: row.TMDB_ID ? `https://www.themoviedb.org/movie/${row.TMDB_ID}` : '',
      meta: row.Genre ? [['Genre', row.Genre]] : []
    }));
  } catch (e) {
    console.error('[bollywood.js] Error:', e.message);
    return [];
  }
};
