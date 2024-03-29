const mongoose = require("mongoose")
const User = require("./user.js");

const Patient = require("./patient");

const rendSchema = mongoose.Schema({
  
    Daterd: { type: String , required: false },
    timerd: { type: String, required: false },
     Descrd: { type: String, required: false },
    etatrend: {
        type: String,
        enum: ["en attente","reporter","accepter" ,"contrôle"],
        // ,"completer"
        default: "en attente",
        required: true,
      },

      firstName: {
        type: String,
        required: false,

    },
    lastName: {
        type: String,
        required: false,

    },
    phone: {
      type: Number,
      required: false,
  },
  
  
  email: {
    type: String,
    required: false,
    unique: true
},
      
medecinID: { //Il s'agit d'un champ qui stocke l'ID du médecin associé à ce rendez-vous.
    type: mongoose.Schema.Types.ObjectId,
   ref: User
},
  userID: { //Il s'agit d'un champ qui stocke l'ID de l'utilisateur associé à ce rendez-vous.
    type: mongoose.Schema.Types.ObjectId,
    ref: User
}


},

{ timesstamps: true, 
}

)
module.exports = mongoose.model('rend', rendSchema)



