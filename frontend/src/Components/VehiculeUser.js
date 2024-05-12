import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import VehiculeItem from "./VehiculeItem";
import SuccessMessage from "./card/SuccessMessage";

const VehiculeUser = () => {
  const { currentUser } = useContext(UserContext);
  const [vehicules, setVehicules] = useState([]);

  const deleted = localStorage.getItem("deleted");

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

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getVehicules/${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        setVehicules(response.data.vehicules);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      fetchVehicules();
    }

    return () => {
      //   Cleanup function
      //   Ajoutez ici le code de nettoyage si nécessaire
    };
  }, []);

  return (
    <section className="vehicules">
      {deleted && <SuccessMessage message="Véhicule supprimer !" />}
      {vehicules.length > 0 ? (
        <div className="container_v vehicule_container">
          {vehicules.map((vehicule) => (
            <VehiculeItem key={vehicule._id} vehicule={vehicule} />
          ))}
        </div>
      ) : (
        <h2 className="center">Aucun véhicule</h2>
      )}
    </section>
  );
};

export default VehiculeUser;
