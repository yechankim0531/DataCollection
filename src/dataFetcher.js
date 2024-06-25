const axios = require('axios');
const fs = require('fs');
const path = require('path');

class DataFetcher {

  constructor(ids, apiKey) {
    this.apiKey = apiKey;
    this.ids = ids;

  }

  // Function to fetch data for a batch of IDs
  async fetchData() {
    const url = `https://api.nal.usda.gov/fdc/v1/foods?api_key=${this.apiKey}&fdcIds=${this.ids.join(",")}`;// make this a parameter
    console.time('fetchData');
    try {

      const response = await axios.get(url);
      console.log(url); // Display URL for verification
      console.timeEnd('fetchData');
      console.log('Data fetched successfully:', response.data);
      return response.data;

    } catch (error) {
      console.timeEnd('fetchData');
      const filePath = path.resolve(__dirname, 'FDCerrorURL.json');
      this.saveData(url,filePath)
      return null;

    }
  }

  // Function to save the data to a JSON file
  saveData(data, filePath) {
    console.time('saveData');
    

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // If the file does not exist, create it with the data wrapped in an array
        fs.writeFile(filePath, JSON.stringify([data], null, 2), (err) => {
          if (err) {
            console.error('Error creating file:', err);
          } else {
            console.log('Data saved');
          }
          console.timeEnd('saveData');
        });
      } else {
        // If the file exists, append data with correct JSON formatting
        const dataToAppend = ',' + JSON.stringify(data, null, 2) + ']';
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }
          fs.truncate(filePath, stats.size - 1, (err) => {
            if (err) {
              console.error('Error truncating file:', err);
              console.timeEnd('saveData');
              return;
            }
            fs.appendFile(filePath, dataToAppend, (err) => {
              if (err) {
                console.error('Error appending to file:', err);
              } 
              
              else {
                console.log('Data appended to FDCfoodData.json');
              }
              console.timeEnd('saveData');
            });
          });
        });
      }
    });
  }


  
}

module.exports = DataFetcher;
