const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(bodyParser.json());

//routes
const authRoutes = require('./src/users/user.route')
app.use("/auth", authRoutes);

const furnitureRoutes = require('./src/furnitures/furniture.route')
app.use("/api/furnitures", furnitureRoutes);

const reservationRoutes = require('./src/reservations/reservation.route')
app.use("/api/reservations", reservationRoutes);

const paymentRoutes = require('./src/payments/payment.route');
app.use('/api/payments', paymentRoutes);

async function main() {
    await mongoose.connect(`mongodb+srv://Furniture:${process.env.DB_PASSWORD}@furniture3d.yoran3m.mongodb.net/Furniture?retryWrites=true&w=majority&appName=Furniture3D`);
    app.use("/", (req, res) => {
        res.json("Bookstore server is running!");
    })
}  

main().then(() => console.log("MongoDB Connected!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})