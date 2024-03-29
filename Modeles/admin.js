// const mongoose = require('mongoose');
// const Admin = mongoose.model('Admin' , {
//     nom: { type: String, required: false },
//     prenom: { type: String, required: false },
//     email: { type: String, required: true },
//     password : { type: String, required: true },
  
//     isAdmin: { type: Boolean, default: true },
//     role: {
//         type: String,
//         enum: ["patient", "admin","doctor"],
//         default: "admin"
//         },
//         isActive: {
//             type: Boolean,
//                default: false,
//                required: false
//            },

// })
// module.exports = mongoose.model ('Admin', Admin);



const mongoose = require('mongoose');


const admiin = new mongoose.Schema({
    nom: { type: String, required: false },
    prenom: { type: String, required: false },
    email: { type: String, required: true },
    password : { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    role: {
        type: String,
        enum: ["patient", "admin", "doctor"],
        default: "admin"
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

// Créer un modèle à partir du schéma
const admin = mongoose.model('admin', admiin);

module.exports = admin;
