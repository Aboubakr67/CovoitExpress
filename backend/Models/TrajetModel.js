const mongoose = require("mongoose");

const passagerSchema = new mongoose.Schema({
  passager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  // placesReservees: {
  //     type: Number,
  //     required: true,
  // },
});

const trajetSchema = new mongoose.Schema(
  {
    conducteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
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
    heure_arrivee: { // calculer en fonction de la duree
      type: String,
      // required: true,
    },
    distance: { // recup a partir de l'api openrouteservice
      type: String,
      // required: true,
    },
    duree: {  // recup a partir de l'api openrouteservice
      type: String,
      // required: true,
    },
    placesDisponibles: {
      type: Number,
      required: true,
    },
    passagers: [passagerSchema],
    vehicule_utilisee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicules",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "trajets",
  }
);

module.exports = mongoose.model("Trajets", trajetSchema);
