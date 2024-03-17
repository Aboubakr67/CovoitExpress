import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import TrajetForm from "../Components/Form/TrajetForm";
import VehiculeUser from "../Components/VehiculeUser";
import TrajetUser from "../Components/TrajetUser";

const Dashboard = () => {
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
  //   <div className="container" style={{ marginTop: "110px" }}>
  //     <div className="row">
  //       <div className="col-md-12">
  //         <h1>Bienvenu sur le dashboard</h1>
  //       </div>
  //       <TrajetUser/>
  //       <VehiculeUser />
  //     </div>
  //   </div>
  // );

  return (
    <div className="container-fluid" style={{ marginTop: "90px" }}>
      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title">Mes Trajets</h3>
            </div>
            <div className="card-body">
              <TrajetUser />
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3 className="card-title">Mes Véhicules</h3>
            </div>
            <div className="card-body">
              <VehiculeUser />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
