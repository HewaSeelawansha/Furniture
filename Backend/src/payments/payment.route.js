const express = require('express');
const { processPayment, getPaymentByReservation } = require('./payment.controller');
const router = express.Router();

// Process payment for a reservation
router.post("/:reservationId/process", processPayment);

// Get payment history for a reservation
router.get("/:reservationId", getPaymentByReservation);

module.exports = router;