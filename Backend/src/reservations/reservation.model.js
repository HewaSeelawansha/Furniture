const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, "Customer name is required"],
        trim: true
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true
    },
    nic: {
        type: String,
        required: [true, "NIC is required"],
        trim: true
    },
    furnitureItems: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Furniture',
            required: [true, "Item ID is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be at least 1"]
        }
    }],
    totalQuantity: {
        type: Number,
        required: [true, "Total quantity is required"],
        min: [1, "Total quantity must be at least 1"]
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
        min: [0, "Total price cannot be negative"]
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    payment: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;