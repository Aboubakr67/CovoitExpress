const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    trajet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trajets',
        required: true,
      },
    commentaire: {
        type: String,
        required: true,
    },
    note: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true,
        collection: 'avis',
    });


module.exports = mongoose.model("Avis", avisSchema);