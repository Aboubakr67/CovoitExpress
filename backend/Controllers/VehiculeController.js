const UserModel = require("../Models/UserModel");
const VehiculeModel = require("../Models/VehiculeModel");
const TrajetModel = require("../Models/TrajetModel");
const HttpError = require("../Models/errorModel");

// Récupérer un seul véhicule
// GET : http://localhost:5000/api/getVehicule/:id
// id : id d'un vehicule
module.exports.getVehicule = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Récupère l'utilisateur de la base de données à l'aide de son id
    const vehicule = await VehiculeModel.findById(id);

    if (!vehicule) {
      return next(new HttpError("Aucun vehicule trouvé.", 422));
    }

    return res.status(200).json({ vehicule });
  } catch (err) {
    return next(
      new HttpError(
        "Erreur lors de la récupération des véhicules de l'utilisateur.",
        422
      )
    );
  }
};

// Récupérer tout les véhicules de l'utilisateurs
// GET : http://localhost:5000/api/getVehicules/:id
// id : id d'un user
module.exports.getVehicules = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Récupère l'utilisateur de la base de données à l'aide de son id
    const user = await UserModel.findById(id);

    if (!user) {
      return next(new HttpError("Aucun utilisateur trouvé.", 422));
    }

    // Récupérer tous les véhicules de l'utilisateur
    let vehicules = await VehiculeModel.find({ _id: { $in: user.vehicule } });

    // Si aucun véhicule n'est trouvé, renvoyer un tableau vide
    // if (!vehicules) {
    //   vehicules = [];
    // }

    // console.log(vehicules);
    // Renvoyer uniquement le tableau des véhicules de l'utilisateur
    return res.status(200).json({ vehicules });
  } catch (err) {
    return next(
      new HttpError(
        "Erreur lors de la récupération des véhicules de l'utilisateur.",
        422
      )
    );
  }
};

// Création d'un vehicule
// POST : http://localhost:5000/api/createVehicule
module.exports.createVehicule = async (req, res, next) => {
  try {
    const { marque, modele, annee, couleur, immatriculation, userId } =
      req.body;

    // console.log(marque, modele, annee, couleur, immatriculation, userId);
    // Créer un nouveau véhicule
    const vehicule = new VehiculeModel({
      marque,
      modele,
      annee,
      couleur,
      immatriculation,
    });

    // console.log(vehicule);

    // Sauvegarder le véhicule dans la base de données
    await vehicule.save();

    // console.log(vehicule);
    // Récupérer l'utilisateur à partir de la base de données
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new HttpError("Utilisateur non trouvé.", 422));
    }

    // Ajouter l'ID du véhicule à la liste des véhicules de l'utilisateur
    user.vehicule.push(vehicule._id);

    // Sauvegarder les modifications apportées à l'utilisateur dans la base de données
    await user.save();

    return res.status(201).json({ created: true });
  } catch (error) {
    return next(
      new HttpError(
        "Erreur lors de la création et de l'ajout du véhicule à l'utilisateur.",
        422
      )
    );
  }
};

// Modifier un véhicule
// PATCH : http://localhost:5000/api/editVehicule/:id
// id : id d'un vehicule
module.exports.editVehicule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { marque, modele, annee, couleur, immatriculation } = req.body;

    // Vérifier si au moins une propriété a été envoyée dans la requête
    if (!marque && !modele && !annee && !couleur && !immatriculation) {
      return next(new HttpError("Aucune donnée de mise à jour fournie.", 400));
    }

    let vehicule = await VehiculeModel.findById(id);

    if (!vehicule) {
      return next(new HttpError("Véhicule non trouvé.", 404));
    }

    // Mettre à jour les propriétés du véhicule uniquement si elles sont fournies dans la requête
    if (marque) {
      vehicule.marque = marque;
    }
    if (modele) {
      vehicule.modele = modele;
    }
    if (annee) {
      vehicule.annee = annee;
    }
    if (couleur) {
      vehicule.couleur = couleur;
    }
    if (immatriculation) {
      vehicule.immatriculation = immatriculation;
    }

    // Sauvegarder les modifications dans la base de données
    await vehicule.save();

    return res.status(200).json({ edited: true });
  } catch (error) {
    return next(
      new HttpError("Erreur lors de la mise à jour du véhicule.", 500)
    );
  }
};

// Supprimer un véhicule
// DELETE : http://localhost:5000/api/deleteVehicule/:id
// id : id d'un véhicule
module.exports.deleteVehicule = async (req, res, next) => {
  try {
    const { id } = req.params;

    console.log(id);

    // Vérifier si le véhicule est associé à un trajet
    const trajet = await TrajetModel.findOne({ vehicule_utilisee: id });

    console.log(trajet);

    if (trajet) {
      return res.json({
        deleted: false,
        message: "Véhicule associé à un trajet. Impossible de le supprimer.",
      });
      // return next(
      //   new HttpError(
      //     "Véhicule associé à un trajet. Impossible de le supprimer.",
      //     422
      //   )
      // );
    }

    // Supprimer le véhicule de la base de données
    const vehiculeDeleted = await VehiculeModel.findByIdAndDelete(id);

    if (!vehiculeDeleted) {
      return res.status(404).json({ message: "Véhicule non trouvé." });
    }

    return res.status(200).json({ deleted: true });
  } catch (err) {
    return next(
      new HttpError("Erreur lors de la suppression du véhicule.", 500)
    );
  }
};
