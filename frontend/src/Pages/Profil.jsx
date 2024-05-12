import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessMessage from "../Components/card/SuccessMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const Profil = () => {
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const edited = localStorage.getItem("edited");
  const edit_password = localStorage.getItem("editpassword");
  const a = true;

  const [user, setUser] = useState();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    dateNaissance: "",
    adresse: "",
    tel: "",
  });

  const [modifiedData, setModifiedData] = useState({});

  const [error, setError] = useState("");

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

        const userData = response.data.user;

        // Mettre à jour les valeurs dans formData avec les données de l'utilisateur
        setFormData({
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          dateNaissance: userData.dateNaissance,
          adresse: userData.adresse,
          tel: userData.tel,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      getUser();
    }

    return () => {
      //   Cleanup function
      //   Ajoutez ici le code de nettoyage si nécessaire
    };
  }, []);

  useEffect(() => {
    const cleanup = () => {
      // Supprimer les données de localStorage lors de la fermeture de la page
      localStorage.removeItem("edited");
      localStorage.removeItem("editpassword");
    };

    // localStorage.removeItem("edited");
    // localStorage.removeItem("editpassword");

    // Attacher un gestionnaire d'événements à l'événement beforeunload
    window.addEventListener("beforeunload", cleanup);

    // Nettoyer lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setModifiedData({
      // Mettre à jour modifiedData avec les nouvelles valeurs
      ...modifiedData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si des modifications ont été apportées
    const isModified = Object.keys(modifiedData).length > 0;

    if (!isModified) {
      setError("Aucune modification détectée.");
      return;
    }

    console.log(modifiedData);

    try {
      // Envoi des données modifiées à l'API
      await axios.put(
        `http://localhost:5000/api/editUser/${currentUser?.id}`,
        modifiedData,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      setError(""); // Réinitialiser l'erreur

      // Récupérer les données actuelles du localStorage
      const userData = JSON.parse(localStorage.getItem("user"));

      // Mettre à jour les données du nom si modifiedData contient une modification pour le nom
      if (modifiedData.nom != null) {
        userData.nom = modifiedData.nom;
      }

      // Mettre à jour les données du prenom si modifiedData contient une modification pour le prenom
      if (modifiedData.prenom != null) {
        userData.prenom = modifiedData.prenom;
      }

      // Mettre à jour le localStorage avec les nouvelles données fusionnées
      localStorage.setItem("user", JSON.stringify(userData));

      // Mettre à jour le context avec les nouvelles données fusionnées
      setCurrentUser(userData);

      localStorage.setItem("edited", true);

      console.log("Données modifiées envoyées avec succès !");
    } catch (error) {
      console.log("Erreur lors de l'envoi des données modifiées :", error);
      setError("Une erreur s'est produite lors de la modification.");
    }
  };

  return (
    <div className="container" style={{ marginTop: "110px" }}>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={handleSubmit}>
            <h2 className="text-center">Profil</h2>

            <div className="d-flex justify-content-center">
              <img
                src="/img/photo-profil-default.png"
                alt="Image de profil"
                style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              />
            </div>

            <div className="d-flex justify-content-center align-items-center">
              {edited && <SuccessMessage message="Profil modifié !" />}
            </div>

            <div className="d-flex justify-content-center align-items-center">
              {edit_password && (
                <SuccessMessage message="Mot de passe modifié avec succès !" />
              )}
            </div>
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            {/* <div className="alert alert-danger text-center">aaaa</div> */}
            <div className="mb-3">
              <label htmlFor="nom" className="form-label">
                Nom
              </label>
              <input
                type="text"
                name="nom"
                className={`form-control`}
                placeholder="Nom"
                value={formData.nom}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="prenom" className="form-label">
                Prenom
              </label>
              <input
                type="text"
                name="prenom"
                className={`form-control`}
                placeholder="Prenom"
                value={formData.prenom}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                name="email"
                className={`form-control`}
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateNaissance" className="form-label">
                Date de naissance
              </label>
              <input
                type="date"
                name="dateNaissance"
                className={`form-control`}
                placeholder="Date de naissance"
                value={formData.dateNaissance}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="adresse" className="form-label">
                Adresse
              </label>
              <input
                type="text"
                name="adresse"
                className={`form-control`}
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                Tel
              </label>
              <input
                type="tel"
                name="tel"
                className={`form-control`}
                placeholder="Tel"
                value={formData.tel}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-primary" type="submit">
                Modifier
              </button>
            </div>
            <div className="mb-5 text-center" style={{ marginTop: "20px" }}>
              <Link to="/change-password">
                <FontAwesomeIcon icon={faLock} />
                Modifier votre mot de passe
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profil;
