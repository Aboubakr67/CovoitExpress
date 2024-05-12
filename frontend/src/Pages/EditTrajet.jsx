import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuccessMessage from "../Components/card/SuccessMessage";

const EditTrajet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Récupère l'user connecter à partir du context
  const { currentUser } = useContext(UserContext);

  const [trajet, setTrajet] = useState();

  // Champ du formulaire
  const [formData, setFormData] = useState({
    depart: "",
    destination: "",
    date: "",
    heureDepart: "",
    placesDisponibles: 1,
    vehicule: "",
  });

  const [modifiedData, setModifiedData] = useState({});

  // Véhicule(s) de l'utilisateur
  const [vehicules, setVehicules] = useState([]);

  const [error, setError] = useState("");

  // On stocke ici les coordonnes : longitudes et latitudes de chaque adresse
  const [departCoordinates, setDepartCoordinates] = useState([null, null]);
  const [destinationCoordinates, setDestinationCoordinates] = useState([
    null,
    null,
  ]);

  const [searchResultsDepart, setSearchResultsDepart] = useState([]);
  const [searchResultsDestination, setSearchResultsDestination] = useState([]);

  // Permet de vérifie s'il l'utilisateur à bien selectionner une adresse valide (de l'api gouv)
  const [addressDepartSelected, setAddressDepartSelected] = useState(true);
  const [addressArriveeSelected, setAddressArriveeSelected] = useState(true);

  useEffect(() => {
    const getTrajet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getTrajet/${id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        const trajetData = response.data.trajet;
        setTrajet(trajetData);

        // Mettre à jour les valeurs dans formData avec les données du trajet
        setFormData({
          depart: trajetData.depart,
          destination: trajetData.destination,
          date: trajetData.date,
          heureDepart: trajetData.heure_depart,
          placesDisponibles: trajetData.placesDisponibles,
          vehicule: trajetData.vehicule_utilisee._id,
        });

        setDepartCoordinates([
          trajetData.coordonneeDepart[0],
          trajetData.coordonneeDepart[1],
        ]);
        setDestinationCoordinates([
          trajetData.coordonneeDestination[0],
          trajetData.coordonneeDestination[1],
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      getTrajet();
    }

    return () => {
      //   Cleanup function
      //   Ajoutez ici le code de nettoyage si nécessaire
    };
  }, []);

  // On récupère à partir du backend les véhicules de l'user
  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getVehicules/${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        setVehicules(response.data.vehicules);
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules", error);
      }
    };

    if (currentUser) {
      fetchVehicules();
    }
  }, []);

  // Appelle de l'api pour récupérer des adresses
  const handleSearch = async (query, setter) => {
    try {
      // Vérifier si la longueur de la requête est supérieure ou égale à 3 caractères
      if (query.length >= 3) {
        const response = await axios.get(
          `https://api-adresse.data.gouv.fr/search/?q=${query}&type=housenumber&autocomplete=1`
        );

        // Vérifier si la liste de résultats n'est pas vide
        if (response.data.features.length > 0) {
          // console.log(response.data.features);

          setter(response.data.features);
        } else {
          // Si la liste est vide, afficher "Aucun résultat"
          setter([{ properties: { label: "Aucun résultat" } }]);
        }
      } else {
        // Si la longueur de la requête est inférieure à 3 caractères, vider la liste
        setter([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setModifiedData({
      ...modifiedData,
      [name]: value,
    });

    setFormData({
      ...formData,
      [name]: value,
    });

    // Effectuer la recherche d'adresse avec un délai de 500 ms après la saisie
    if (name === "depart") {
      setAddressDepartSelected(false);
      setTimeout(() => handleSearch(value, setSearchResultsDepart), 500);
    } else if (name === "destination") {
      setAddressArriveeSelected(false);
      setTimeout(() => handleSearch(value, setSearchResultsDestination), 500);
    }
  };

  const handleSelectAddress = (address, name) => {
    // Mettre à jour l'état du formulaire avec l'adresse sélectionnée
    setFormData({
      ...formData,
      [name]: address,
    });

    setModifiedData({
      ...modifiedData,
      [name]: address,
    });

    // Récupérer les résultats de recherche appropriés en fonction du nom de l'adresse sélectionnée
    const searchResults =
      name === "depart" ? searchResultsDepart : searchResultsDestination;

    // Rechercher l'adresse sélectionnée dans les résultats de recherche
    const selectedAddress = searchResults.find(
      (result) => result.properties.label === address
    );

    if (selectedAddress) {
      // Extraire les coordonnées de l'adresse sélectionnée
      const [longitude, latitude] = selectedAddress.geometry.coordinates;

      // Mettre à jour les coordonnées en fonction du nom de l'adresse sélectionnée
      if (name === "depart") {
        setDepartCoordinates([longitude, latitude]);
        setAddressDepartSelected(true);
        setSearchResultsDepart([]);
      } else if (name === "destination") {
        setDestinationCoordinates([longitude, latitude]);
        setAddressArriveeSelected(true);
        setSearchResultsDestination([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'adresse de départ et de destination ont été sélectionnées à partir de l'api
    if (!addressDepartSelected || !addressArriveeSelected) {
      setError(
        "Veuillez sélectionner une adresse à partir de l'autocomplétion."
      );
      return;
    } else if (
      formData.depart == "Aucun résultat" ||
      formData.destination == "Aucun résultat"
    ) {
      setError(
        "Veuillez sélectionner une adresse à partir de l'autocomplétion."
      );
      return;
    }

    // Vérifier si une heure à été selectionner
    if (!formData.heureDepart) {
      setError("Veuillez sélectionner une heure de départ.");
      return;
    }

    // Vérifier si un véhicule a été sélectionné
    if (!formData.vehicule) {
      setError("Veuillez sélectionner un véhicule.");
      return;
    }

    if (formData.placesDisponibles <= 0 || formData.placesDisponibles > 5) {
      setError(
        "Le nombre de places disponibles doit être compris entre 1 et 5"
      );
      return;
    }

    // Vérification de la date
    const selectedDate = new Date(formData.date);
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    // Extraire uniquement la partie de la date qui nous intéresse (jour, mois, année)
    const selectedDateFormatted = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const todayFormatted = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );


    if (
      isNaN(selectedDateFormatted.getTime()) ||
      selectedDateFormatted < todayFormatted ||
      selectedDateFormatted > sixMonthsLater
    ) {
      setError(
        "Veuillez sélectionner une date valide entre aujourd'hui et six mois plus tard."
      );
      return;
    }

    // Vérifier si des modifications ont été apportées
    const isModified = Object.keys(modifiedData).length > 0;

    if (!isModified) {
      setError("Aucune modification détectée.");
      return;
    }

    let heuresArrivee, minutesArrivee;
    let distance, duration;
    let duree_hours, duree_minutes;

    // console.log(formData);
    // console.log("modifiedData");
    // console.log(modifiedData);

    // Appelle de l'api openrouteservice pour récupérer la durée du trajet et la distance
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getInfoApiOpenRouteService",
        {
          longitudeDepart: departCoordinates[0],
          latitudeDepart: departCoordinates[1],
          longitudeArrivee: destinationCoordinates[0],
          latitudeArrivee: destinationCoordinates[1],
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // token
          },
        }
      );

      duration = response.data.duration;
      distance = response.data.distance;

      // Convertir la durée du trajet en heures et minutes
      duree_hours = Math.floor(duration / 3600);
      duree_minutes = Math.floor((duration % 3600) / 60);

      const heureDepartParts = formData.heureDepart.split(":");

      if (heureDepartParts.length === 2) {
        const heures = parseInt(heureDepartParts[0]);
        const minutes = parseInt(heureDepartParts[1]);
        if (!isNaN(heures) && !isNaN(minutes)) {
          const heureDepartInSeconds = heures * 3600 + minutes * 60;

          // Calcul de l'heure d'arrivée en secondes
          const heureArriveeInSeconds = heureDepartInSeconds + duration;

          // Conversion de l'heure d'arrivée en heures, minutes et secondes
          heuresArrivee = Math.floor(heureArriveeInSeconds / 3600);
          const resteArrivee = heureArriveeInSeconds % 3600;
          minutesArrivee = Math.floor(resteArrivee / 60);
          const secondesArrivee = Math.floor(resteArrivee % 60);

          // Si les heures d'arrivée dépassent 24 heures, ajustez-les
          if (heuresArrivee >= 24) {
            heuresArrivee -= 24;
          }
        } else {
          console.error("Format d'heure de départ invalide");
        }
      } else {
        console.error("Format d'heure de départ invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      // Gérez les erreurs ici
    }

    try {
      // Données à envoyer à l'API createTrajet
      const trajetData = {
        depart: formData.depart,
        destination: formData.destination,
        date: formData.date.toString(),
        heure_depart: formData.heureDepart,
        heure_arrivee: `${heuresArrivee}h ${minutesArrivee}min`,
        distance: distance.toString() + " km",
        duree: `${duree_hours}h ${duree_minutes}min`,
        placesDisponibles: formData.placesDisponibles,
        vehicule_utilisee: formData.vehicule,
      };

      const response = await axios.patch(
        `http://localhost:5000/api/editTrajet/${trajet._id}`,
        trajetData,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // token
          },
        }
      );

      const trajetResponse = await response.data.edited;
      if (!trajetResponse) {
        setError("Impossible d'enregistrer le trajet. Veuillez réessayer.");
      }

      setError("");
      // Stocker les données dans localStorage
      localStorage.setItem("edited", response.data.edited);

      navigate(`/trajet-details/${trajet._id}`);
    } catch (error) {
      console.log(error);
      setError("Erreur dans la création du trajet.");
      return;
    }
  };

  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <h2>Modification du trajet</h2>
            <div className="d-flex justify-content-center align-items-center"></div>
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            <div className="mb-3">
              <label htmlFor="depart" className="form-label">
                Départ
              </label>
              <input
                type="text"
                name="depart"
                className={`form-control`}
                placeholder="Départ"
                value={formData.depart}
                onChange={(e) => {
                  handleSearch(
                    e.target.value,
                    setSearchResultsDepart,
                    "depart"
                  );
                  handleChange(e);
                }}
              />
              {/* Afficher les résultats de la recherche sous le champ de départ */}
              {searchResultsDepart.length > 0 && (
                <ul className="list-group position-absolute w-100">
                  {searchResultsDepart.map((result) => (
                    <li
                      key={result.properties.id}
                      className="list-group-item"
                      onClick={() =>
                        handleSelectAddress(result.properties.label, "depart")
                      }
                    >
                      {result.properties.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                className={`form-control`}
                placeholder="Destination"
                value={formData.destination}
                onChange={(e) => {
                  handleSearch(
                    e.target.value,
                    setSearchResultsDestination,
                    "destination"
                  );
                  handleChange(e);
                }}
              />
              {/* Afficher les résultats de la recherche sous le champ de départ */}
              {searchResultsDestination.length > 0 && (
                <ul className="list-group position-absolute w-100">
                  {searchResultsDestination.map((result) => (
                    <li
                      key={result.properties.id}
                      className="list-group-item"
                      onClick={() =>
                        handleSelectAddress(
                          result.properties.label,
                          "destination"
                        )
                      }
                    >
                      {result.properties.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                name="date"
                className={`form-control`}
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="heureDepart" className="form-label">
                Heure de départ
              </label>
              <input
                type="time"
                name="heureDepart"
                className={`form-control`}
                placeholder="Heure de départ"
                value={formData.heureDepart}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="placesDisponibles" className="form-label">
                Places disponibles
              </label>
              <input
                type="number"
                name="placesDisponibles"
                className={`form-control`}
                placeholder="Places disponibles"
                value={formData.placesDisponibles}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="vehicule" className="form-label">
                Véhicule
              </label>
              <select
                name="vehicule"
                value={formData.vehicule}
                onChange={handleChange}
                className={`form-control`}
              >
                <option value="">Sélectionnez un véhicule</option>
                {vehicules.length === 0 ? (
                  <option value="" disabled>
                    Vous n'avez pas de véhicules. Créez-en un.
                  </option>
                ) : (
                  vehicules.map((vehicule) => (
                    <option key={vehicule._id} value={vehicule._id}>
                      {vehicule.marque} {vehicule.modele}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-primary" type="submit">
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTrajet;
