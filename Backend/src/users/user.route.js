const express = require('express');
const { postLogin, postRegister, postLogout, getUserById, getAllUsers, deleteUser, updateUser } = require('./user.controller');
const { signupVailidation, loginVailidation } = require('../middleware/userValidation');
const router = express.Router();

// signup user
router.post("/signup", signupVailidation, postRegister);

// login user
router.post("/login", loginVailidation, postLogin);

// logout user
router.post("/logout", postLogout);

// get user by id
router.get("/:id", getUserById);

// get all users
router.get("/", getAllUsers);

// get all users
router.delete("/delete/:id", deleteUser);

// update user
router.put("/update/:id", updateUser);

module.exports = router;