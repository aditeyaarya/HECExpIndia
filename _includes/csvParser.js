const fs = require('fs');
const path = require('path');

function parseCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) return [];
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const row = parseCSVLine(lines[i]);
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

// Helper function to parse CSV line with quoted field support
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

module.exports = parseCSV;