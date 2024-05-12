import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import IndicationPassword from "../Components/card/IndicationPassword";

const EditPassword = () => {
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const [user, setUser] = useState();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  //redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/getUser/${currentUser?.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`, // token
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      getUser();
    }

    return () => {};
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword.length < 8 ||
      formData.confirmPassword.length < 8
    ) {
      setError("Les mot de passe doivent contenir au moins 8 caractères");
    } else {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
      } else {
        try {
          await axios.put(
            `http://localhost:5000/api/editPassword/${currentUser?.id}`,
            { newPassword: formData.newPassword },
            {
              headers: {
                Authorization: `Bearer ${currentUser?.token}`,
              },
            }
          );
          setError("");

          localStorage.setItem("editpassword", true);
          navigate("/profil");

          console.log("Mot de passe modifiée avec succès !");
        } catch (error) {
          console.log("Erreur lors du changement de mot de passe :", error);
          setError(
            "Une erreur s'est produite lors de la modification du mot de passe."
          );
        }
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: "110px" }}>
      <div className="row">
        {/* Colonne pour l'image */}
        <div className="col-md-6">
          <img
            src="/img/reset-password.jpg"
            alt="Image de profil"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        {/* Colonne pour le formulaire */}
        <div className="col-md-6">
          <div className="text-center mb-4">
            <h2>Changer mon mot de passe</h2>
          </div>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                className={`form-control ${error ? "is-invalid" : ""} w-100`}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            {/* Case à cocher pour afficher/masquer le mot de passe */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="showPasswordCheckbox"
                onChange={toggleNewPasswordVisibility}
              />
              <label
                className="form-check-label"
                htmlFor="showPasswordCheckbox"
              >
                Afficher le mot de passe
              </label>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className={`form-control ${error ? "is-invalid" : ""} w-100`}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            {/* Case à cocher pour afficher/masquer le mot de passe */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="showConfirmPasswordCheckbox"
                onChange={toggleConfirmPasswordVisibility}
              />
              <label
                className="form-check-label"
                htmlFor="showConfirmPasswordCheckbox"
              >
                Afficher la confirmation du mot de passe
              </label>
            </div>

            <IndicationPassword />

            <button type="submit" className="btn btn-primary">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
