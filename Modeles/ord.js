const mongoose = require("mongoose")

const patient = require("./patient.js");
const cons = require("./cons.js");
const user = require("./user.js");


const ordSchema = mongoose.Schema({
    code: { type: String },

    NumOrd: { type: Number },
    DateOrd: { type: String },
    // numfiche: { type: Number},
    NomMedicaments: { type: String },
    DosageMedicaments: { type: String },
    FréquanceMedicaments: { type: String },
    FormeMedicaments: { type: String },
    // NomPatient: { type: String  },
    observation: { type: String },

    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: patient
    },

    consID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: cons
    },

   medecinID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    }

},

    {
        timesstamps: true,
    }

)
module.exports = mongoose.model('ord', ordSchema)



