const mongoose = require("mongoose");

const passagerSchema = new mongoose.Schema({
    passager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    placesReservees: {
        type: Number,
        required: true,
    },
});


const trajetSchema = new mongoose.Schema({
    conducteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    depart: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    heure_depart: {
        type: String,
        required: true,
    },
    heure_arrivee: {
        type: String,
        required: true,
    },
    duree: {
        type: String,
        required: true,
    },
    placesDisponibles: {
        type: Number,
        required: true,
    },
    passagers: [passagerSchema],
},
    {
        timestamps: true,
        collection: 'trajets',
    });


module.exports = mongoose.model("Trajets", trajetSchema);