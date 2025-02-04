const express = require("express");
const router = express.Router();
const Catway = require("../models/catways");
const Reservation = require("../models/reservations");

// GET: Liste des réservations d'un catway spécifique
router.get("/:id/reservations", async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Détails d'une réservation spécifique
router.get("/:id/reservations/:idReservation", async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Création d'une réservation pour un catway
router.post("/:id/reservations", async (req, res) => {
    try {
        // Vérifier si le catway existe
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).json({ message: "Catway non trouvé" });
        }

        // Créer la réservation
        const reservation = new Reservation({
            catwayNumber: req.params.id,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        await reservation.save();
        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Mise à jour d'une réservation
router.put("/:id/reservations/:idReservation", async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.idReservation,
            req.body,
            { new: true }
        );
        res.json(updatedReservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Suppression d'une réservation
router.delete("/:id/reservations/:idReservation", async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.idReservation);
        res.json({ message: "Réservation supprimée" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
