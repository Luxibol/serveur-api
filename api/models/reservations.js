const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

// Schéma pour Reservation
const reservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    boatName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v > this.startDate;  // La date de fin doit être après la date de début
            },
            message: 'End date must be after start date!'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);