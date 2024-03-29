const mongoose =require("mongoose")

const specialitechema=mongoose.Schema({
Icon :{type: String, required: false},
nomsep: { type: String, required: true },
desc :{ type: String, required: true }
})
module.exports=mongoose.model('specialite',specialitechema)

