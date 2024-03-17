import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import RoomIcon from "@mui/icons-material/Room";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TrajetUser = () => {
  const { currentUser } = useContext(UserContext);
  const [trajets, setTrajets] = useState([]);

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

  // Fonction pour générer le lien Google Maps avec l'itinéraire entre le départ et la destination
  const generateGoogleMapsLink = (depart, arrivee) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      depart
    )}&destination=${encodeURIComponent(arrivee)}`;
  };

  return (
    // <div className="container" style={{ marginTop: "90px" }}>
    //   <div className="row">
        <div className="col-md-6">
          {trajets.length === 0 ? (
            <p>Vous n'avez créé aucun trajet</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Véhicule</th>
                  <th>Départ</th>
                  <th>Destination</th>
                  <th>Heure de départ</th>
                  <th>Heure d'arrivée</th>
                  <th>Distance</th>
                  <th>Durée</th>
                  <th>Lien</th>
                  <th>Action</th>
                  {/* <th>Consulter</th> */}
                </tr>
              </thead>
              <tbody>
                {trajets.map((trajet) => (
                  <tr key={trajet._id}>
                    <td>
                      {trajet.vehicule_utilisee.marque}{" "}
                      {trajet.vehicule_utilisee.modele}
                    </td>
                    <td>{trajet.depart}</td>
                    <td>{trajet.destination}</td>
                    <td>{trajet.heure_depart}</td>
                    <td>{trajet.heure_arrivee}</td>
                    <td>{trajet.distance}</td>
                    <td>{trajet.duree}</td>
                    <td>
                      <a
                        href={generateGoogleMapsLink(
                          trajet.depart,
                          trajet.destination
                        )}
                        target="_blank"
                      >
                        <RoomIcon />
                      </a>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-block mb-2">
                        Edit
                      </button>
                      <button className="btn btn-danger btn-block">
                        Delete
                      </button>
                    </td>
                    {/* <td>
                      <VisibilityIcon />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    //   </div>
    // </div>
  );
};

export default TrajetUser;
