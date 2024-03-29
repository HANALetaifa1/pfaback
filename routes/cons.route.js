const express = require('express');
const Cons = require('../Modeles/cons');
const router = express.Router();


//  afficher la liste des consultation
router.get('/patients/:patientId', async (req, res) => {
    try {
      const consultations = await Cons.find({ patientID: req.params.patientId }).populate("patientID").exec();
      res.status(200).json(consultations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});


//afficher tous les cons
router.get('/', async (req, res, )=> {
    try {
    const cons1 = await Cons.find().populate("patientID").exec();
    res.status(200).json(cons1);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
  
// créer un nouvel consultation
router.post('/', async (req, res) => {
const nouvcons = new Cons(req.body)
try {
await nouvcons.save();
res.status(200).json(nouvcons);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// chercher un consultation
router.get('/:consId',async(req, res)=>{
try {
const cons1 = await Cons.findById(req.params.consId).populate("patientID").exec();
res.status(200).json(cons1);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// modifier un consultation
router.put('/:consId', async (req, res)=> {
const {DateCons,NumCons,numfiche,MotifCons,ExemansComplementaires,TaillePatient,PoisPatient,tension,Température,DescriptionExamen,medecinID,patientID} = req.body;
const id = req.params.consId;
try {
const red = { 
    DateCons:DateCons,NumCons:NumCons,numfiche:numfiche,MotifCons:MotifCons,ExemansComplementaires:ExemansComplementaires,TaillePatient:TaillePatient,PoisPatient:PoisPatient,tension:tension,Température:Température,DescriptionExamen:DescriptionExamen,medecinID:medecinID,patientID:patientID, _id:id };
await Cons.findByIdAndUpdate(id, red);
res.json(Cons);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Supprimer un consultation
router.delete('/:consId', async (req, res)=> {
const id = req.params.consId;
await Cons.findByIdAndDelete(id);
res.json({ message: "consultation deleted successfully." });
});


module.exports = router;








