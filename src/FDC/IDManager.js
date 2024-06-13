const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

class IDManager{

    
    constructor(csvFile) {
        this.csvFile = path.join(__dirname, csvFile);
        this.q=[]

    }

    async initializeID(){
        fs.createReadStream(this.csvFile)
            .pipe(csv())
            .on('data', (row)=> {
                this.q.push(row.id);
            })
            .on('end', () => {
                console.log(`CSV file successfully processed with ${this.q.length} IDs collected.`);
                console.log("dd")
                console.log(this.q)
                fs.writeFileSync(path.join(__dirname, 'idList.json'),JSON.stringify(this.q), 'utf8')
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
            })
    }

    getBatch(batchSize){
        console.log("sdsdsd",this.q)
        const batch = this.q.slice(0,batchSize)
        console.log(batch)
        console.log(this.q)
        this.q=this.q.slice(batchSize)
        fs.writeFileSync(path.join(__dirname, 'idList.json'),JSON.stringify(this.q), 'utf8')
        return batch
    }


    
   
}



module.exports = IDManager;