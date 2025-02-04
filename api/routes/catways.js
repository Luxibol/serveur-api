// routes/catways.js
const express = require("express");
const router = express.Router();
const Catway = require("../models/catways");

// GET: Liste de tous les catways
router.get("/", async (req, res) => {
    try {
        const catways = await Catway.find();
        res.json(catways);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET: Détails d'un catway
router.get("/:id", async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });  // Utilise catwayNumber
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json(catway);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Création d'un catway
router.post("/", async (req, res) => {
    const catway = new Catway(req.body);
    try {
        await catway.save();
        res.status(201).json(catway);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Mise à jour de l'état d'un catway
router.put("/:id", async (req, res) => {
    try {
        const updatedCatway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },  // Recherche par catwayNumber
            { catwayState: req.body.catwayState },  
            { new: true }
        );
        if (!updatedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json(updatedCatway);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Suppression d'un catway
router.delete("/:id", async (req, res) => {
    try {
        const deletedCatway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        if (!deletedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.json({ message: "Catway supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;