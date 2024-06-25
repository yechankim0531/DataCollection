const IDManager = require('./IDManager');

class processID {
    constructor() {
        this.manager = new IDManager();
    }

    async *batchList() {
        let ids = this.manager.getq();

        while (ids.length > 20) {
            const batch = this.manager.getBatch(20);
            yield batch;  // Yield the batch and wait for the next request
            ids = this.manager.getq();  // Update the ids
        }

        if (ids.length > 0) {
            yield ids;  // Yield any remaining ids
        }
    }
}

module.exports = processID;
