const express = require('express');
const router = express.Router();
const service  = require('../services/users');
const private = require('../middlewares/private');
const bcrypt = require('bcryptjs');

const User = require('../models/users');


// Route pour s'authentifier et stocker le token
router.post('/authenticate', async (req, res) => {
    console.log("🔹 Tentative d'authentification :", req.body);

    try {
        const response = await service.authenticate(req, res);

        if (!response || !response.token || !response.user) {  
            console.log("🔴 Échec de l'authentification");
            return res.render("index", { message: "Échec de l'authentification" });
        }

        // Stocker correctement l'utilisateur et le token en session
        req.session.token = `Bearer ${response.token}`;
        req.session.user = response.user;    

        console.log("🟢 Utilisateur connecté :", req.session.user);
        console.log("🟢 Token stocké en session :", req.session.token);

        return res.redirect('/dashboard');
    } catch (err) {
        console.error(" Erreur d'authentification :", err);
        if (!res.headersSent) return res.status(500).send("Erreur serveur");
    }
});

// Route pour récupérer tous les utilisateurs
router.get('/', private.checkJWT, async (req, res) => {
    try {
        const users = await service.getAllUsers();
        if (!Array.isArray(users)) {
            console.error(" Erreur : `users` n'est pas un tableau !");
            return res.status(500).send("Erreur interne du serveur");
        }
        res.render("users", { title: "Gestion des Utilisateurs", users });
    } catch (err) {
        console.error(" Erreur lors de la récupération des utilisateurs :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Route pour afficher le formulaire d'ajout
router.get('/new', private.checkJWT, (req, res) => {
    res.render("user_form", { title: "Ajouter un Utilisateur", action: "Ajouter", user: null });
});

router.get('/edit/:email', private.checkJWT, async (req, res) => {
    try {
        const user = await service.getByEmail(req, res);
        if (!user) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        res.render("user_form", { title: "Modifier un Utilisateur", action: "Modifier", user });
    } catch (err) {
        console.error(" Erreur lors de la récupération de l'utilisateur :", err);
        res.status(500).send("Erreur serveur");
    }
});

// Route pour ajouter un utilisateur
router.post('/new', private.checkJWT, async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Vérifier que tous les champs sont remplis
        if (!email || !username || !password) {
            console.error(" Erreur : Tous les champs sont requis.");
            return res.render("user_form", { title: "Ajouter un Utilisateur", action: "Ajouter", user: null, message: "Tous les champs sont obligatoires." });
        }

        // Hacher le mot de passe avant de le sauvegarder
        const hashedPassword = await bcrypt.hash(password, 10);

        await new User({ email, username, password: hashedPassword }).save();

        console.log("🟢 Utilisateur ajouté avec succès :", email);

        return res.redirect('/users');  // Ajout de `return` pour éviter `ERR_HTTP_HEADERS_SENT`

    } catch (err) {
        console.error(" Erreur lors de l'ajout d'un utilisateur :", err);
        if (!res.headersSent) {
            return res.status(500).send("Erreur serveur");
        }
    }
});


// Route pour modifier un utilisateur (POST)
router.post('/edit/:email', private.checkJWT, async (req, res) => {
    try {
        const updatedUser = await service.updateByEmail(req, res);
        
        if (!updatedUser) {
            console.error("🔴 Utilisateur non trouvé :", req.params.email);
            return res.status(404).send("Utilisateur non trouvé");
        }

        return res.redirect('/users');  // Redirection après modification
    } catch (err) {
        console.error(" Erreur lors de la mise à jour de l'utilisateur :", err);
        return res.status(500).send("Erreur serveur");
    }
});


// Route pour supprimer un utilisateur
router.get('/delete/:email', private.checkJWT, async (req, res) => {
    try {
        const result = await service.deleteByEmail(req, res);

        if (result) {
            console.log("🟢 Utilisateur supprimé :", req.params.email);
            return res.redirect('/users');  // Redirection après suppression
        } else {
            console.log("🔴 Impossible de supprimer :", req.params.email);
            return res.status(404).send("Utilisateur non trouvé");
        }
    } catch (err) {
        console.error(" Erreur lors de la suppression de l'utilisateur :", err);
        return res.status(500).send("Erreur serveur");
    }
});




// Route pour se déconnecter
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); // Redirige vers la page d'accueil après déconnexion
    });
});

module.exports = router;
