import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import VehiculeUser from "../Components/VehiculeUser";

const MyVehicule = () => {
  const navigate = useNavigate();


  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);



  // return (
  //   <div className="container-fluid" style={{ marginTop: "90px" }}>
  //     {edited && <SuccessMessage message="Véhicule modifier avec succès !" />}
  //     <div className="row">
  //       <div className="col-md-5">
  //         <div className="card">
  //           <div className="card-header bg-success text-white">
  //             <h3 className="card-title">Mes Véhicules</h3>
  //           </div>
  //           <div className="card-body">
  //             <VehiculeUser />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return <VehiculeUser />;
};

export default MyVehicule;
