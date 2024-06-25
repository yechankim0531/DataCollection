// initializeID.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const filePath = path.join(__dirname, 'fdc_id_sr_legacy_food.csv');
const output = path.join(__dirname, 'idList.json');
const ids = [];

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        ids.push(row.id);
    })
    .on('end', () => {
        console.log(`CSV file successfully processed with ${ids.length} IDs collected.`);
        fs.writeFileSync(output, JSON.stringify(ids), 'utf8');
    })
    .on('error', (err) => {
        console.error('Error reading CSV file:', err);
    });




