const express = require('express');
const router = express.Router();

const service  = require('../services/users');
const private = require('../middlewares/private');

// Route pour ajouter un utilisateur
router.post('/', service.add);

// Route pour s'authentifier
router.post('/authenticate', service.authenticate);

// Routes dynamiques
router.get('/:email', /* private.checkJWT, */ service.getByEmail);
router.patch('/:email', /* private.checkJWT, */ service.updateByEmail);
router.delete('/:email', /* private.checkJWT, */ service.deleteByEmail);

// Route pour récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await service.getAllUsers(); // Appelle une fonction de service
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
