const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: [true, "Reservation ID is required"]
    },
    amount: {
        type: Number,
        required: [true, "Payment amount is required"],
        min: [0.01, "Payment amount must be greater than 0"]
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'card'
    },
    transactionId: {
        type: String,
        required: [true, "Transaction ID is required"]
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;