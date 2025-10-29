// _includes/csvParser.js
const fs = require("fs");

function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) return [];

  let text = fs.readFileSync(filePath, "utf8");

  // Strip BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  // Normalize line endings (we'll still parse by char to support quoted newlines)
  // but this helps keep things consistent for edge cases.
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const delimiter = detectDelimiter(text);

  // Parse to array-of-arrays with full quoted-field support (incl. newlines)
  const rows = parseCSVToRows(text, delimiter);

  // Drop leading comment rows and blank rows
  const cleaned = rows.filter(r => r.length && r.join("").trim().length);

  if (!cleaned.length) return [];

  // First non-empty row is header
  const rawHeaders = cleaned[0].map(h => (h == null ? "" : String(h)));
  const headers = rawHeaders.map(normalizeHeader);

  const data = [];

  for (let i = 1; i < cleaned.length; i++) {
    const row = cleaned[i];
    // Skip pure comment lines (first cell starts with '#')
    if (row[0] && String(row[0]).trim().startsWith("#")) continue;

    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c] || `col_${c + 1}`;
      // Preserve empty trailing fields and undefined cells as ''
      obj[key] = c < row.length ? (row[c] ?? "") : "";
    }
    data.push(obj);
  }

  return data;
}

/** Detects delimiter by simple frequency check on the header line */
function detectDelimiter(text) {
  const firstLine = (text.split("\n")[0] || "");
  const candidates = [",", ";", "\t"];
  let best = ",";
  let bestScore = -1;
  for (const d of candidates) {
    const score = (firstLine.match(new RegExp(escapeRegExp(d), "g")) || []).length;
    if (score > bestScore) {
      bestScore = score;
      best = d;
    }
  }
  return best;
}

/** Full CSV tokenizer: supports quotes, escaped quotes, and newlines in quoted fields */
function parseCSVToRows(text, delimiter) {
  const rows = [];
  let field = "";
  let row = [];
  let i = 0;
  let insideQuotes = false;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        // Escaped quote
        field += '"';
        i += 2;
        continue;
      }
      insideQuotes = !insideQuotes;
      i += 1;
      continue;
    }

    if (!insideQuotes && ch === delimiter) {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }

    if (!insideQuotes && ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  // Push last field/row
  row.push(field);
  rows.push(row);

  // Ensure trailing empty fields are preserved (already handled)
  return rows;
}

/** Normalize header names: trim, lowercase, spaces/hyphens → underscores */
function normalizeHeader(h) {
  return String(h)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = parseCSV;
