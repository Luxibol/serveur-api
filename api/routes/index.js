var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');

router.get('/', async (req, res) => {
  res.status(200).json({
    name   : process.env.APP_NAME,
    version: '1.0',
    status : 200,
    message: 'Bienvenue sur l\'API !'
  });
});

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute); // Ajoute la gestion des réservations

module.exports = router;
