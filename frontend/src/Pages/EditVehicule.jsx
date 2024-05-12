import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditVehicule = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    annee: "",
    couleur: "",
    immatriculation: "",
  });

  const [modifiedData, setModifiedData] = useState({});

  const [vehicule, setVehicule] = useState();

  const [error, setError] = useState("");

  useEffect(() => {
    const getVehicule = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getVehicule/${id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        setVehicule(response.data.vehicule);

        // Mettre à jour les valeurs dans formData avec les données du véhicule
        setFormData({
          ...formData,
          marque: response.data.vehicule.marque,
          modele: response.data.vehicule.modele,
          annee: response.data.vehicule.annee,
          couleur: response.data.vehicule.couleur,
          immatriculation: response.data.vehicule.immatriculation,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      getVehicule();
    }

    return () => {
      //   Cleanup function
      //   Ajoutez ici le code de nettoyage si nécessaire
    };
  }, []);

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

      // Vérifier si des modifications ont été apportées
      const isModified = Object.keys(modifiedData).length > 0;

      if (!isModified) {
        setError("Aucune modification détectée.");
        return;
      }

      try {
        const response = await axios.patch(
          `http://localhost:5000/api/editVehicule/${id}`,
          { ...formData },
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        const edited = await response.data.edited;
        if (!edited) {
          setError(
            "Erreur dans la modification du vehicule. Veuillez réessayer."
          );
        }

        setError("");
        // Stocker les données dans localStorage
        localStorage.setItem("edited", edited);

        setFormData({
          marque: "",
          modele: "",
          annee: "",
          couleur: "",
          immatriculation: "",
        });

        navigate(`/vehicule-details/${vehicule._id}`);
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
            <h2>Modification du vehicule</h2>
            <div className="d-flex justify-content-center align-items-center"></div>
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
                Modifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehicule;
