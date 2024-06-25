const fs = require('fs');
const { Transform } = require('stream');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');
const { createObjectCsvWriter } = require('csv-writer');

// Define headers in the order specified, including the specific nutrients
let headers = [
    { id: 'fdcID', title: 'fdcID' },
    { id: 'description', title: 'Description' },
    { id: 'publicationDate', title: 'Publication Date' },
    { id: 'brandOwner', title: 'Brand Owner' },
    { id: 'brandedFoodCategory', title: 'Branded Food Category' },
    { id: 'ingredients', title: 'Ingredients' },
    { id: 'servingSize', title: 'Serving Size' },
    { id: 'servingSizeUnit', title: 'Serving Size Unit' },
    { id: 'Energy (kcal)', title: 'Energy (kcal)' },
    { id: 'Carbohydrate, by difference (g)', title: 'Carbohydrate, by difference (g)' },
    { id: 'Protein (g)', title: 'Protein (g)' },
    { id: 'Total lipid (fat) (g)', title: 'Total lipid (fat) (g)' },
    { id: 'Total Sugars (g)', title: 'Total Sugars (g)' },
    { id: 'Sugars, added (g)', title: 'Sugars, added (g)' },
    { id: 'Sodium, Na (mg)', title: 'Sodium, Na (mg)' },
    { id: 'Fiber, total dietary (g)', title: 'Fiber, total dietary (g)' },
    { id: 'Calcium, Ca (mg)', title: 'Calcium, Ca (mg)' },
    { id: 'Iron, Fe (mg)', title: 'Iron, Fe (mg)' },
    { id: 'Fatty acids, total trans (g)', title: 'Fatty acids, total trans (g)' },
    { id: 'Fatty acids, total saturated (g)', title: 'Fatty acids, total saturated (g)' },
    { id: 'Cholesterol (mg)', title: 'Cholesterol (mg)' }
];

// Initialize CSV writer with append set to false initially to write headers
let csvWriter = createObjectCsvWriter({
    path: 'FDC_brandedData.csv',
    header: headers,
    append: false  // Ensure the header is written first
});

const processData = new Transform({
    writableObjectMode: true,
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
        const products = chunk.value;
        const writePromises = [];

        products.forEach(product => {
            if (product) {
                const nutrients = {};
                // Set default nutrient values to '0'
                headers.forEach(header => {
                    if (!['fdcID', 'description', 'publicationDate', 'brandOwner', 'brandedFoodCategory', 'ingredients', 'servingSize', 'servingSizeUnit'].includes(header.id)) {
                        nutrients[header.id] = '0';  // Default to 0 instead of empty
                    }
                });

                // Fill nutrient data if available
                if (product.foodNutrients && Array.isArray(product.foodNutrients)) {
                    product.foodNutrients.forEach(nutrient => {
                        const key = `${nutrient.name} (${nutrient.unitName})`;
                        if (nutrients.hasOwnProperty(key)) {  // Only set if the nutrient is in the header list
                            nutrients[key] = nutrient.amount || '0';  // If the amount is empty or 'No amount', set to '0'
                        }
                    });
                }

                const dataObject = {
                    fdcID: product.fdcID,
                    description: product.description,
                    publicationDate: product.publicationDate,
                    brandOwner: product.brandOwner,
                    brandedFoodCategory: product.brandedFoodCategory,
                    ingredients: product.ingredients,
                    servingSize: product.servingSize,
                    servingSizeUnit: product.servingSizeUnit,
                    ...nutrients
                };
                writePromises.push(csvWriter.writeRecords([dataObject]));
            }
        });

        // Resolve all write promises before calling the transform callback
        Promise.all(writePromises).then(() => {
            csvWriter = createObjectCsvWriter({
                path: 'FDC_brandedData.csv',
                header: headers,
                append: true  // Switch to append mode after initial write
            });
            callback();
        }).catch(err => {
            console.error("Error writing to CSV:", err);
            callback(err);
        });
    }
});

const readStream = fs.createReadStream("FDCfoodData.json");
const jsonParser = parser();
const jsonArray = streamArray();

readStream.pipe(jsonParser).pipe(jsonArray).pipe(processData).on('finish', () => {
    console.log('CSV file has been saved.');
}).on('error', (err) => {
    console.error('Error processing data:', err);
});
