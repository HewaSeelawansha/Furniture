const Furniture = require('./furniture.model');

const postFurniture = async (req, res) => {
    try{
        const { title, description, Image, price, stock } = req.body;
        const newFurniture = new Furniture({title, description, Image, price, stock});
        await newFurniture.save();
        res.status(200).send({message:"Furniture created successfully", furniture:newFurniture});
    } catch(error) {
        console.error("Error creating furniture", error);
        res.status(500).send({message:"Failed to create furniture"});
    }
}

const getAllFurnitures = async (req, res) => {
    try {
        const Furnitures = await Furniture.find().sort({ createdAt: -1 });
        res.status(200).send(Furnitures);
    } catch(error) {
        console.error("Error fetching furniture", error);
        res.status(500).send({message:"Failed to fetch furniture"});
    }
}

const getFurnitureById = async (req, res) => {
    try {
        const {id} = req.params;
        const furniture = await Furniture.findById(id);
        if(!furniture){
            res.status(404).send({message:"Furniture Not Found"});
        }
        res.status(200).send(furniture);
    } catch(error) {
        console.error("Error fetching the furniture", error);
        res.status(500).send({message:"Failed to fetch the furniture"});
    }
}

const updateFurniture = async (req, res) => {
    try {
        const {id} = req.params;
        const { title, description, Image, price, stock } = req.body;
        const updatedFurniture = await Furniture.findByIdAndUpdate(
            id, 
            {title, description, Image, price, stock}, 
            {new: true});
        if(!updatedFurniture){
            res.status(404).send({message:"Furniture Not Found"});
        }
        res.status(200).send({
            message:"Furniture updated successfully",
            furniture: updatedFurniture
        });
    } catch(error) {
        console.error("Error updating the furniture", error);
        res.status(500).send({message:"Failed to update the furniture"});
    }
}

const deleteFurniture = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedFurniture = await Furniture.findByIdAndDelete(id);
        if(!deletedFurniture){
            res.status(404).send({message:"Furniture Not Found"});
        }
        res.status(200).send({
            message:"Furniture deleted successfully",
            furniture: deletedFurniture
        });
    } catch(error) {
        console.error("Error deleting the furniture", error);
        res.status(500).send({message:"Failed to delete the furniture"});
    }
}

const deleteAll = async (req, res) => {
    try {
        // Deletes all documents in the Book collection
        const result = await Furniture.deleteMany({}); // Pass an empty filter to delete all documents
        res.status(200).send({
            message: "All furnitures deleted successfully",
            deletedCount: result.deletedCount, // Returns the number of deleted documents
        });
    } catch (error) {
        console.error("Error deleting all furniture", error);
        res.status(500).send({ message: "Failed to delete all furniture" });
    }
};


module.exports = {
    postFurniture,
    getAllFurnitures,
    getFurnitureById,
    updateFurniture,
    deleteFurniture,
    deleteAll
 };
