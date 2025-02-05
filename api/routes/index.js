const express = require('express');
const router = express.Router();

// Route pour afficher la page d'accueil
router.get("/", (req, res) => {
    res.render("index", { user: req.session?.user || null, message: null });
});

// Route pour afficher la documentation
router.get("/docs", (req, res) => {
    res.render("docs");
});

module.exports = router;
