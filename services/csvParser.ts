import { PromptItem } from '../types';
import { CSV_DATA } from './data';

// A robust CSV parser that handles quoted strings and newlines inside quotes
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote inside quoted field
          currentField += '"';
          i++; // Skip next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else if (char === '\r') {
        // Ignore carriage returns
      } else {
        currentField += char;
      }
    }
  }
  
  // Push the last field/row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

export const getPrompts = (): PromptItem[] => {
  const parsedRows = parseCSV(CSV_DATA);
  
  // Skip header row
  const dataRows = parsedRows.slice(1);

  return dataRows.map((row, index) => {
    // act, prompt, for_devs, type, contributor
    // Safely handle missing columns
    const act = row[0] || 'Unknown';
    const prompt = row[1] || '';
    const for_devs = (row[2] || '').toUpperCase() === 'TRUE';
    const type = row[3] || 'TEXT';
    const contributor = row[4] || 'Anonymous';

    return {
      id: `prompt-${index}`,
      act,
      prompt,
      for_devs,
      type,
      contributor
    };
  }).filter(item => item.prompt.length > 0); // Filter out empty lines
};
