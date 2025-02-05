const express = require("express");
const router = express.Router();
const service = require("../services/catways");
const private = require("../middlewares/private");

// Récupérer tous les catways
router.get("/", private.checkJWT, async (req, res) => {
    try {
        const catways = await service.getAllCatways();
        res.render("catways", { title: "Gestion des Catways", catways });
    } catch (err) {
        console.error("Erreur lors de la récupération des catways :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Afficher le formulaire de création d'un catway
router.get("/new", private.checkJWT, (req, res) => {
    res.render("catway_form", { title: "Ajouter un Catway", action: "Ajouter", catway: null });
});

// Afficher le formulaire de modification d'un catway
router.get("/edit/:id", private.checkJWT, async (req, res) => {
    try {
        const catway = await service.getById(req.params.id);
        if (!catway) return res.status(404).send("Catway non trouvé");
        res.render("catway_form", { title: "Modifier un Catway", action: "Modifier", catway });
    } catch (err) {
        console.error(" Erreur lors de la récupération du catway :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Ajouter un catway
router.post("/new", private.checkJWT, async (req, res) => {
    try {
        await service.add(req.body);
        res.redirect("/catways");
    } catch (err) {
        console.error(" Erreur lors de l'ajout d'un catway :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Modifier un catway
router.post("/edit/:id", private.checkJWT, async (req, res) => {
    try {
        await service.update(req.params.id, req.body);
        res.redirect("/catways");
    } catch (err) {
        console.error(" Erreur lors de la mise à jour d'un catway :", err);
        res.status(500).send("Erreur serveur");
    }
});

//  Supprimer un catway
router.get("/delete/:id", private.checkJWT, async (req, res) => {
    try {
        await service.delete(req.params.id);
        res.redirect("/catways");
    } catch (err) {
        console.error(" Erreur lors de la suppression du catway :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
