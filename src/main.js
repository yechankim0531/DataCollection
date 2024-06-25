const dataFetcher = require('./dataFetcher');
const filterData = require('./filterData');
const processID = require('./processID')
const path = require('path');
// const apiKey = '4dilFjVq8viKvsBUd4bqvowcGza79cotrupSlYNc';
// const csvFile="fdc_id_branded.csv"

class main{
  constructor(apiKey,ids){
    this.apiKey = apiKey;
  }
    

  async main() {
    const processor = new processID();
    const generator = processor.batchList();

    for await (const batch of generator) {
        console.log('Processing batch:', batch);
        let data;
        while (true) {
            try {
                const fetcher = new dataFetcher(batch, this.apiKey);
                data = await fetcher.fetchData();
                break; // Break the loop if data is fetched successfully
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log('API limit reached, pausing for 61 minutes...');
                    await new Promise(resolve => setTimeout(resolve, 61 * 60 * 1000)); // Wait for 61 minutes
                } else {
                    console.error('An error occurred:', error);
                    throw error; // Rethrow if it's not a rate limit error
                }
            }
        }

        if (data) {
            const filePath = path.resolve(__dirname, 'FDC_srLegacyData.json');
            const newdata = new filterData(data);
            const filteredData = newdata.filterData();
            const fetcher = new dataFetcher(); // Initialize fetcher outside try block if needed
            if (filteredData) {
                fetcher.saveData(filteredData, filePath);
            } else {
                fetcher.saveData(data, path.resolve(__dirname, 'FDCnonFilteredData.json'));
            }
        }
    }
}
}
const apiKey = '4dilFjVq8viKvsBUd4bqvowcGza79cotrupSlYNc';
const controller = new main(apiKey);
controller.main();




  
