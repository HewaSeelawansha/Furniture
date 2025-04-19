const Reservation = require('./reservation.model');
const Furniture = require('../furnitures/furniture.model'); 

const postReservation = async (req, res) => {
    try {
        const { customerName, address, nic, furnitureItems } = req.body;
        
        // Calculate totals
        let totalQuantity = 0;
        let totalPrice = 0;
        
        // Verify each furniture item and calculate totals
        for (const item of furnitureItems) {
            const furniture = await Furniture.findById(item.itemId);
            if (!furniture) {
                return res.status(404).send({ message: `Furniture with ID ${item.itemId} not found` });
            }
            if (furniture.stock < item.quantity) {
                return res.status(400).send({ message: `Not enough stock for ${furniture.title}` });
            }
            
            totalQuantity += item.quantity;
            totalPrice += furniture.price * item.quantity;
        }

        const newReservation = new Reservation({
            customerName,
            address,
            nic,
            furnitureItems,
            totalQuantity,
            totalPrice,
            status: 'pending' // Default status
        });

        await newReservation.save();
        
        // Update furniture stock (optional)
        for (const item of furnitureItems) {
            await Furniture.findByIdAndUpdate(item.itemId, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).send({
            message: "Reservation created successfully",
            reservation: newReservation
        });
    } catch(error) {
        console.error("Error creating reservation", error);
        res.status(500).send({ message: "Failed to create reservation" });
    }
}

const getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .sort({ createdAt: -1 })
            .populate('furnitureItems.itemId', 'title price'); // Populate furniture details
        res.status(200).send(reservations);
    } catch(error) {
        console.error("Error fetching reservations", error);
        res.status(500).send({ message: "Failed to fetch reservations" });
    }
}

const getReservationByNIC = async (req, res) => {
    try {
        const { nic } = req.params;
        const reservations = await Reservation.find({ nic })
            .populate('furnitureItems.itemId', 'title price');
            
        if (!reservations || reservations.length === 0) {
            return res.status(404).send({ message: "No reservations found for this NIC" });
        }
        
        res.status(200).send(reservations);
    } catch(error) {
        console.error("Error fetching reservations by NIC", error);
        res.status(500).send({ message: "Failed to fetch reservations by NIC" });
    }
}

const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id)
            .populate('furnitureItems.itemId', 'title price image');
            
        if (!reservation) {
            return res.status(404).send({ message: "Reservation not found" });
        }
        
        res.status(200).send(reservation);
    } catch(error) {
        console.error("Error fetching reservation by ID", error);
        res.status(500).send({ message: "Failed to fetch reservation" });
    }
}

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: "Invalid status value" });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        ).populate('furnitureItems.itemId', 'title price');
        
        if (!updatedReservation) {
            return res.status(404).send({ message: "Reservation not found" });
        }
        
        // If cancelling, restore stock (optional)
        if (status === 'cancelled') {
            for (const item of updatedReservation.furnitureItems) {
                await Furniture.findByIdAndUpdate(item.itemId, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        res.status(200).send({
            message: "Reservation status updated successfully",
            reservation: updatedReservation
        });
    } catch(error) {
        console.error("Error updating reservation status", error);
        res.status(500).send({ message: "Failed to update reservation status" });
    }
}

module.exports = {
    postReservation,
    getAllReservation,
    getReservationByNIC,
    updateStatus,
    getReservationById
};