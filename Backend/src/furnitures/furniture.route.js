const express = require('express');
const { postFurniture, getAllFurnitures, getFurnitureById, updateFurniture, deleteFurniture, deleteAll } = require('./furniture.controller');
const router = express.Router();

router.get("/", getAllFurnitures);

router.post("/create-furniture", postFurniture);

router.get("/:id", getFurnitureById);

router.put("/update/:id", updateFurniture);

router.delete("/delete/:id", deleteFurniture);

router.delete("/delete", deleteAll);


module.exports = router;