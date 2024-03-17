const UserModel = require("../Models/UserModel");
const VehiculeModel = require("../Models/VehiculeModel");
const TrajetModel = require("../Models/TrajetModel");
const HttpError = require("../Models/errorModel");
const axios = require("axios");

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
    // const trajets = await TrajetModel.find({ conducteur: user._id });

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
        "Erreur lors de la récupération des véhicules de l'utilisateur.",
        422
      )
    );
  }
};

// Création d'un trajet
module.exports.createTrajet = async (req, res, next) => {
  try {
    const {
      conducteur,
      depart,
      destination,
      heure_depart,
      heure_arrivee,
      distance,
      duree,
      placesDisponibles,
      vehicule_utilisee,
    } = req.body;

    // Créer un nouveau trajet
    const trajet = new TrajetModel({
      conducteur,
      depart,
      destination,
      heure_depart,
      heure_arrivee,
      distance,
      duree,
      placesDisponibles,
      vehicule_utilisee,
    });
    // console.log(trajet);

    // Sauvegarder le trajet dans la base de données
    await trajet.save();

    return res.status(201).json({ created: true });
  } catch (error) {
    return next(new HttpError("Erreur lors de la création du trajet.", 422));
  }
};

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
          Authorization:
          process.env.TOKEN_OPEN_ROUTE_SERVICE,
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
