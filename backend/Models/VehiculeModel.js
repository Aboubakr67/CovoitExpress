const mongoose = require("mongoose");

const vehiculeSchema = new mongoose.Schema({
    marque: {
        type: String,
        required: true,
    },
    modele: {
        type: String,
        required: true,
    },
    annee: {
        type: String,
        required: true,
    },
    couleur: {
        type: String,
        required: true,
    },
    immatriculation: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        collection: 'vehicules',
    });

module.exports = mongoose.model("Vehicules", vehiculeSchema);
