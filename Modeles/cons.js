const mongoose = require("mongoose");
const patient = require("./patient.js");
const user = require("./user.js");

const cons = mongoose.Schema({
    NumCons: { type: Number },
    DateCons: { type: String },
    MotifCons: { type: String },
    AntécedentsMédicaux: { type: String },
    TaillePatient: { type: String },
    PoisPatient: { type: String },
    tension: { type: Number },
    Température: { type: String },
    DescriptionExamen: { type: String },
    medecinID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: patient
    }
}, {
    timestamps: true // Option pour inclure automatiquement les champs createdAt et updatedAt
});

module.exports = mongoose.model('cons', cons);
