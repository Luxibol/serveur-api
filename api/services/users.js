const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const mongoose = require('mongoose');

// Récupérer un utilisateur par ID
exports.getById = async (req, res, next) => {
    const id = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
    }

    try {
        let user = await User.findById(id);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Ajouter un utilisateur
exports.add = async (req, res, next) => {
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
        return res.status(400).json(error);
    }
};

// Modifier un utilisateur
exports.update = async (req, res, next) => {
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
        return res.status(400).json(error);
    }
};

// Supprimer un utilisateur
exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.deleteOne({ _id: id });
        return res.status(204).json({ message: "Utilisateur supprimé" });        
    } catch (error) {
        return res.status(500).json(error);
    }
};

// Authentifier un utilisateur
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Identifiants incorrects" });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "24h" });
        return res.status(200).json({ token, user: { username: user.username, email: user.email } });

    } catch (error) {
        return res.status(500).json(error);
    }
};

// Récupérer un utilisateur par email
exports.getByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

        if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Supprimer un utilisateur par email
exports.deleteByEmail = async (req, res) => {
    try {
        await User.findOneAndDelete({ email: req.params.email });
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclure le mot de passe des résultats
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
