import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

import TrajetUser from "../Components/TrajetUser";
import SuccessMessage from "../Components/card/SuccessMessage";

const MyTrajet = () => {
  const navigate = useNavigate();

  const edited = localStorage.getItem("edited");
  const deleted = localStorage.getItem("deleted");

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const cleanup = () => {
      // Supprimer les données de localStorage lors de la fermeture de la page
      localStorage.removeItem("edited");
      localStorage.removeItem("deleted");
    };

    localStorage.removeItem("edited");
    localStorage.removeItem("deleted");

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return <TrajetUser />;
};

export default MyTrajet;
