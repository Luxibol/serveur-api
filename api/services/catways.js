const Catway = require("../models/catways");

// Récupérer tous les catways
exports.getAllCatways = async () => {
    try {
        return await Catway.find();
    } catch (error) {
        console.error(" Erreur lors de la récupération des catways :", error);
        throw new Error("Impossible de récupérer les catways");
    }
};

// Récupérer un catway par ID
exports.getById = async (id) => {
    try {
        return await Catway.findById(id);
    } catch (error) {
        console.error(" Erreur lors de la récupération du catway :", error);
        return null;
    }
};

// Ajouter un catway
exports.add = async (data) => {
    try {
        const catway = new Catway(data);
        await catway.save();
    } catch (error) {
        console.error(" Erreur lors de l'ajout du catway :", error);
        throw new Error("Impossible d'ajouter le catway");
    }
};

// Modifier un catway
exports.update = async (id, updates) => {
    try {
        return await Catway.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
        console.error(" Erreur lors de la mise à jour du catway :", error);
        throw new Error("Impossible de mettre à jour le catway");
    }
};

// Supprimer un catway
exports.delete = async (id) => {
    try {
        await Catway.findByIdAndDelete(id);
    } catch (error) {
        console.error(" Erreur lors de la suppression du catway :", error);
        throw new Error("Impossible de supprimer le catway");
    }
};
