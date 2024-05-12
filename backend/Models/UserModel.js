const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateNaissance: {
        type: String,
        required: true,
    },
    adresse: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    photoProfil: {
        type: String, // Stocker le chemin de l'image ou l'image encodée en base64
    },
    vehicule: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicules',
            required: true,
        }
    ],
},
    {
        timestamps: true,
        collection: 'users',
    });


module.exports = mongoose.model("Users", userSchema);