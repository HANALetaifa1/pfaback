const express = require('express');
const Ord = require('../Modeles/ord');
const router = express.Router();
// // afficher la liste des consultation


router.get('/cons/:consId', async (req, res) => {
    try {
      const ordonnance = await Ord.findOne({ consID: req.params.consId }).populate("consID").populate("patientID").exec();
      res.status(200).json(ordonnance);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

router.get('/doss/:code', async (req, res, )=> {
  const { code } = req.params;

  try {
  const dossier = await Ord.findOne({ code })
  .populate('patientID')
  .populate("consID")
  .populate("medecinID").exec();

  if (!dossier) {
    return res.status(404).json({ message: 'Dossier introuvable' });
  }
  res.status(200).json(dossier);
  } catch (error) {
  res.status(404).json({ message: error.message });
  }
  });


//afficher tous les ordonnances 
router.get('/', async (req, res, )=> {
    try {
    const ord1 = await Ord.find().populate("consID").populate("patientID").populate("medecinID").exec();
    res.status(200).json(ord1);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
    });
  

// créer un nouvel ordonnnance
router.post('/', async (req, res) => {
  try {
    const ord = await Ord.findOneAndUpdate({ consID: req.body.consID }, { "$set": req.body })
    if (!ord) {
      const nouvord = new Ord(req.body)
      await nouvord.save();
    }

    const ordonnance = await Ord.findOne({ consID: req.body.consID }).populate("consID").populate("patientID").populate("medecinID").exec();
    console.log(ordonnance)
    res.status(200).json(ordonnance);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});



// // chercher un consultation
router.get('/:ordId',async(req, res)=>{
try {
const ord1 = await Ord.findById(req.params.ordId);
res.status(200).json(ord1);
} catch (error) {
res.status(404).json({ message: error.message });
}
});



router.get('/:consId',async(req, res)=>{
  try {
  const ord1 = await Ord.findById(req.params.consId);
  res.status(200).json(ord1);
  } catch (error) {
  res.status(404).json({ message: error.message });
  }
  });


module.exports = router;








