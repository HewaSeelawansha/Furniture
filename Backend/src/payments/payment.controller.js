const Payment = require('./payment.model');
const Reservation = require('../reservations/reservation.model');

const processPayment = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { paymentMethod } = req.body;

        // Get reservation details
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).send({ message: "Reservation not found" });
        }

        // For prototype, we'll simulate a successful payment
        const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;
        const paymentAmount = reservation.totalPrice;

        // Create payment record
        const newPayment = new Payment({
            reservationId,
            amount: paymentAmount,
            paymentMethod,
            transactionId,
            status: 'completed'
        });
        await newPayment.save();

        // Update reservation with payment info
        reservation.payment = paymentAmount;
        reservation.status = 'completed'; // Mark reservation as completed
        await reservation.save();

        res.status(200).send({
            message: "Payment processed successfully",
            payment: newPayment,
            reservation
        });

    } catch (error) {
        console.error("Error processing payment", error);
        res.status(500).send({ message: "Failed to process payment" });
    }
};

const getPaymentByReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const payments = await Payment.find({ reservationId }).sort({ createdAt: -1 });
        res.status(200).send(payments);
    } catch (error) {
        console.error("Error fetching payments", error);
        res.status(500).send({ message: "Failed to fetch payments" });
    }
};

module.exports = {
    processPayment,
    getPaymentByReservation
};