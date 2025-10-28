const fs = require('fs');
const path = require('path');

function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parsing (handles basic cases)
      const row = lines[i].split(',').map(cell => cell.trim());
      const obj = {};
      
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      
      data.push(obj);
    }
    
    return data;
  } catch (error) {
    console.error(`Error parsing CSV: ${filePath}`, error);
    return [];
  }
}

module.exports = parseCSV;