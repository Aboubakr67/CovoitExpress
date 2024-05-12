import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Rechercher = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const [formData, setFormData] = useState({
    depart: "",
    destination: "",
    date: "",
    nbpassagers: 1,
  });

  const [trajets, setTrajets] = useState([]);

  const [error, setError] = useState("");

  const [searchResultsDepart, setSearchResultsDepart] = useState([]);
  const [searchResultsDestination, setSearchResultsDestination] = useState([]);

  // Permet de vérifie s'il l'utilisateur à bien selectionner une adresse valide (de l'api gouv)
  const [addressDepartSelected, setAddressDepartSelected] = useState(false);
  const [addressArriveeSelected, setAddressArriveeSelected] = useState(false);

  // État pour contrôler l'affichage des résultats de recherche
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
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
    setFormData({
      ...formData,
      [name]: value,
    });

    // Effectuer la recherche d'adresse avec un délai de 500 ms après la saisie
    if (name === "depart") {
      setTimeout(() => handleSearch(value, setSearchResultsDepart), 500);
    } else if (name === "destination") {
      setTimeout(() => handleSearch(value, setSearchResultsDestination), 500);
    }
  };

  const handleSelectAddress = (address, name) => {
    // Mettre à jour l'état du formulaire avec l'adresse sélectionnée
    setFormData({
      ...formData,
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
        setAddressDepartSelected(true);
        setSearchResultsDepart([]);
      } else if (name === "destination") {
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

    if (formData.nbpassagers <= 0 || formData.nbpassagers > 6) {
      setError(
        "Le nombre de places disponibles doit être compris entre 1 et 6"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/searchTrajet",
        {
          depart: formData.depart,
          destination: formData.destination,
          date: formData.date,
          nbpassagers: formData.nbpassagers,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // token
          },
        }
      );

      setTrajets(response.data.trajets);
      setSearchSubmitted(true);
      setError("");
      console.log(response.data.trajets);
    } catch (error) {
      console.error("Erreur lors de la recherche de trajets:", error);
      // Gérez les erreurs ici
    }

    // setSearchResult(true);
    // console.log("recherche en cours");
    // console.log("Départ : ", formData.depart);
    // console.log("Destination : ", formData.destination);
    // console.log("Date : ", formData.date);
    // console.log("Nombre passager(s) : ", formData.nbpassagers);
  };

  return (
    <div className="container-fluid" style={{ marginTop: "110px" }}>
      <h1 className="mb-4">Où voulez-vous aller ?</h1>

      <div className="d-flex justify-content-center align-items-center">
        {error && <div className="alert alert-danger text-center">{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className="row">
        <div className="col-md-3 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <input
              type="text"
              name="depart"
              className="form-control"
              placeholder="Départ"
              value={formData.depart}
              onChange={(e) => {
                handleSearch(e.target.value, setSearchResultsDepart, "depart");
                handleChange(e);
              }}
            />
          </div>
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
        <div className="col-md-3 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <input
              type="text"
              name="destination"
              className="form-control"
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
          </div>
          {/* Afficher les résultats de la recherche sous le champ de destination */}
          {searchResultsDestination.length > 0 && (
            <ul className="list-group position-absolute w-100">
              {searchResultsDestination.map((result) => (
                <li
                  key={result.properties.id}
                  className="list-group-item"
                  onClick={() =>
                    handleSelectAddress(result.properties.label, "destination")
                  }
                >
                  {result.properties.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="date"
            name="date"
            className="form-control"
            placeholder="Date de départ"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <input
            type="number"
            name="nbpassagers"
            className="form-control"
            placeholder="Nombre de passagers"
            value={formData.nbpassagers}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-3">
          <button className="btn btn-primary w-100" type="submit">
            Rechercher
          </button>
        </div>
      </form>

      {searchSubmitted && trajets.length === 0 ? (
        <div className="div">
          <h2 className="center">Aucun trajets trouver</h2>
        </div>
      ) : (
        <>
          {/* Afficher les trajets si des trajets sont disponibles */}
          {trajets.length > 0 && (
            <>
              <h1 className="day">Ven. 17 mai</h1>
              <p className="itinéraire">
                {formData.depart} {" -> "} {formData.destination}
              </p>
              <p className="trajet_total">
                <span>{trajets.length}</span> trajet(s) disponible
              </p>
              <div className="search_trajet">
                {trajets.map((trajet) => (
                  <div className="trajet_s">
                    <div className="trajet_body">
                      <div className="trajet_info">
                        <div className="trajet_depart">
                          <span>{trajet.heure_depart}</span>
                          <span>{trajet.depart}</span>
                        </div>
                        <div className="trajet_destination">
                          <span>{trajet.heure_arrivee}</span>
                          <span>{trajet.destination}</span>
                        </div>
                      </div>
                      <div className="prix">{trajet.prix}€/prs</div>
                    </div>
                    <div className="footer">
                      <div className="duree">
                        <FontAwesomeIcon className="icon_hour" icon={faClock} />
                        <span>{trajet.duree}</span>
                      </div>
                      <div className="conducteur">
                        <img
                          src="img/photo-profil-default.png"
                          alt="Conducteur"
                        />
                        <span>{trajet.conducteur.prenom}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {/* <div className="trajet_s">
                  <div className="trajet_body">
                    <div className="trajet_info">
                      <div className="trajet_depart">
                        <span>00h00</span>
                        <span>Adresse de départ</span>
                      </div>
                      <div className="trajet_destination">
                        <span>02h00</span>
                        <span>Adresse d'arrivée</span>
                      </div>
                    </div>
                    <div className="prix">Gratuit</div>
                  </div>
                  <div className="footer">
                    <div className="duree">
                      <FontAwesomeIcon className="icon_hour" icon={faClock} />
                      <span>2h30</span>
                    </div>
                    <div className="conducteur">
                      <img
                        src="img/photo-profil-default.png"
                        alt="Conducteur"
                      />
                      <span>Defaut</span>
                    </div>
                  </div>
                </div> */}

                {/* <div className="trajet_s">
                  <div className="trajet_body">
                    <div className="trajet_info">
                      <div className="trajet_depart">
                        <span>00h00</span>
                        <span>Adresse de départ</span>
                      </div>
                      <div className="trajet_destination">
                        <span>02h00</span>
                        <span>Adresse d'arrivée</span>
                      </div>
                    </div>
                    <div className="prix">Gratuit</div>
                  </div>
                  <div className="footer">
                    <div className="duree">
                      <FontAwesomeIcon className="icon_hour" icon={faClock} />
                      <span>2h30</span>
                    </div>
                    <div className="conducteur">
                      <img
                        src="img/photo-profil-default.png"
                        alt="Conducteur"
                      />
                      <span>Defaut</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Rechercher;
