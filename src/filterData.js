class filterData {
    constructor(data) {
        this.data = data;
    }



    filterData(data) {
        if (!Array.isArray(this.data)) {
            console.error('Data must be an array.');
            return; 
        }
        return this.data.map(item => {
            try{
                return{
                    fdcID: item.fdcId || "No ID",
                    description: item.description|| "No description",
                    publicationDate: item.publicationDate|| "No data",
                    brandOwner: item.brandOwner || "No brandowner",
                    brandedFoodCategory: item.brandedFoodCategory || "No category",
                    ingredients: item.ingredients || "No Ingredients",
                    servingSize: item.servingSize || "No serving size", 
                    servingSizeUnit: item.servingSizeUnit || "No unit",
                    foodNutrients: item.foodNutrients.map(nutrient => ({
                        name: nutrient.nutrient.name || 'No name',
                        unitName: nutrient.nutrient.unitName || 'No unit',
                        amount: nutrient.amount || "No amount"
                    }))
                }
            }
            catch(err){
                console.log("Cannot filter")
                return

                
            }
            
        });
    }
}
module.exports = filterData;
// Example usage:
