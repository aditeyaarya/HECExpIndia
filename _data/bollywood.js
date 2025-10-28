const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - bollywood.csv');
  const data = parseCSV(csvPath);
  
  return data.map(row => ({
    title: row.Title || '',
    desc: row.Description || '',
    image: row.Poster_URL || '',
    link: row.TMDB_ID ? `https://www.themoviedb.org/movie/${row.TMDB_ID}` : '',
    meta: row.Genre ? [['Genre', row.Genre]] : []
  }));
};