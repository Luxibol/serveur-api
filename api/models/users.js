const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

// Schéma pour User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    //Ne re-hashe le mot de passe que s'il n'est pas déjà hashé
    if (!this.isModified('password') || this.password.startsWith("$2b$")) {
        return next();
    }   
    this.password = await bcrypt.hash(this.password, 10);
    
    next();
});


module.exports = mongoose.model('User', userSchema);