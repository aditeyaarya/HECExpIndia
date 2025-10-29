const parseCSV = require('../_includes/csvParser'); // or adjust to actual location
const path = require('path');
const fs = require('fs');

module.exports = function () {
  try {
    const csvPath = path.resolve(process.cwd(), 'about_me.csv'); // changed
    const data = parseCSV(csvPath);
    if (!data.length) return { title: 'About Us', desc: '', meta: [], experience: '' };

    const aboutRow = data[0];
    const meta = [];
    if (aboutRow.Email) meta.push(['Email', aboutRow.Email]);

    return {
      title: aboutRow.Name || 'About Us',
      desc: aboutRow.Bio || '',
      meta,
      experience: aboutRow.Bio || ''
    };
  } catch (e) {
    return { title: 'About Us', desc: '', meta: [], experience: '' };
  }
};
