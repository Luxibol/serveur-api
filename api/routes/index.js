var express = require('express');
var router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservations');

var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
  res.render("index", { user: null, message: null });
});


router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservations', reservationRoute); // Ajoute la gestion des réservations

module.exports = router;
