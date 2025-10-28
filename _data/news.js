const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.join(__dirname, '..', 'HEC Experience India Dataset - news.csv');
  const data = parseCSV(csvPath);
  
  return data.map(row => ({
    title: row.Headline || '',
    desc: row.Summary || '',
    image: row['Image URL'] || '',
    link: row.Link || '',
    meta: []
  }));
};