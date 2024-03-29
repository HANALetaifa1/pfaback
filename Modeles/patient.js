const mongoose = require("mongoose")
const Medecin = require("./medecin");
const User = require("./user");


const patientSchema = mongoose.Schema({
    numfiche: { type: String , unique : true},
    cinPa: { type: Number },
    
    nompatient: { type: String },
    prenompatient: { type: String },
    adressepatient: { type: String },
    sexepatient: { type: String },

    emailpatient: { type: String },
    password: { type: String },
    profession: { type: String },

    numtelPa: { type: Number },
    dateNais: { type: String },

    HistoriqueFamilial: { type: String },
    HistoriqueSocial: { type: String },




    medecinID: {
        type: mongoose.Schema.Types.ObjectId,
       ref: User
    },

}
    , { timesstamps: true }
)
module.exports = mongoose.model('patient', patientSchema)


