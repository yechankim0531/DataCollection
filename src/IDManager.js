const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

class IDManager{

    constructor() {
        this.q = this.loadIDs();
    }

    loadIDs() {
        const filePath = path.join(__dirname, 'idList.json');
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error loading IDs:', err);
            return [];
        }
    }

    getBatch(batchSize){
        const batch = this.q.slice(0,batchSize)
        this.q=this.q.slice(batchSize)
        fs.writeFileSync(path.join(__dirname, 'idList.json'),JSON.stringify(this.q), 'utf8')
        return batch
    }

    getq(){
        return this.q
    }
}



module.exports = IDManager;