const UserModel = require("../Models/UserModel");
const VehiculeModel = require("../Models/VehiculeModel");
const HttpError = require("../Models/errorModel");

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
module.exports.createVehicule = async (req, res, next) => {
  try {
    const { marque, modele, annee, couleur, immatriculation } = req.body;

    const vehicule = new VehiculeModel({
      marque,
      modele,
      annee,
      couleur,
      immatriculation,
    });
    // console.log(vehicule);
    await vehicule.save();
    // console.log("Véhicule créé :", vehicule);
    res.status(201).json({ created: true });
  } catch (error) {
    return next(new HttpError("Erreur lors de la création du véhicule.", 422));
  }
};

// Ajouter un vehicule à une personne
module.exports.addVehiculeToUser = async (req, res, next) => {
  try {
    // Récupérer l'ID de l'utilisateur et l'ID du véhicule à ajouter
    const { userId, vehiculeId } = req.body;

    const vehicule = await VehiculeModel.findById(vehiculeId);

    if (!vehicule) {
      return next(new HttpError("Vehicule non trouvé.", 422));
    }

    // Récupérer l'utilisateur à partir de la base de données
    const user = await UserModel.findById(userId);

    if (!user) {
      return next(new HttpError("Utilisateur non trouvé.", 422));
    }

    // Ajouter l'ID du véhicule à la liste des véhicules de l'utilisateur
    user.vehicule.push(vehiculeId);

    // Sauvegarder les modifications apportées à l'utilisateur dans la base de données
    await user.save();

    return res
      .status(200)
      .json({ message: "Véhicule ajouté à l'utilisateur avec succès" });
  } catch (error) {
    return next(
      new HttpError("Erreur lors de l'ajout du véhicule à l'utilisateur.", 422)
    );
  }
};

// Création d'un vehicule et ajout à un utilisateur (Combinaison de createVehicule et addVehiculeToUser)
module.exports.createAndAddVehiculeToUser = async (req, res, next) => {
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
