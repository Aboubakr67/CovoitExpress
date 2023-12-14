import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import NavigationBar from "../Components/nav/NavigationBar";

function Login() {

    const navigate = useNavigate();

    const created = localStorage.getItem("created");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // console.log(e.target.value);
    }

    const validate = () => {
        const errors = {};


        if (!formData.email || !formData.email.includes('@')) {
            errors.email = 'Veuillez entrer une adresse e-mail valide';
        }
        else if (!formData.password || formData.password.length <= 1) {
            errors.password = 'Veuillez entrer un mot de passe valide';
        }

        return errors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            // Soumettre le formulaire
            console.log(formData);

            try {
                const { data } = await axios.post("http://localhost:4000/api/auth/login", {
                    ...formData,
                }, {
                    withCredentials: true,
                }
                );

                if (data) {
                    if (data.errors) {
                        console.log(data.errors);
                        // const { email, password } = data.errors;
                        setErrors(data.errors);
                    } else {
                        setErrors({});
                        navigate('/');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            setErrors(validationErrors);
        }
    }




    useEffect(() => {
        const cleanup = () => {
            // Supprimer les données de localStorage lors de la fermeture de la page
            localStorage.removeItem('created');
        };

        // Attacher un gestionnaire d'événements à l'événement beforeunload
        window.addEventListener('beforeunload', cleanup);

        // Nettoyer lors du démontage du composant
        return () => {
            window.removeEventListener('beforeunload', cleanup);
        };
    }, []);


    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    {created && (
                        <div className="success-message">
                            Félicitations, votre compte a été créé!
                        </div>
                    )}
                    <h2>Connectez-vous</h2>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="Votre E-mail"
                                onChange={handleChange}
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Votre mot de passe"
                                onChange={handleChange}
                            />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button className="btn btn-primary" type="submit">
                                Envoyer
                            </button>
                        </div>
                    </form>
                    <div className="mt-3 text-center">
                        <span>
                            Vous n'avez pas de compte ? <Link to="/register">Inscrivez-vous</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;