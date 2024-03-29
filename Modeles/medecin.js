const mongoose = require("mongoose");
const specilaite = require("./specialite");
const bcrypt = require('bcrypt');
const { Router } = require("express");
const user = require ("./user")
const medecinSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    adresse: {
        type: String,
        required: false 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    certification: { 
        type: String 
    },
    matricule: { 
        type: String 
    },
    specialiteID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "specialite", // Utilisation de la chaîne de caractères pour la référence
        required: false // Champ spécialité facultatif
   },
    isDoctor: { 
        type: Boolean, 
        default: true 
    },
    accountStatus: {
        type: String,
        default: "pending",
        enum: ["pending", "cancelled", "accepted"],
        required: true,
    },
    role: {
        type: String,
        default: "doctor"
    },
}, {
    timestamps: true
});

medecinSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
});

const Medecin = mongoose.model('medecin', medecinSchema); 
module.exports = Medecin; 
