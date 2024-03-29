const express = require ('express');
 const router = express.Router();
 const User = require("../Modeles/user");
 const Admin = require("../Modeles/admin");

 router.get('/alldoc', async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor", accountStatus: "en cour" }).exec();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Get all accepted users
router.get('/allusers/accepted', async (req, res) => {
    try {
        const users = await User.find({ accountStatus: "accepter" }).populate("specialiteID").exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get all refused users
router.get('/allusers/refused', async (req, res) => {
    try {
        const users = await User.find({ accountStatus: "refuser" }).populate("specialiteID").exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get all users accountStatus=en cour
router.get('/user/allusers', async (req, res) => {
    try {
        const users = await User.find({ role: "patient", accountStatus: "en cour" });
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Accept user
router.put('/accept/:userID', async (req, res) => {
    const id = req.params.userID;
    try {
        const acc = { accountStatus: "accepter", _id: id };
        await User.findByIdAndUpdate(id, acc);
        res.json(acc);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Refuse user
router.put('/refuse/:userID', async (req, res) => {
    const id = req.params.userID;
    try {
        const acc = { accountStatus: "refuser", _id: id };
        await User.findByIdAndUpdate(id, acc);
        res.json(acc);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Add a new user
router.post('/adduser', async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// CRUD operations for admin

// Get all admins
router.get('/admin/all', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Get admin by ID
router.get('/admin/:adminId', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Create a new admin
router.post('/addadmin', async (req, res) => { // Modification de l'URL de la route
    const newAdmin = new Admin(req.body);
    try {
        await newAdmin.save();
        res.status(200).json(newAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an admin
router.put('/admin/:adminId', async (req, res) => {
    const id = req.params.adminId;
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an admin
router.delete('/admin/:adminId', async (req, res) => {
    const id = req.params.adminId;
    try {
        await Admin.findByIdAndDelete(id);
        res.json({ message: "Admin deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});












 module.exports = router;