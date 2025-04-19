const mongoose = require("mongoose");

const furnitureSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    description: {
        type:String,
        required: true,
    },
    Image: {
        type:String,
        default: 'https://static.vecteezy.com/system/resources/previews/000/503/771/original/book-icon-design-vector.jpg',
    },
    price: {
        type:Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true,
});

const Furniture = mongoose.model('Furniture', furnitureSchema);
module.exports = Furniture;