const express = require('express');
const { 
    postReservation, 
    getAllReservation, 
    getReservationByNIC, 
    updateStatus,
    getReservationById
} = require('./reservation.controller');

const router = express.Router();

// Get all reservations (sorted by newest first)
router.get("/", getAllReservation);

router.get("/:id", getReservationById);

// Create a new reservation
router.post("/create", postReservation);

// Get reservations by NIC
router.get("/nic/:nic", getReservationByNIC);

// Update reservation status
router.put("/update-status/:id", updateStatus);

module.exports = router;