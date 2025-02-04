const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// Schéma pour Catway
const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
        unique: true,  // Le numéro de catway doit être unique
    },
    catwayType: {
        type: String,
        enum: ['long', 'short'],  // Seulement "long" ou "short" comme valeurs valides
        required: true
    },
    catwayState: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Catway", catwaySchema);