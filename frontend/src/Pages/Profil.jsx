import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="container" style={{ marginTop: "110px" }}>
      <div className="row">
        <div className="col-md-12">
          <h1>Profil</h1>
          <p>Nom : {currentUser?.nom}</p>
          <p>Prenom : {currentUser?.prenom}</p>
        </div>
      </div>
    </div>
  );
};

export default Profil;
