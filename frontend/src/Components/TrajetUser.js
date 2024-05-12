import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import RoomIcon from "@mui/icons-material/Room";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import TrajetItem from "./TrajetItem";
import SuccessMessage from "./card/SuccessMessage";

const TrajetUser = () => {
  const { currentUser } = useContext(UserContext);
  const [trajets, setTrajets] = useState([]);

  const deleted = localStorage.getItem("deleted");

  useEffect(() => {
    const fetchTrajets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getTrajets/${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        setTrajets(response.data.trajets);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      fetchTrajets();
    }

    return () => {
      //   Cleanup function
      //   Ajoutez ici le code de nettoyage si nécessaire
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      localStorage.removeItem("deleted");
    };

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  // Fonction pour générer le lien Google Maps avec l'itinéraire entre le départ et la destination
  const generateGoogleMapsLink = (depart, arrivee) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      depart
    )}&destination=${encodeURIComponent(arrivee)}`;
  };

  return (
    <section className="trajets">
      {deleted && <SuccessMessage message="Trajet supprimer !" />}
      {trajets.length > 0 ? (
        <div className="container_t trajets_container">
          {trajets.map((trajet) => (
            <TrajetItem
              key={trajet._id}
              trajetId={trajet._id}
              depart={trajet.depart}
              destination={trajet.destination}
              heure_depart={trajet.heure_depart}
              heure_arrivee={trajet.heure_arrivee}
              trajet_createdAt={trajet.createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No trajets founds</h2>
      )}
    </section>
  );
};

export default TrajetUser;
