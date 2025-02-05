const Reservation = require("../models/reservations");

// Récupérer toutes les réservations
exports.getAllReservations = async () => {
    try {
        return await Reservation.find();
    } catch (error) {
        console.error(" Erreur lors de la récupération des réservations :", error);
        throw new Error("Impossible de récupérer les réservations");
    }
};

// Récupérer les réservations d'un catway spécifique
exports.getByCatway = async (catwayNumber) => {
    try {
        return await Reservation.find({ catwayNumber });
    } catch (error) {
        console.error(" Erreur lors de la récupération des réservations du catway :", error);
        return null;
    }
};

// Récupérer une réservation par ID
exports.getById = async (id) => {
    try {
        return await Reservation.findById(id);
    } catch (error) {
        console.error(" Erreur lors de la récupération de la réservation :", error);
        return null;
    }
};

//  Ajouter une réservation
exports.add = async (data) => {
    try {
        const reservation = new Reservation(data);
        await reservation.save();
    } catch (error) {
        console.error(" Erreur lors de l'ajout de la réservation :", error);
        throw new Error("Impossible d'ajouter la réservation");
    }
};

// Modifier une réservation
exports.update = async (id, updates) => {
    try {
        return await Reservation.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
        console.error(" Erreur lors de la mise à jour de la réservation :", error);
        throw new Error("Impossible de mettre à jour la réservation");
    }
};

// Supprimer une réservation
exports.delete = async (id) => {
    try {
        await Reservation.findByIdAndDelete(id);
    } catch (error) {
        console.error(" Erreur lors de la suppression de la réservation :", error);
        throw new Error("Impossible de supprimer la réservation");
    }
};
