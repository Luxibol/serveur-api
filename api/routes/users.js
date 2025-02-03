const express = require('express');
const router = express.Router();

const service  = require('../services/users');

router.get('/:id', service.getById);

router.post('/add', service.add);

router.patch('/:id', service.update);

router.delete('/:id', service.delete);

//Route authenticate
router.post('/authenticate', service.authenticate);


module.exports = router;
