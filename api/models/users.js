const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

// Schéma pour User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Le nom d'utilisateur doit être unique
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,  // L'email doit être unique
        match: [/\S+@\S+\.\S+/, 'Email is invalid']  // Validation de l'email
    },
    password: {
        type: String,
        required: true,
        minlength: 8,  // Mot de passe minimum de 8 caractères
        match: [/(?=.*\d)(?=.*[A-Z])(?=.*\W)/, 'Password must contain at least one number, one uppercase letter, and one special character'],
    }
}, { timestamps: true });


// Hash le mot de passe quand il est modifié
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


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


// Exportation des modèles
module.exports = {
    User: mongoose.model('User', userSchema),
    Catway: mongoose.model('Catway', catwaySchema),
    Reservation: mongoose.model('Reservation', reservationSchema)
};