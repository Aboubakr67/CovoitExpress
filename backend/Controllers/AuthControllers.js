const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HttpError = require("../Models/errorModel");

module.exports.register = async (req, res, next) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      confirmPassword,
      dateNaissance,
      adresse,
      tel,
    } = req.body;

    if (
      !nom ||
      !prenom ||
      !email ||
      !password ||
      !dateNaissance ||
      !adresse ||
      !tel ||
      !confirmPassword
    ) {
      return next(new HttpError("Veuillez remplir tous les champs.", 422));
    }

    // Récupérer l'email en minuscule
    const newEmail = email.toLowerCase();

    const emailExists = await UserModel.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Cet email existe déja.", 422));
    }

    // Vérification de la complexité du mot de passe: 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et un caractère spécial
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return next(
        new HttpError(
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (min: 8 caractères).",
          422
        )
      );
    }

    if (password != confirmPassword) {
      return next(new HttpError("Les mots de passe ne corresponde pas.", 422));
    }

    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      nom,
      prenom,
      email,
      password: hashedPass,
      dateNaissance,
      adresse,
      tel,
    });

    // res.status(201).json(`New user ${user.email} registered.`);
    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("L'enregistrement de l'utilisateur a échoué.", 422)
    );
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Veuillez remplir tous les champs.", 422));
    }
    const newEmail = email.toLowerCase();

    const user = await UserModel.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Identifiants invalides.", 422));
    }

    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Identifiants invalides.", 422));
    }

    const { _id: id, nom, prenom } = user;
    const token = jwt.sign({ id, nom, prenom }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, nom, prenom });
  } catch (error) {
    return next(
      new HttpError(
        "Échec de la connexion. Veuillez vérifier vos identifiants.",
        422
      )
    );
  }
};

module.exports.checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      // L'utilisateur existe déjà, renvoyer un message indiquant qu'il existe
      // return res.json({ error: 'Cet e-mail est déjà utilisé par un autre utilisateur.', exists: true });

      // L'utilisateur existe déjà, renvoyer true
      return res.json({ exists: true });
    }

    // L'utilisateur n'existe pas encore, permettre de passer à la suite du formulaire
    // return res.json({ exists: false });

    // L'utilisateur n'existe pas encore, renvoyer false
    return res.json({ exists: false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Erreur lors de la vérification de l'utilisateur.",
      exists: false,
    });
  }
};
