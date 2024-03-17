import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../card/SuccessMessage";

const VehiculeForm = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const created = localStorage.getItem("created");

  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    annee: "",
    couleur: "",
    immatriculation: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const cleanup = () => {
      // Supprimer les données de localStorage lors de la fermeture de la page
      localStorage.removeItem("created");
    };

    localStorage.removeItem("created");

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtenir l'année actuelle
    const currentYear = new Date().getFullYear();

    // Vérifier que tous les champs sont remplis
    if (
      !formData.marque ||
      !formData.modele ||
      !formData.annee ||
      !formData.couleur ||
      !formData.immatriculation
    ) {
      setError("Veuillez remplir tous les champs du formulaire.");
    } else if (
      !/^\d{4}$/.test(formData.annee) // Vérifier le format YYYY
    ) {
      setError("L'année doit être au format 'YYYY'.");
    } else if (parseInt(formData.annee) < 1980) {
      // Vérifier si l'année est inférieure à 1980
      setError("Veuillez saisir une année supérieure à 1980.");
    } else if (parseInt(formData.annee) > currentYear) {
      setError(
        "Veuillez saisir une année inférieure ou égale à l'année actuel."
      );
    } else {
      //   console.log(formData);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/createAndAddVehiculeToUser",
          { ...formData, userId: currentUser.id },
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        const vehicule = await response.data;
        if (!vehicule) {
          setError("Impossible d'enregistrer le vehicule. Veuillez réessayer.");
        }

        setError("");
        // Stocker les données dans localStorage
        localStorage.setItem("created", response.data.created);

        setFormData({
          marque: "",
          modele: "",
          annee: "",
          couleur: "",
          immatriculation: "",
        });

        navigate("/vehicule");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: "90px" }}>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <h2>Ajout d'un vehicule</h2>
            <div className="d-flex justify-content-center align-items-center">
              {created && <SuccessMessage message="Véhicule créer !" />}
            </div>
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            <div className="mb-3">
              <label htmlFor="marque" className="form-label">
                Marque
              </label>
              <input
                type="text"
                name="marque"
                className={`form-control`}
                placeholder="Marque"
                value={formData.marque}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="modele" className="form-label">
                Modele
              </label>
              <input
                type="text"
                name="modele"
                className={`form-control`}
                placeholder="Modele"
                value={formData.modele}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="annee" className="form-label">
                Annee
              </label>
              <input
                type="text"
                name="annee"
                className={`form-control`}
                placeholder="Annee"
                value={formData.annee}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="couleur" className="form-label">
                Couleur
              </label>
              <input
                type="text"
                name="couleur"
                className={`form-control`}
                placeholder="Couleur"
                value={formData.couleur}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="immatriculation" className="form-label">
                Immatriculation
              </label>
              <input
                type="text"
                name="immatriculation"
                className={`form-control`}
                placeholder="Immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-primary" type="submit">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehiculeForm;
