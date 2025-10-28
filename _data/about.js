const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - about me.csv');
  const data = parseCSV(csvPath);
  
  if (data.length === 0) {
    return {
      title: 'About Us',
      desc: '',
      meta: [],
      experience: ''
    };
  }
  
  const aboutRow = data[0];
  const meta = [];
  
  if (aboutRow.Email) {
    meta.push(['Email', aboutRow.Email]);
  }
  
  return {
    title: aboutRow.Name || 'About Us',
    desc: aboutRow.Bio || '',
    meta: meta,
    experience: aboutRow.Bio || ''
  };
};