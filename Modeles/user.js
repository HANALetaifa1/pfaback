const mongoose = require('mongoose');
const Specialite = require("./specialite.js");
const bcrypt = require('bcrypt');
// const disponibilites = require('./disponibilites.js');
//  const  characters="0.123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//  let activationCode="" ;
//  for(let i=0;i<25;i++){
//     activationCode += characters[Math.floor(Math.random() * characters.length)];
//  }
const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        // required: true,

    },
    lastName: {
        type: String,
        // required: true,

    },
    adresse:
    {
        type: String,
        required: false
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    datenais: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["admin", "doctor", "patient"],
        default: "patient"
    },

    isActive: {
        type: Boolean,
        default: false,
        required: true
    },

    avatar: {
        type: String,
        required: false
    },
    certification:
        { type: String },

    specialiteID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: Specialite
    },
    activationCode:{
        type:String
    },
   


    // startTime: { type: String },

    // endTime: { type: String },

    // consultationTime: { type: String },

    // joursdeTravail: { type: String },


    accountStatus: {
        type: String,
        default: "en cour",
        enum: ["en cour", "refuser", "accepter" ],
        required: false,
    },

    matricule: {
        type: String,
        // required: true
    },

},
    {
        timestamps: true,
    },
)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})
module.exports = mongoose.model('user', userSchema)