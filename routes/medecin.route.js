const express = require('express');
const router = express.Router();
//const {uploadFile} =require("../middleware/uploadFile");
const Medecin=require("../Modeles/medecin")
const User=require("../Modeles/user")
const bcrypt = require('bcrypt')
//***************************const jwt = require('jsonwebtoken')
//***************************const nodemailer = require('nodemailer');


// Ajouter un médecin
router.post('/', async (req, res) => {
    const newMedecin = new Medecin(req.body);
    try {
        await newMedecin.save();
        res.status(201).json(newMedecin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Afficher la liste des médecins
router.get('/med', async (req, res) => {
    try {
        const medecins = await Medecin.find().populate("specialiteID").exec();
        res.status(200).json(medecins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Chercher un médecin par ID
router.get('/:medecinId', async (req, res) => {
    try {
        const medecin = await Medecin.findById(req.params.medecinId);
        if (!medecin) {
            return res.status(404).json({ message: "Médecin non trouvé" });
        }
        res.status(200).json(medecin);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});





module.exports = router;