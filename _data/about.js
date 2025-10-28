const parseCSV = require('../_includes/csvParser');
const path = require('path');

module.exports = function() {
  const csvPath = path.join(__dirname, '..', 'HEC Experience India Dataset - about me.csv');
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
  
  if (aboutRow.email || aboutRow.Email) {
    meta.push(['Email', aboutRow.email || aboutRow.Email]);
  }
  if (aboutRow.phone || aboutRow.Phone) {
    meta.push(['Phone', aboutRow.phone || aboutRow.Phone]);
  }
  if (aboutRow.location || aboutRow.Location || aboutRow.city || aboutRow.City) {
    meta.push(['Location', aboutRow.location || aboutRow.Location || aboutRow.city || aboutRow.City]);
  }
  
  return {
    title: aboutRow.title || aboutRow.Title || 'About Us',
    desc: aboutRow.description || aboutRow.Description || aboutRow.desc || '',
    meta: meta,
    experience: aboutRow.experience || aboutRow.Experience || ''
  };
};