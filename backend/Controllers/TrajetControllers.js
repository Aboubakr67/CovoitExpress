const UserModel = require("../Models/UserModel");
const TrajetModel = require("../Models/TrajetModel");
const HttpError = require("../Models/errorModel");
const axios = require("axios");

// Récupérer un seul trajet
// GET : http://localhost:5000/api/getTrajet/:id
// id : id d'un trajet
module.exports.getTrajet = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Récupère le trajet de la base de données à l'aide de son id
    const trajet = await TrajetModel.findById(id)
      .populate("vehicule_utilisee")
      .populate("passagers");

    if (!trajet) {
      return next(new HttpError("Aucun trajet trouvé.", 422));
    }

    return res.status(200).json({ trajet });
  } catch (err) {
    return next(
      new HttpError(
        "Erreur lors de la récupération du trajet de l'utilisateur.",
        422
      )
    );
  }
};

// Récupérer tout les trajets de l'utilisateur
// GET : http://localhost:5000/api/getTrajets/:id
// id : id d'un user
module.exports.getTrajets = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new HttpError("Veuilez saisir un id valide.", 422));
    }

    // Récupère l'utilisateur de la base de données à l'aide de son id
    const user = await UserModel.findById(id);

    if (!user) {
      return next(new HttpError("Aucun utilisateur trouvé.", 422));
    }

    // Recherche de tous les trajets avec l'utilisateur en tant que conducteur
    const trajets = await TrajetModel.find({ conducteur: user._id }).populate(
      "vehicule_utilisee",
      ["marque", "modele", "annee", "immatriculation"]
    );

    // Renvoyer les trajets trouvés
    return res.status(200).json({ trajets });
  } catch (err) {
    return next(
      new HttpError(
        "Erreur lors de la récupération des trajets de l'utilisateur.",
        422
      )
    );
  }
};

// Fonction pour calculer le prix en fonction de la distance
const calculatePrice = (distance) => {
  if (distance >= 0 && distance <= 100) {
    return 7.79;
  } else if (distance > 100 && distance <= 300) {
    return 12.23;
  } else if (distance > 300 && distance <= 500) {
    return 17.75;
  } else if (distance > 500 && distance <= 700) {
    return 32.05;
  } else if (distance > 700 && distance <= 900) {
    return 35.78;
  } else {
    return 40.23;
  }
};

// Création d'un trajet
// POST : http://localhost:5000/api/createTrajet
module.exports.createTrajet = async (req, res, next) => {
  try {
    const {
      conducteur,
      depart,
      coordonneeDepart,
      destination,
      coordonneeDestination,
      date,
      heure_depart,
      heure_arrivee,
      distance,
      duree,
      placesDisponibles,
      vehicule_utilisee,
    } = req.body;

    // Calculer le prix en fonction de la distance
    const prix = calculatePrice(distance);

    // Créer un nouveau trajet
    const trajet = new TrajetModel({
      conducteur,
      depart,
      coordonneeDepart,
      destination,
      coordonneeDestination,
      date,
      heure_depart,
      heure_arrivee,
      distance,
      duree,
      placesDisponibles,
      vehicule_utilisee,
      prix,
    });
    // console.log(trajet);

    // Sauvegarder le trajet dans la base de données
    await trajet.save();

    return res.status(201).json({ created: true });
  } catch (error) {
    return next(new HttpError("Erreur lors de la création du trajet.", 422));
  }
};

// Modifier un trajet
// PATCH : http://localhost:5000/api/editTrajet/:id
// id : id d'un trajet
module.exports.editTrajet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      depart,
      destination,
      date,
      heure_depart,
      heure_arrivee,
      distance,
      duree,
      placesDisponibles,
      vehicule_utilisee,
    } = req.body;

    // Vérifier si au moins une propriété a été envoyée dans la requête
    if (
      !depart &&
      !destination &&
      !date &&
      !heure_depart &&
      !heure_arrivee &&
      !distance &&
      !duree &&
      !placesDisponibles &&
      !vehicule_utilisee
    ) {
      return next(new HttpError("Aucune donnée de mise à jour fournie.", 400));
    }

    let trajet = await TrajetModel.findById(id);

    if (!trajet) {
      return next(new HttpError("Trajet non trouvé.", 404));
    }

    // Mettre à jour les propriétés du trajet uniquement si elles sont fournies dans la requête
    if (depart) {
      trajet.depart = depart;
    }
    if (destination) {
      trajet.destination = destination;
    }
    if (date) {
      trajet.date = date;
    }
    if (heure_depart) {
      trajet.heure_depart = heure_depart;
    }
    if (heure_arrivee) {
      trajet.heure_arrivee = heure_arrivee;
    }
    if (distance) {
      trajet.distance = distance;
    }
    if (duree) {
      trajet.duree = duree;
    }
    if (placesDisponibles) {
      trajet.placesDisponibles = placesDisponibles;
    }
    if (vehicule_utilisee) {
      trajet.vehicule_utilisee = vehicule_utilisee;
    }

    // Sauvegarder les modifications dans la base de données
    await trajet.save();

    return res.status(200).json({ edited: true });
  } catch (error) {
    return next(new HttpError("Erreur lors de la mise à jour du trajet.", 500));
  }
};

// Supprimer un trajet
// DELETE : http://localhost:5000/api/deleteTrajet/:id
// id : id d'un trajet
module.exports.deleteTrajet = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Recherche du trajet dans la base de données
    const trajet = await TrajetModel.findById(id);

    // Vérifier si le trajet existe
    if (!trajet) {
      return next(new HttpError("Trajet non trouvé.", 404));
    }

    // Vérifier si le trajet a des passagers
    if (trajet.passagers.length > 0) {
      return res.json({
        deleted: false,
        message:
          "Impossible de supprimer le trajet car des passagers sont associés à celui-ci.",
      });
    }

    // Supprimer le trajet de la base de données
    await TrajetModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ deleted: true, message: "Trajet supprimé avec succès." });
  } catch (error) {
    return next(new HttpError("Erreur lors de la suppression du trajet.", 500));
  }
};

// Ajouter un passager à un trajet
// POST : http://localhost:5000/api/addPassager/:id
// id : ID du trajet auquel ajouter le passager
// Body : { passagerId: ID du passager à ajouter }
module.exports.addPassager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { passagerId } = req.body;

    if (!id) {
      return next(new HttpError("Veuilez saisir un id de trajet.", 422));
    }

    if (!passagerId) {
      return next(new HttpError("Veuilez saisir un id de passager.", 422));
    }

    // Récupère l'utilisateur de la base de données à l'aide de son id
    const user = await UserModel.findById(passagerId);

    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    // Récupérer le trajet de la base de données
    const trajet = await TrajetModel.findById(id);

    if (!trajet) {
      return res.status(404).json({ message: "Trajet non trouvé." });
    }

    // Vérifier si le trajet a encore des places disponibles
    if (trajet.placesDisponibles === 0) {
      return res.json({ message: "Aucune place disponible dans ce trajet." });
    }

    // Ajouter le passager au trajet
    trajet.passagers.push(passagerId);
    // Décrémenter le nombre de places disponibles
    trajet.placesDisponibles--;

    // Enregistrer les modifications dans la base de données
    await trajet.save();

    return res
      .status(200)
      .json({ message: "Passager ajouté avec succès au trajet." });
  } catch (err) {
    return next(
      new HttpError("Erreur lors de l'ajout du passager au trajet.", 500)
    );
  }
};

// API Externe permettant de recupérer :
// Durée du trajet
// Distance
module.exports.getInfoApiOpenRouteService = async (req, res, next) => {
  try {
    const {
      longitudeDepart,
      latitudeDepart,
      longitudeArrivee,
      latitudeArrivee,
    } = req.body;

    // Vérifier si toutes les coordonnées sont présentes dans le corps de la requête
    if (
      !longitudeDepart ||
      !latitudeDepart ||
      !longitudeArrivee ||
      !latitudeArrivee
    ) {
      return next(
        new Error("Les coordonnées de départ et d'arrivée sont requises.")
      );
    }

    // Effectuer la requête à l'API OpenRouteService pour calculer l'itinéraire
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        locations: [
          [longitudeDepart, latitudeDepart],
          [longitudeArrivee, latitudeArrivee],
        ],
        metrics: ["distance", "duration"],
        units: "km",
      },
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization: process.env.TOKEN_OPEN_ROUTE_SERVICE,
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    // Extraire les informations nécessaires de la réponse
    const routes = response.data;
    // Récupérer les informations du premier itinéraire
    const firstDuration = routes.durations[0][1]; // Durée en secondes du premier itinéraire
    const firstDistance = routes.distances[0][1]; // Distance en kilomètres du premier itinéraire

    // console.log(`Durée du premier itinéraire: ${firstDuration} secondes`);
    // console.log(`Distance du premier itinéraire: ${firstDistance} kilomètres`);

    // Retourner les informations du premier itinéraire
    return res
      .status(200)
      .json({ duration: firstDuration, distance: firstDistance });
  } catch (error) {
    console.error("Erreur lors du calcul de l'itinéraire:", error);
    return next(new Error("Erreur lors du calcul de l'itinéraire."));
  }
};

// Recherche un trajet
// POST : http://localhost:5000/api/searchTrajet
// Body :
// { depart: adresse de départ,
// destination: adresse de destination,
// date: date de départ,
// nbPassagers : nombre(s) de passagers,
//  }
module.exports.searchTrajet = async (req, res, next) => {
  try {
    const { depart, destination, date, nbpassagers } = req.body;

    // Extraire le premier chiffre du code postal du départ et de la destination
    const premierChiffreDepart = getPremierChiffreCodePostal(depart);
    const premierChiffreDestination = getPremierChiffreCodePostal(destination);

    // Récupérer tous les trajets de la base de données
    // const trajets = await TrajetModel.find();

    const trajets = await TrajetModel.find().populate({
      path: "conducteur",
      model: "Users",
      // select: "nom prenom",
    });

    // Filtrer les trajets en fonction des critères de recherche
    const filteredTrajets = trajets.filter((trajet) => {
      // Extraire le premier chiffre du code postal du trajet
      const premierChiffreCodePostalDepart = getPremierChiffreCodePostal(
        trajet.depart
      );
      const premierChiffreCodePostalDestination = getPremierChiffreCodePostal(
        trajet.destination
      );

      // Vérifier si les premiers chiffres des codes postaux correspondent
      if (
        premierChiffreCodePostalDepart !== premierChiffreDepart ||
        premierChiffreCodePostalDestination !== premierChiffreDestination
      ) {
        return false;
      }

      // Vérifier la date
      if (trajet.date !== date) {
        return false;
      }

      // Vérifier le nombre de passagers
      if (trajet.placesDisponibles < nbpassagers) {
        return false;
      }

      return true;
    });

    return res
      .status(200)
      .json({ trajets: filteredTrajets.length > 0 ? filteredTrajets : [] });
    // return res.status(200).json({ filteredTrajets });
  } catch (err) {
    return next(new HttpError("Erreur lors de la recherche de trajets.", 422));
  }
};

// Fonction pour extraire le premier chiffre du code postal à partir d'une adresse
const getPremierChiffreCodePostal = (adresse) => {
  // Extraire le code postal de l'adresse
  const regex = /\b\d{5}\b/;
  const match = adresse.match(regex);

  // Si un code postal est trouvé, extraire le premier chiffre
  if (match && match[0]) {
    const premierChiffre = match[0][0];
    return premierChiffre;
  } else {
    return null;
  }
};
