const parseCSV = require('../_includes/csvParser');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  try {
    let csvPath = path.resolve(process.cwd(), 'HEC Experience India Dataset - about me.csv');
    
    console.log('[about.js] Looking for CSV at:', csvPath);
    console.log('[about.js] File exists:', fs.existsSync(csvPath));
    
    const data = parseCSV(csvPath);
    console.log('[about.js] Loaded', data.length, 'about records');
    
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
  } catch (error) {
    console.error('[about.js] Error:', error.message);
    return {
      title: 'About Us',
      desc: '',
      meta: [],
      experience: ''
    };
  }
};