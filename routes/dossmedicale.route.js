const express = require('express');
const router = express.Router();
const DossMedical = require('../Modeles/dossmedical')
const Ord = require('../Modeles/ord');
const Cons = require('../Modeles/cons');
const patient = require('../Modeles/patient');

// router.get('/ords/patients/:patientId', async (req, res) => {
//     try {
//       const ordonance = await Ord.find({ patientID: req.params.patientId }).populate("patientID").populate("consID").exec();
//       res.status(200).json(ordonance);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
// });
router.post('/', async (req, res) => {
  try {
      const newDossierMedical = new DossMedical(req.body);
      await newDossierMedical.save();
      res.status(201).json(newDossierMedical);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

//consId
router.get('/cons/:consId',async(req, res)=>{
  try {
  const cons1 = await Cons.findById(req.params.consId).populate("patientID").exec();
  res.status(200).json(cons1);
  } catch (error) {
  res.status(404).json({ message: error.message });
  }
  });



router.get('/ord/:consId', async (req, res) => {
    try {
      const ordonnance = await Ord.findOne({ consID: req.params.consId }).populate("consID").populate("patientID").exec();
      res.status(200).json(ordonnance);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});
//patien de medecin
// router.get('/patients/:patientId', async (req, res) => {
//   try {
//     const patient1 = await patient.find();
//     res.status(200).json(patient1);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });


//patients
router.get('/:patientId',async(req, res)=>{
  try {
  const pat = await patient.findById(req.params.patientId).populate("medecinID").exec();
  res.status(200).json(pat);
  } catch (error) {
  res.status(404).json({ message: error.message });
  }
  });



//cons 
router.get('/cons/patient/:patientId', async (req, res) => {
    try {
      const consultations = await Cons.find({ patientID: req.params.patientId }).populate("patientID").populate("medecinID").exec();
      res.status(200).json(consultations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});


module.exports = router;

