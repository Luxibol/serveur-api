const express = require('express');
const router = express.Router();

const service  = require('../services/users');

const private = require('../middlewares/private');

// Routes spécifiques (statique) AVANT les routes dynamiques
//Route authenticate
router.post('/authenticate', service.authenticate);
router.post('/add', service.add);

// Routes dynamiques (avec `:id`) APRÈS
router.get('/:id', private.checkJWT, service.getById);
router.patch('/:id', private.checkJWT, service.update);
router.delete('/:id', private.checkJWT, service.delete);


module.exports = router;
