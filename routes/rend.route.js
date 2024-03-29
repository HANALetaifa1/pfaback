const express = require('express');
const Rend = require('../Modeles/rend');
const router = express.Router();
const nodemailer = require('nodemailer');
//const twilio = require("twilio");
const { addDays } = require('date-fns');

// Afficher la liste des rendez-vous
router.get('/', async (req, res) => {
  try {
    const rends = await Rend.find().populate("medecinID").populate("userID").exec();
    res.status(200).json(rends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Afficher les rendez-vous d'un patient spécifique
router.get('/user/:userId', async (req, res) => {
  try {
    const rendP = await Rend.find({ userID: req.params.userId }).populate("userID").populate("medecinID").exec();
    res.status(200).json(rendP);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Changer l'état d'un rendez-vous en "accepter" avec notification SMS au patient
router.put('/accept/:rendID', async (req, res) => {
  try {
    const id = req.params.rendID;
    const red = { etatrend: "accepter", _id: id };
    await Rend.findByIdAndUpdate(id, red);
    res.json(red);

    const rendezVous = await Rend.findById(id).populate("userID").exec();
    const rendezVousDate = new Date(rendezVous.Daterd).toLocaleDateString();
    const rendezVousTime = rendezVous.timerd;
    const messageBody = `Votre rendez-vous a été accepté. Date : ${rendezVousDate}, Heure : ${rendezVousTime}`;

    await twilio.messages.create({
      from: '+14026859122',
      to: rendezVous.userID.phone,
      body: messageBody
    });
    console.log('Message sent to', rendezVous.userID.phone);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Ajouter un rendez-vous avec vérification de disponibilité
router.post('/rendezvous', async (req, res) => {
  const nouvrend = new Rend(req.body);
  try {
    const rendezVousExiste = await Rend.exists({ medecinID: nouvrend.medecinID, Daterd: nouvrend.Daterd, timerd: nouvrend.timerd });
    if (!rendezVousExiste) {
      // Créer le rendez-vous car il n'existe pas déjà
      await nouvrend.save();
      const messageBody = `doctor, Rendez-vous créé pour la date ${nouvrend.Daterd} à ${nouvrend.timerd}, Attendez la réponse du médecin.`;
      await twilio.messages.create({ from: "+14026859122", to: "+21699583157", body: messageBody });
      res.status(200).json(nouvrend);
    } else {
      // Rendez-vous déjà existant
      return res.status(409).json({ message: 'Ce rendez-vous est déjà réservé.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// // // Ajouter un rendez-vous avec vérification de disponibilité
// router.post('/rendez', async (req, res) => {
//   const nouvrend = new Rend(req.body);
//   try {
//     const rendezVousExiste = await Rend.exists({ medecinID: nouvrend.medecinID, Daterd: nouvrend.Daterd, timerd: nouvrend.timerd });
//     if (rendezVousExiste) {
//       return res.status(409).json({ message: 'Ce rendez-vous est déjà réservé.' });
//     }
//     const rendezVousPourLaJournee = await Rend.countDocuments({ medecinID: nouvrend.medecinID, Daterd: nouvrend.Daterd });
//     if (rendezVousPourLaJournee > 10) {
//       return res.status(409).json({ message: 'La limite de rendez-vous pour cette journée a été atteinte.' });
//     }
//     await nouvrend.save();
//     const messageBody = `DrMedical, Rendez-vous créé pour la date ${nouvrend.Daterd} à ${nouvrend.timerd}, Attendez la réponse de médecin.`;
//     await twilio.messages.create({ from: "+14026859122", to: "+21699583157", body: messageBody });
//     res.status(200).json(nouvrend);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Reporter un rendez-vous avec notification SMS au patient
// router.put('/raporter/:rendID', async (req, res) => {
//   const id = req.params.rendID;
//   const { Daterd, timerd } = req.body;
//   try {
//     const rendezVous = await Rend.findById(id).populate("userID").exec();
//     const isDateReserved = await Rend.exists({ Daterd, timerd, etatrend: { $ne: "reporter" } });
//     if (isDateReserved) {
//       return res.status(400).json({ message: 'La date choisie est déjà réservée.' });
//     }
//     const red = { etatrend: "reporter", Daterd, timerd, _id: id };
//     await Rend.findByIdAndUpdate(id, red);
//     res.json(red);
//     const messageBody = `Votre rendez-vous a été reporté à une autre date : ${Daterd} à ${timerd}`;
//     await twilio.messages.create({ from: '+14026859122', to: rendezVous.userID.phone, body: messageBody });
//     console.log('Message sent to', rendezVous.userID.phone);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });



router.put('/:rendID', async (req, res) => {
  const id = req.params.rendID;
  const { Daterd, timerd } = req.body;
  
  try {
      // Vérifier si le rendez-vous existe et récupérer les informations du patient associé
      const rendezVous = await Rend.findById(id).populate("userID").exec();
      if (!rendezVous) {
          return res.status(404).json({ message: 'Rendez-vous non trouvé.' });
      }
      
      // Vérifier si la nouvelle date est déjà réservée pour un autre rendez-vous
      const isDateReserved = await Rend.exists({ Daterd, timerd, etatrend: { $ne: "reporter" } });
      if (isDateReserved) {
          return res.status(400).json({ message: 'La date choisie est déjà réservée.' });
      }
      
      // Mettre à jour l'état du rendez-vous pour le reporter à la nouvelle date et heure
      const updatedRend = await Rend.findByIdAndUpdate(id, { etatrend: "reporter", Daterd, timerd }, { new: true });
      
      // Envoyer un message SMS au patient pour l'informer du report du rendez-vous
      const messageBody = `Votre rendez-vous a été reporté à une autre date : ${Daterd} à ${timerd}`;
      // Insérez ici le code pour envoyer un message SMS via Twilio au numéro de téléphone du patient
      // Assurez-vous que Twilio est correctement configuré et que vous avez accès au numéro de téléphone du patient via rendezVous.userID.phone
      
      res.status(200).json(updatedRend);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Annuler un rendez-vous
router.put('/cancel/:rendID', async (req, res) => {
  const id = req.params.rendID;
  try {
    const red = { etatrend: "cancel", _id: id };
    await Rend.findByIdAndUpdate(id, red);
    res.json(red);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Supprimer un rendez-vous
router.delete('/:rendId', async (req, res) => {
  const id = req.params.rendId;
  await Rend.findByIdAndDelete(id);
  res.json({ message: "Rendez-vous supprimé avec succès." });
});

// Récupérer un rendez-vous spécifique
router.get('/:rendId', async (req, res) => {
  try {
    const red = await Rend.findById(req.params.rendId);
    res.status(200).json(red);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
