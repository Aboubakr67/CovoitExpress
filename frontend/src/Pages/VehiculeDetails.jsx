import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuccessMessage from "../Components/card/SuccessMessage";
import WarningCard from "../Components/card/WarningCard";

const VehiculeDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const edited = localStorage.getItem("edited");

  const { currentUser } = useContext(UserContext);

  const [vehicule, setVehicule] = useState();

  const [showModal, setShowModal] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const cleanup = () => {
      // Supprimer les données de localStorage lors de la fermeture de la page
      localStorage.removeItem("edited");
    };

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

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

  const handleDelete = async () => {
    // onDelete(trajet._id);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteVehicule/${id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // token
          },
        }
      );

      const { deleted, message } = response.data;

      if (deleted) {
        localStorage.setItem("deleted", deleted);
        navigate("/mes-vehicules");
      } else {
        setError(message);
      }

      setShowModal(false);

      //   console.log("vehicule supprimerrr");
    } catch (error) {
      console.log(error);
    }

    setShowModal(false);
  };

  // Fonction utilitaire pour formater la date
  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("fr-FR", options);
  };

  return (
    <div className="container_v mt-5" style={{ marginTop: "100px" }}>
      <div className="row">
        <div className="col-md-8 offset-md-3">
          {showModal && (
            <WarningCard
              warningObject="Suppression du véhicule"
              message="Etes-vous sûr de vouloir supprimer ce véhicule ?"
              btn1="Supprimer"
              btn2="Fermer"
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          )}

          {vehicule ? (
            <div className="vehicule_details">
              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}
              {edited && <SuccessMessage message="Véhicule modifié !" />}
              <img
                src={`/img/un_vehicule.jpg`} // Assurez-vous que le nom du fichier image correspond au modèle du véhicule
                className="card-img-top rounded"
                alt={vehicule.marque + " " + vehicule.modele}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {vehicule.marque} - {vehicule.modele}
                </h5>
                <p className="card-text">Année: {vehicule.annee}</p>
                <p>Couleur: {vehicule.couleur}</p>
                <p>Immatriculation: {vehicule.immatriculation}</p>
                <div className="text-end">
                  {/* <p>Créé le {formatDate(vehicule.createdAt)}</p>
                  <p>Créé le {formatDate(vehicule.updatedAt)}</p> */}
                  <p>
                    {vehicule.createdAt === vehicule.updatedAt
                      ? `Créé le ${formatDate(vehicule.createdAt)}`
                      : `Modifiée le ${formatDate(vehicule.updatedAt)}`}
                  </p>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary btn-block mb-2">
                  <Link
                    className="btn btn-primary btn-block mb-2"
                    to={`/vehicule/${vehicule._id}/edit`}
                  >
                    Modifier
                  </Link>
                </button>
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => setShowModal(true)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <img
                src="/img/vehicule_dont_find.jpg" // Assurez-vous que l'image existe et est accessible
                className="img-fluid"
                alt="Véhicule non trouvé"
              />
              <p className="fw-bold">Aucun véhicule trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetails;
