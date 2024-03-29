const express = require('express');
const router = express.Router();
const patient=require("../Modeles/patient")
// afficher la liste des patient 
router.get('/', async (req, res, )=> {
try {
const patients = await patient.find();
res.status(200).json(patients);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// app.get('/medecin/patients', async (req, res) => {
//     try {
//       // Récupérer l'identifiant unique du médecin connecté
//       const medecinId = req.user.id;
  
//       // Trouver le médecin dans la base de données à partir de son identifiant unique
//       const medecin = await Medecin.findById(medecinId);
  
//       // Vérifier si le médecin existe dans la base de données
//       if (!medecin) {
//         return res.status(404).json({ message: 'Medecin not found' });
//       }
  
//       // Trouver tous les patients associés à ce médecin
//       const patients = await patient.find({ medecin: medecinId });
  
//       // Retourner la liste des patients associés à ce médecin
//       return res.status(200).json(patients);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });



//---- Récupérer tous les patients associés à un médecin spécifique en fonction de l'ID du médecin fourni---
router.get('/patients/:medecinsId', async (req, res) => {
    try {
      const patient1 = await patient.find({ medecinID: req.params.medecinsId }).populate("medecinID").exec();
      res.status(200).json(patient1);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

// créer un nouvel patients
router.post('/', async (req, res) => {
const nouvpatient = new patient(req.body)
try {
await nouvpatient.save();
res.status(200).json(nouvpatient );
} catch (error) {
res.status(404).json({ message: error.message });
}
});

// chercher un patient
router.get('/:patientId',async(req, res)=>{
try {
const pat = await patient.findById(req.params.patientId);
res.status(200).json(pat);
} catch (error) {
res.status(404).json({ message: error.message });
}
});

// modifier un patient
router.put('/:patientId', async (req, res)=> {
const {numfiche,cinPa,nompatient,prenompatient,emailpatient,adressepatient,sexepatient,password,numtelPa,profession,dateNais,HistoriqueSocial,HistoriqueFamilial} = req.body;

const id = req.params.patientId;
try {
const pat1 = { 
    cinPa:cinPa,nompatient:nompatient,numfiche:numfiche,prenompatient:prenompatient,profession:profession,emailpatient:emailpatient,adressepatient:adressepatient,HistoriqueSocial:HistoriqueSocial,HistoriqueFamilial:HistoriqueFamilial,sexepatient:sexepatient,password:password,numtelPa:numtelPa,dateNais:dateNais, _id:id };
await patient.findByIdAndUpdate(id, pat1);
res.json(pat1);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Supprimer un patient
router.delete('/:patientId', async (req, res)=> {
const id = req.params.patientId;
await patient.findByIdAndDelete(id);
res.json({ message: "patient deleted successfully." });
});






module.exports = router;