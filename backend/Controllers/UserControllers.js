const UserModel = require("../Models/UserModel");
const VehiculeModel = require("../Models/VehiculeModel");
const TrajetModel = require("../Models/TrajetModel");
const HttpError = require("../Models/errorModel");
const bcrypt = require("bcryptjs");

// Récupérer les infos de l'utilisateur
// GET : http://localhost:5000/api/getUser/:id
// id : id de l'utilisateur
module.exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Récupère l'utilisateur de la base de données à l'aide de son id (sans le password)
    const user = await UserModel.findById(id).select("-password");

    if (!user) {
      return next(new HttpError("Aucun user trouvé.", 422));
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(
      new HttpError("Erreur lors de la récupération de l'utilisateur.", 422)
    );
  }
};

// Modifier les infos utilisateur (nom, prenom, etc), non password
// PATCH : http://localhost:5000/api/editUser/:id
// id : id de utilisateur
module.exports.editUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modifiedData = req.body;

    if (Object.keys(modifiedData).length === 0) {
      return res
        .status(400)
        .json({ message: "Aucune donnée à mettre à jour." });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mettre à jour les données de l'utilisateur
    Object.assign(user, modifiedData);

    // Enregistrer les modifications dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur." });
  }
};

module.exports.editPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedNewPassword;

    // Enregistrer les modifications dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succès." });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du mot de passe." });
  }
};
