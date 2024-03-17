import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import First from "./First";
import Second from "./Second";
import Third from "./Third";

function MultiStepForm() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    dateNaissance: "",
    adresse: "",
    tel: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const pages = [First, Second, Third];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberRegex = /^(06|07)\d{8}$/;
    return phoneNumberRegex.test(phoneNumber);
  };

  const validate = () => {
    const errors = {};

    if (page === 0) {
      if (!formData.email || !formData.email.includes("@")) {
        errors.email = "Veuillez entrer une adresse e-mail valide.";
      }
    } else if (page === 1) {
      if (!formData.nom || formData.nom.length < 1) {
        errors.nom = "Veuillez entrer votre nom.";
      } else if (!formData.nom || formData.nom.length < 2) {
        errors.nom = "Veuillez entrer un nom d'au moins 2 caractères.";
      }

      if (!formData.prenom || formData.prenom.length < 1) {
        errors.prenom = "Veuillez entrer votre prénom";
      } else if (!formData.prenom || formData.prenom.length < 2) {
        errors.prenom = "Veuillez entrer un prenom d'au moins 2 caractères.";
      }

      if (!formData.dateNaissance || formData.dateNaissance.length <= 1) {
        errors.dateNaissance = "Veuillez entrer votre date de naissance";
      }

      if (!formData.adresse || formData.adresse.length <= 1) {
        errors.adresse = "Veuillez entrer votre adresse";
      }

      if (!formData.tel || formData.tel.length < 1) {
        errors.tel = "Veuillez entrer votre numéro de téléphone.";
      } else if (
        !formData.tel ||
        formData.tel.length !== 10 ||
        !validatePhoneNumber(formData.tel)
      ) {
        errors.tel = "Veuillez entrer un numéro de téléphone valide.";
      }
    } else if (page === 2) {
      if (!formData.password || formData.password.length < 1) {
        errors.password = "Veuillez entrer un mot de passe valide";
      } else {
        // Vérification de la complexité du mot de passe
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(formData.password)) {
          errors.password =
            "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial";
        }

        if (formData.password != formData.confirmPassword) {
          errors.password = "Les mot de passe ne correspondent pas.";
        }
      }
    }

    return errors;
  };

  const isFormComplete = () => {
    // Vérifiez si toutes les données nécessaires sont remplies
    // ! A retenir :
    // Les deux points d'exclamation (!!) sont utilisés pour convertir la valeur en un booléen explicite.
    // Exemple :
    // - Si formData.password est une chaîne non vide (ou tout autre objet ou valeur "truthy"), !!formData.password devient true.
    // - Si formData.password est null, undefined, une chaîne vide, ou tout autre valeur "falsy", !!formData.password devient false.

    switch (page) {
      case 0:
        return !!formData.email;
      case 1:
        return (
          !!formData.nom &&
          !!formData.prenom &&
          !!formData.dateNaissance &&
          !!formData.adresse &&
          !!formData.tel
        );
      case 2:
        return !!formData.password && !!formData.confirmPassword;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const validationErrors = validate();

    // Utiliser la valeur retournée par checkUserExists uniquement si page === 0
    const exists = page === 0 ? await checkUserExists() : false;

    if (Object.keys(validationErrors).length === 0 && isFormComplete()) {
      if (!exists) {
        setPage(page + 1);
      }

      setErrors({
        validationErrors,
        existingUser: "Cet e-mail est déjà utilisé par un autre utilisateur.",
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const handlePrev = () => {
    setPage(page - 1);
    setErrors({});
  };

  const checkUserExists = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/checkUserExists",
        {
          email: formData.email,
        },
        {
          withCredentials: true,
        }
      );

      // Vérifier si l'utilisateur existe déjà lors de la validation du formulaire
      return data.exists;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    }
  };

  const handleFormSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0 && isFormComplete()) {
      // Soumettre le formulaire
      console.log(formData);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          formData
        );
        const newUser = await response.data;
        console.log(newUser);
        if (!newUser) {
          setErrors(
            "Impossible d'enregistrer l'utilisateur. Veuillez réessayer."
          );
        }

        // Stocker les données dans localStorage
        localStorage.setItem("created", response.data.created);
        navigate("/login");

        // const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        //     ...formData,
        // },
        //     {
        //         withCredentials: true,
        //     },
        // );

        // if (data) {
        //   if (data.errors) {
        //     console.log(data.errors);
        //     setErrors(data.errors);
        //   } else {
        //     // Réinitialise les erreurs du frontend s'il n'y a pas d'erreur
        //     setErrors({});

        //     // Stocker les données dans localStorage
        //     localStorage.setItem("created", data.created);
        //     navigate("/login");
        //   }
        // }
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrors(validationErrors);
      console.log(formData.password);
      console.log(validationErrors.password);
      console.log(validationErrors);
    }
  };

  const CurrentComponent = pages[page];

  return (
    <div style={{ marginTop: "90px" }}>
      <div className="row">
        {/* Colonne de gauche avec l'image */}
        <div className="col-md-6">
          <img
            src="/img/covoit_express_inscription.jpg"
            alt="Logo"
            className="img-fluid"
          />
        </div>

        {/* Colonne de droite avec le formulaire */}
        <div className="col-md-6">
          <div className="card-body">
            {
              <CurrentComponent
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            }
            <div className="mt-4">
              <button
                className="btn btn-primary me-2"
                onClick={
                  page === 0
                    ? handleNext
                    : page === pages.length - 1
                    ? handleFormSubmit
                    : handleNext
                }
              >
                {page === pages.length - 1 ? "Envoyer" : "Suivant"}
              </button>
              {page > 0 && (
                <button className="btn btn-secondary" onClick={handlePrev}>
                  Précédent
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span>
          Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </span>
      </div>
    </div>
  );
}

export default MultiStepForm;
