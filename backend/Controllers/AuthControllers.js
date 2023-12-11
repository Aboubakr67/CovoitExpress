const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");


const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, "jwt_token_key", {
        expiresIn: maxAge,
    });
}

const handleErrors = (err) => {
    let errors = { email: "", password: "" };

    if (err.message === "incorrect email") {
        errors.email = "That email is not registered";
    }

    if (err.message === "incorrect password") {
        errors.password = "That password is incorrect";
    }


    if (err.code === 11000) {
        errors.email = "Email is already registered";
    }
    if (err.message.includes("Users validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, email, password, dateNaissance, adresse, tel } = req.body;

        // Vérifier si les champs nom, prenom, email et password sont vides
        const errors = {};
        if (!nom) errors.nom = "Nom is required";
        if (!prenom) errors.prenom = "Prenom is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
        if (!dateNaissance) errors.dateNaissance = "Date de naissance is required";
        if (!adresse) errors.adresse = "Adresse is required";
        if (!tel) errors.tel = "Numero de telephone is required";

        if (Object.keys(errors).length > 0) {
            // Si l'un des champs est vide, renvoyer une erreur
            return res.json({ errors, created: false });
        }


        const user = await UserModel.create({ nom, prenom, email, password, dateNaissance, adresse, tel });
        // const token = createToken(user._id);

        // res.cookie("jwt", token, {
        //     withCredentials: true,
        //     httpOnly: false,
        //     maxAge: maxAge * 1000,
        //     sameSite: "None", // Définir SameSite à "None" pour les cookies cross-site
        //     secure: true, // Assurez-vous d'utiliser HTTPS en production pour utiliser SameSite=None
        // });
        res.status(201).json({ user: user._id, created: true })
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({ errors, created: false });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Vérifier si les champs email et password sont vides
        if (!email || !password) {
            // Si l'un des champs est vide, renvoyer une erreur avec errors.email rempli
            const errors = { email: !email ? "Email is required" : "", password: !password ? "Password is required" : "" };
            return res.json({ errors, created: false });
        }


        const user = await UserModel.login(email, password);
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            withCredentials: true,
            httpOnly: false,
            maxAge: maxAge * 1000,
            sameSite: "None", // Définir SameSite à "None" pour les cookies cross-site
            secure: true, // Assurez-vous d'utiliser HTTPS en production pour utiliser SameSite=None
        });
        res.status(200).json({ user: user._id, created: true })
    } catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.json({ errors, created: false });
    }

};