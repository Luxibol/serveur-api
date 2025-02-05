const express = require("express");
const router = express.Router();
const service = require("../services/reservations");
const private = require('../middlewares/private');

// Liste de toutes les réservations (Affichage EJS)
router.get("/", private.checkJWT, async (req, res) => {
    try {
        const reservations = await service.getAllReservations();
        res.render("reservations", { title: "Gestion des Réservations", reservations });
    } catch (err) {
        console.error(" Erreur lors de la récupération des réservations :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Formulaire pour ajouter une réservation
router.get("/new", private.checkJWT, (req, res) => {
    res.render("reservation_form", { title: "Ajouter une Réservation", action: "Ajouter", reservation: null });
});

// Récupérer une réservation pour modification
router.get("/edit/:id", private.checkJWT, async (req, res) => {
    try {
        const reservation = await service.getById(req.params.id);
        if (!reservation) return res.status(404).send("Réservation non trouvée");

        res.render("reservation_form", { title: "Modifier une Réservation", action: "Modifier", reservation });
    } catch (err) {
        console.error(" Erreur lors de la récupération de la réservation :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Ajouter une nouvelle réservation
router.post("/new", private.checkJWT, async (req, res) => {
    try {
        await service.add(req.body);
        return res.redirect("/reservations");
    } catch (err) {
        console.error(" Erreur lors de l'ajout d'une réservation :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Modifier une réservation
router.post("/edit/:id", private.checkJWT, async (req, res) => {
    try {
        const updatedReservation = await service.update(req.params.id, req.body);
        if (!updatedReservation) return res.status(404).send("Réservation non trouvée");

        return res.redirect("/reservations");
    } catch (err) {
        console.error(" Erreur lors de la mise à jour de la réservation :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Supprimer une réservation
router.get("/delete/:id", private.checkJWT, async (req, res) => {
    try {
        await service.delete(req.params.id);
        return res.redirect("/reservations");
    } catch (err) {
        console.error(" Erreur lors de la suppression de la réservation :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
