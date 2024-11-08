const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('profit_loss.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const data = xlsx.utils.sheet_to_json(sheet);

fs.writeFileSync('financialData.json', JSON.stringify(data, null, 2));
