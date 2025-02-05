const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const mongoose = require('mongoose');

// Récupérer un utilisateur par ID
exports.getById = async (req, res) => {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        let user = await User.findById(id).select("-password"); // Exclut le mot de passe
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Ajouter un utilisateur
exports.add = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Tous les champs obligatoires ne sont pas remplis." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ message: "Erreur lors de la création de l'utilisateur", error });
    }
};

// Modifier un utilisateur
exports.update = async (req, res) => {
    const { password, ...updates } = req.body;
    const id = req.params.id;

    try {
        let user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        Object.assign(user, updates);
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: "Erreur lors de la mise à jour", error });
    }
};

// Supprimer un utilisateur
exports.delete = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);
        return res.status(204).json({ message: "Utilisateur supprimé" });        
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression", error });
    }
};

// Authentifier un utilisateur
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("🔹 Recherche de l'utilisateur :", email);

        let user = await User.findOne({ email });
        if (!user) {
            console.log("🔴 Utilisateur non trouvé !");
            return res.status(401).render("index", { message: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("🔴 Mot de passe incorrect !");
            return res.status(401).render("index", { message: "Identifiants incorrects" });
        }

        console.log("🟢 Utilisateur trouvé :", user.email);

        // Génération du token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        console.log("🟢 Token généré :", token);

        // Stocke le token et l'utilisateur en session
        req.session.token = token;
        req.session.user = { username: user.username, email: user.email };

        // Redirige vers le dashboard
        res.redirect("/dashboard");

    } catch (error) {
        console.error(" Erreur d'authentification :", error);
        if (!res.headersSent) res.status(500).render("index", { message: "Erreur serveur" });
    }
};

// Récupérer un utilisateur par email
exports.getByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return null;  // Retourne `null` au lieu d'envoyer une réponse HTTP
        return user;
    } catch (err) {
        console.error(" Erreur lors de la récupération de l'utilisateur :", err);
        return null;  // Évite l'erreur de double envoi de réponse
    }
};


// Mettre à jour un utilisateur par email
exports.updateByEmail = async (req, res) => {
    const { password, ...updates } = req.body;

    try {
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            updates,
            { new: true }
        );

        if (!updatedUser) return null;  // Retourne `null` si l'utilisateur n'existe pas

        return updatedUser;  // Retourne l'utilisateur mis à jour
    } catch (err) {
        console.error(" Erreur lors de la mise à jour de l'utilisateur :", err);
        return null;
    }
};



// Supprimer un utilisateur par email
exports.deleteByEmail = async (req, res) => {
    try {
        await User.findOneAndDelete({ email: req.params.email });
        return true;  // Retourne `true` si l'utilisateur est supprimé
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async () => {
    try {
        const users = await User.find({}, '-password'); // Exclut le mot de passe des résultats
        if (!Array.isArray(users)) {
            console.error(" Erreur : getAllUsers() ne retourne pas un tableau !");
            return [];
        }
        return users;
    } catch (error) {
        console.error(" Erreur lors de la récupération des utilisateurs :", error);
        throw new Error("Impossible de récupérer les utilisateurs");
    }
};



