const express = require('express');
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/patient');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
     const  characters="0.123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
 let activationCode="" ;
 for(let i=0;i<25;i++){
    activationCode += characters[Math.floor(Math.random() * characters.length)];
 }

    let newUser;

    if (role === 'doctor') {
      newUser = new Doctor({
        username,
        email,
        password: hashedPassword,
        role: 'doctor',
        activationCode: activationCode 
      });
    } else if (role === 'patient') {
      newUser = new Patient({
        username,
        email,
        password: hashedPassword,
        role: 'patient',
        activationCode: activationCode 
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;

    user = await Doctor.findOne({ email });

    if (!user) {
      user = await Patient.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.status(200).json({ message: 'User logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
