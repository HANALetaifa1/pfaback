const mongoose = require("mongoose")
const User = require("./user.js");
const Patient = require("./patient.js");
const Cons = require("./cons.js");
const Ord = require("./ord.js");
const dossmedicalSchema = mongoose.Schema({
  code: { type: String ,   required: false},

 patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Patient
},

consID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Cons 
},

ordID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Ord 
},
medecinID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
},

},

{
    timesstamps: true,
  }

)
module.exports = mongoose.model('dossmedical',dossmedicalSchema)



