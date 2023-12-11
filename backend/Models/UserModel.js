const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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
        type: Number,
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
});


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
        type: Date,
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
    vehicule: [vehiculeSchema],
},
    {
        timestamps: true,
        collection: 'users',
    });

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
}

module.exports = mongoose.model("Users", userSchema);