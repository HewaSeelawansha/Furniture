const User = require('./user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const postRegister = async (req, res) => {
    try{
        const { name, email, password} = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message:'Already exists', success: false})
        }
        const userModel = new User({name, email, password});
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({message:"Registered successfully", success: true});
    } catch(error) {
        res.status(500).send({message:"Internal server eroor", success: false});
    }
}

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(403)
                .json({ message: 'Please provide correct email', success: false });
        }
        const isPwordEqual = await bcrypt.compare(password, user.password);
        if (!isPwordEqual) {
            return res.status(403)
                .json({ message: 'Please provide correct password', success: false });
        }
        const token = jwt.sign(
            { email: user.email, _id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: "Login successfully",
            success: true,
            token,
            user: {
                email: user.email,
                name: user.name,
                _id: user._id,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", success: false });
    }
};

const postLogout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", success: false });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User Not Found" }); // Use 'return' to stop execution
        }
        res.status(200).send(user);
    } catch (error) {
        console.error("Error fetching the user", error);
        res.status(500).send({ message: "Failed to fetch the user" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch(error) {
        console.error("Error fetching user", error);
        res.status(500).send({message:"Failed to fetch user"});
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, photoURL, bio } = req.body; // Extract only the name field
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { name, photoURL, bio }, // Update only the name
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "User Not Found" });
        }
        res.status(200).send({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating the User", error);
        res.status(500).send({ message: "Failed to update the User" });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ message: "User Not Found" }); // Use 'return' to stop execution
        }
        res.status(200).send({
            message: "User deleted successfully",
            user: deletedUser,
        });
    } catch (error) {
        console.error("Error deleting the user", error);
        res.status(500).send({ message: "Failed to delete the user" });
    }
};

module.exports = {
    postLogin,
    postRegister,
    postLogout,
    getUserById,
    getAllUsers,
    deleteUser,
    updateUser
 };