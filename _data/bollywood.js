const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - bollywood.csv');
    
    console.log('[bollywood.js] Looking for CSV at:', csvPath);
    console.log('[bollywood.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[bollywood.js] Loaded', data.length, 'movies');
    
    return data.map(row => ({
      title: row.Title || '',
      desc: row.Description || '',
      image: row.Poster_URL || '',
      link: row.TMDB_ID ? `https://www.themoviedb.org/movie/${row.TMDB_ID}` : '',
      meta: row.Genre ? [['Genre', row.Genre]] : []
    }));
  } catch (error) {
    console.error('[bollywood.js] Error:', error.message);
    return [];
  }
};