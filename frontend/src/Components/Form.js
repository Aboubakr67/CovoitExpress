import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import First from "./First";
import Second from "./Second";
import Third from "./Third";


function Form() {

    const navigate = useNavigate();

    const [page, setPage] = useState(0);

    const [formData, setFormData] = useState({
        email: '',
        nom: '',
        prenom: '',
        dateNaissance: '',
        adresse: '',
        tel: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const pages = [First, Second, Third];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const errors = {};

        if (page === 0) {
            if (!formData.email || !formData.email.includes('@')) {
                errors.email = 'Veuillez entrer une adresse e-mail valide';
            }
        } else if (page === 1) {
            if (!formData.nom || formData.nom.length <= 1) {
                errors.nom = 'Veuillez entrer votre nom';
            }

            if (!formData.prenom || formData.prenom.length <= 1) {
                errors.prenom = 'Veuillez entrer votre prénom';
            }

            if (!formData.dateNaissance || formData.dateNaissance.length <= 1) {
                errors.dateNaissance = 'Veuillez entrer votre date de naissance';
            }

            if (!formData.adresse || formData.adresse.length <= 1) {
                errors.adresse = 'Veuillez entrer votre adresse';
            }

            if (!formData.tel || formData.tel.length <= 1) {
                errors.tel = 'Veuillez entrer votre numéro de téléphone';
            }
        } else if (page === 2) {
            if (!formData.password || formData.password.length <= 1) {
                errors.password = 'Veuillez entrer un mot de passe valide';
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
                return !!formData.nom && !!formData.prenom && !!formData.dateNaissance && !!formData.adresse && !!formData.tel;
            case 2:
                return !!formData.password;
            default:
                return false;
        }
    };

    const handleNext = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0 && isFormComplete()) {
            setPage(page + 1);
        } else {
            setErrors(validationErrors);
        }
    };

    const handlePrev = () => {
        setPage(page - 1);
        setErrors({});
    };

    const handleFormSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0 && isFormComplete()) {
            // Soumettre le formulaire
            console.log(formData);

            try {
                const { data } = await axios.post("http://localhost:4000/api/auth/register", {
                    ...formData,
                },
                    {
                        withCredentials: true,
                    },
                );
                console.log(data);

                if (data) {
                    if (data.errors) {
                        console.log(data.errors);
                        setErrors(data.errors);
                    } else {
                        // Réinitialise les erreurs du frontend s'il n'y a pas d'erreur
                        setErrors({});

                        // Stocker les données dans localStorage
                        localStorage.setItem('created', data.created);
                        navigate('/login');
                    }
                }

            } catch (error) {
                console.log(error);
            }


        } else {
            setErrors(validationErrors);
        }
    };

    const CurrentComponent = pages[page];

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    {<CurrentComponent formData={formData} handleChange={handleChange} errors={errors} />}
                    <div className="mt-4">
                        <button
                            className="btn btn-primary me-2"
                            onClick={page === 0 ? handleNext : page === pages.length - 1 ? handleFormSubmit : handleNext}
                        >
                            {page === pages.length - 1 ? 'Envoyer' : 'Suivant'}
                        </button>
                        {page > 0 && (
                            <button className="btn btn-secondary" onClick={handlePrev}>
                                Précédent
                            </button>
                        )}
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

export default Form;