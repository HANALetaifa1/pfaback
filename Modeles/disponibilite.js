const mongoose = require("mongoose");
const User = require("./user");




const disponibilite = mongoose.Schema({
    startTime: { type: String },

    endTime: { type: String },

    consultationTime: { type: String },

    joursdeTravail : { type: String } ,

    
 
}
    , { timesstamps: true }
)
module.exports = mongoose.model('disponibilites', disponibilite)



