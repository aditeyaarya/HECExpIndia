const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.join(__dirname, '..', 'HEC Experience India Dataset - resources.csv');
  const data = parseCSV(csvPath);
  
  return data.map(row => ({
    title: row.Title || '',
    desc: row.Description || '',
    image: row.Image_URL || '',
    link: row.URL || '',
    meta: []
  }));
};