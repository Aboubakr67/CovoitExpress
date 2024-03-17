import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessMessage from "../Components/card/SuccessMessage";

import { UserContext } from "../context/userContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const created = localStorage.getItem("created");

  const handleChange = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const user = await response.data;
      setCurrentUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    const cleanup = () => {
      // Supprimer les données de localStorage lors de la fermeture de la page
      localStorage.removeItem("created");
    };

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  return (
    <div style={{ marginTop: "90px" }}>
      <div className="d-flex justify-content-center align-items-center">
        {created && (
          <SuccessMessage message={"Félicitations, votre compte a été créé!"} />
        )}
      </div>

      <div className="row">
        {/* Colonne de gauche avec l'image */}
        <div className="col-md-6">
          <img
            src="/img/covoit_express_connexion.jpg"
            alt="Logo"
            className="img-fluid"
          />
        </div>

        {/* Colonne de droite avec le formulaire */}
        <div className="col-md-6">
          <div className="card-body">
            <h2>Connectez-vous</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
              {error && (
                <p className="alert alert-danger text-center">{error}</p>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  placeholder="Votre E-mail"
                  onChange={handleChange}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  placeholder="Votre mot de passe"
                  onChange={handleChange}
                />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" type="submit">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <span>
          Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
