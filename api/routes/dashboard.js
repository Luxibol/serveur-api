const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const Reservation = require('../models/reservations');

router.get('/', private.checkJWT, async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("🔴 Pas d'utilisateur en session !");
            return res.redirect('/');
        }

        console.log("🟢 Accès au tableau de bord");
        console.log("🔹 Utilisateur en session :", req.session.user);

        const reservations = await Reservation.find();
        res.render('dashboard', { 
            title: 'Tableau de Bord', 
            user: req.session.user,  // L'utilisateur est bien récupéré de la session
            date: new Date().toLocaleDateString(),
            reservations  
        });
    } catch (error) {
        console.error(" Erreur :", error);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
