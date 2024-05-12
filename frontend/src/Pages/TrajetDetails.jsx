import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import SuccessMessage from "../Components/card/SuccessMessage";
import WarningCard from "../Components/card/WarningCard";
import TrajetForm from "../Components/Form/TrajetForm";

const TrajetDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const edited = localStorage.getItem("edited");

  const { currentUser } = useContext(UserContext);

  const [trajet, setTrajet] = useState();

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
        setTrajet(response.data.trajet);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteTrajet/${id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`, // token
          },
        }
      );

      const { deleted, message } = response.data;

      if (deleted) {
        localStorage.setItem("deleted", deleted);
        navigate("/mes-trajets");
      } else {
        setError(message);
      }

      setShowModal(false);
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
    <div className="container mt-5" style={{ marginTop: "100px" }}>
      <div className="row">
        <div className="col-md-8 offset-md-3">
          {showModal && (
            <WarningCard
              warningObject="Suppression du trajet"
              message="Etes-vous sûr de vouloir supprimer ce trajet ?"
              btn1="Supprimer"
              btn2="Fermer"
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          )}

          {trajet ? (
            <div className={`trajet_details ${showModal ? "show-modal" : ""}`}>
              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}
              {edited && <SuccessMessage message="Trajet modifier !" />}
              <img
                src="/img/trajet_card.png"
                className="card-img-top rounded"
                alt="Trajet"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {trajet.depart} - {trajet.destination}
                </h5>
                <p className="card-text">
                  Départ: {trajet.heure_depart} | Arrivée:{" "}
                  {trajet.heure_arrivee}
                </p>
                <p>Date: {trajet.date}</p>
                <p>Distance: {trajet.distance}</p>
                <p>Durée: {trajet.duree}</p>
                <p>Places disponibles: {trajet.placesDisponibles}</p>
                <p>Passager(s):</p>
                <ul>
                  {trajet.passagers.map((p) => (
                    <li key={p._id}>
                      {p.nom} {p.prenom}
                    </li>
                  ))}
                </ul>

                <p>
                  Véhicule : {trajet.vehicule_utilisee.marque}{" "}
                  {trajet.vehicule_utilisee.modele}
                </p>
                <div className="text-end">
                  <p>
                    {trajet.createdAt === trajet.updatedAt
                      ? `Créé le ${formatDate(trajet.createdAt)}`
                      : `Modifiée le ${formatDate(trajet.updatedAt)}`}
                  </p>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary btn-block mb-2">
                  {/* Edit */}
                  <Link
                    className="btn btn-primary btn-block mb-2"
                    to={`/trajet/${trajet._id}/edit`}
                  >
                    Edit
                  </Link>
                </button>
                <button
                  className="btn btn-danger btn-block"
                  onClick={() => setShowModal(true)}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <img
                src="/img/trajet_dont_find2.jpg"
                className="img-fluid"
                alt="Trajet non trouvé"
              />
              <p className="fw-bold">Aucun trajet trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrajetDetails;
