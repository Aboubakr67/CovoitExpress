import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import VehiculeForm from "../Components/Form/VehiculeForm";
import VehiculeUser from "../Components/VehiculeUser";

const Vehicule = () => {
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
    <div>
      <VehiculeForm />
    </div>
  );
};

export default Vehicule;
