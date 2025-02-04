const express = require('express');
const router = express.Router();

const service  = require('../services/users');
const private = require('../middlewares/private');

// Route pour ajouter un utilisateur
router.post('/', service.add);

// Route pour s'authentifier
router.post('/authenticate', service.authenticate);

// Routes dynamiques
router.get('/:email', private.checkJWT, service.getByEmail);
router.patch('/:email', private.checkJWT, service.updateByEmail);
router.delete('/:email', private.checkJWT, service.deleteByEmail);

// Route pour récupérer tous les utilisateurs
router.get('/', private.checkJWT, async (req, res) => {
    try {
        const users = await service.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs :", err);
        res.status(500).json({ message: err.message || "Erreur interne du serveur" });
    }
});


module.exports = router;
