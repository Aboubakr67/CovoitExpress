import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";

const VehiculeUser = () => {
  const { currentUser } = useContext(UserContext);
  const [vehicules, setVehicules] = useState([]);

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

  // return (
  //   <div className="container" style={{ marginTop: "90px" }}>
  //     <div className="row">
  //       <div className="col-md-12">
  //         <h2>Mes véhicule(s)</h2>
  //         {vehicules.length === 0 ? (
  //           <p>Aucun véhicule(s)</p>
  //         ) : (
  //           <ul>
  //             {vehicules.map((vehicule) => (
  //               <li key={vehicule._id}>
  //                 {vehicule.immatriculation} - {vehicule.marque} - {vehicule.modele} - {vehicule.annee}
  //               </li>
  //             ))}
  //           </ul>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    // <div className="container" style={{ marginTop: "90px" }}>
      // {/* <div className="row"> */}
        <div className="col-md-6">
          {vehicules.length === 0 ? (
            <p>Aucun véhicule(s)</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Immatriculation</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Année</th>
                  <th>Action</th>
                  {/* <th>Consulter</th> */}
                </tr>
              </thead>
              <tbody>
                {vehicules.map((vehicule) => (
                  <tr key={vehicule._id}>
                    <td>{vehicule.immatriculation}</td>
                    <td>{vehicule.marque}</td>
                    <td>{vehicule.modele}</td>
                    <td>{vehicule.annee}</td>
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
      // </div>
    // </div>
  );
};

export default VehiculeUser;
