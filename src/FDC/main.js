const dataFetcher = require('./dataFetcher');
const filterData = require('./filterData');
const IDManager = require('./IDManager');
const path = require('path');


const apiKey = '4dilFjVq8viKvsBUd4bqvowcGza79cotrupSlYNc';
const csvFile="fdc_id_branded.csv"




async function processIds(){
  const manager = new IDManager(csvFile);
   manager.initializeID();
  
  while(true){
    const ids = manager.getBatch(20)
    console.log(ids)
    
    if(ids.length ===0) break;

    const fetcher = new dataFetcher(ids,apiKey,);
    const data = await fetcher.fetchData();
    if (data) {
      const filePath = path.resolve(__dirname, 'FDCfoodData.json');
      const newdata = new filterData(data)
      filteredData = newdata.filterData()
      if(filteredData){
        fetcher.saveData(filteredData,filePath);
      }
      else{
        fetcher.saveData(data,path.resolve(__dirname, 'FDCnonFilteredData.json'))

      }
    }
  }
}

processIds()

  
