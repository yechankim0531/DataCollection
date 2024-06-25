const fs = require('fs');
const { parse } = require('json2csv');

// Read JSON data from file
fs.readFile('FDC_srLegacyData.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const flattenedData = [];

    // Process each entry in the nested structure
    for (let i = 0; i < jsonData.length; i++) {
      for (let j = 0; j < jsonData[i].length; j++) {
        const entry = jsonData[i][j];
        const nutrients = {};

        if (entry.foodNutrients) {
          entry.foodNutrients.forEach(nutrient => {
            const key = `${nutrient.name} (${nutrient.unitName})`;
            nutrients[key] = nutrient.amount;
          });
        }

        const dataObject = {
          fdcID: entry.fdcID,
          description: entry.description,
          publicationDate: entry.publicationDate,
          brandOwner: entry.brandOwner,
          brandedFoodCategory: entry.brandedFoodCategory,
          ingredients: entry.ingredients,
          servingSize: entry.servingSize,
          servingSizeUnit: entry.servingSizeUnit,
          ...nutrients
        };

        flattenedData.push(dataObject);
      }
    }

    // Check if any data was collected and parse it into CSV
    if (flattenedData.length > 0) {
      const csv = parse(flattenedData, { fields: Object.keys(flattenedData[0]) });
      fs.writeFile('FDC_srLegacyData.csv', csv, (err) => {
        if (err) {
          console.error("Error writing CSV:", err);
          return;
        }
        console.log('CSV file has been saved.');
      });
    } else {
      console.log('No data available to write to CSV.');
    }
  } catch (err) {
    console.error("Error processing JSON data:", err);
  }
});
