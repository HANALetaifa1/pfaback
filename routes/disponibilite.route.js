const express = require('express');
const router = express.Router();
const Disponibilite = require('../Modeles/disponibilite');



router.post('/:medecinId', async (req, res) => {
    try {
        const medecinId = req.params.medecinId; // Récupérer l'ID du médecin depuis les paramètres de l'URL
        const disponibiliteDetails = req.body; // Récupérer les détails de la disponibilité depuis le corps de la requête
        
        // Ajouter l'ID du médecin aux détails de la disponibilité
        disponibiliteDetails.medecinID = medecinId;

        // Créer une nouvelle instance de Disponibilite avec les détails fournis
        const nouvelleDisponibilite = new Disponibilite(disponibiliteDetails);

        // Sauvegarder la nouvelle disponibilité dans la base de données
        await nouvelleDisponibilite.save();

        // Répondre avec la nouvelle disponibilité créée
        res.status(201).json(nouvelleDisponibilite);
    } catch (error) {
        // Gérer les erreurs s'il y en a
        res.status(400).json({ message: error.message });
    }
});

// // Créer une nouvelle disponibilité
// router.post('/', async (req, res) => {
//     try {
//         const nouvelleDisponibilite = new Disponibilite(req.body);
//         await nouvelleDisponibilite.save();
//         res.status(201).json(nouvelleDisponibilite);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });



// Afficher les disponibilités d'un médecin spécifique

router.get('/medecin/:medecinId', async (req, res) => { // Ajout du / avant medecin/:medecinId
    try {
        const disponibilitesMedecin = await Disponibilite.find({ medecinID: req.params.medecinId }).populate("medecinID").exec();
        if (!disponibilitesMedecin || disponibilitesMedecin.length === 0) {
            return res.status(404).json({ message: "Aucune disponibilité trouvée pour ce médecin." });
        }
        res.status(200).json(disponibilitesMedecin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






// router.get('medecin/:medecinId', async (req, res) => {
//     try {
//         const disponibilitesMedecin = await Disponibilite.find({ medecinID: req.params.medecinId }).populate("medecinID").exec();
//         if (!disponibilitesMedecin || disponibilitesMedecin.length === 0) {
//             return res.status(404).json({ message: "Aucune disponibilité trouvée pour ce médecin." });
//         }
//         res.status(200).json(disponibilitesMedecin);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// Modifier une disponibilité
router.put('/:dispoId', async (req, res) => {
    const id = req.params.dispoId;
    try {
        const disponibiliteModifiee = await Disponibilite.findByIdAndUpdate(id, req.body, { new: true });
        if (!disponibiliteModifiee) {
            return res.status(404).json({ message: "Disponibilité introuvable." });
        }
        res.status(200).json(disponibiliteModifiee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer une disponibilité
router.delete('/:dispoId', async (req, res) => {
    const id = req.params.dispoId;
    try {
        const disponibiliteSupprimee = await Disponibilite.findByIdAndDelete(id);
        if (!disponibiliteSupprimee) {
            return res.status(404).json({ message: "Disponibilité introuvable." });
        }
        res.json({ message: "Disponibilité supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
