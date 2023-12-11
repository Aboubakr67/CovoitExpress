import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

function Login() {

    const navigate = useNavigate();

    const created = localStorage.getItem("created");

    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const generateError = (err) => {
        toast.error(err, {
            position: "bottom-right",
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:4000/api/auth/login", {
                ...values,
            }, {
                withCredentials: true,
            }
            );

            if (data) {
                if (data.errors) {
                    console.log(data.errors);
                    const { email, password } = data.errors;
                    if (email) generateError(email);
                    else if (password) generateError(password);
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.log(error);
        }

    }


    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        // console.log(e.target.value);
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
        <div className="container">
            {created && (
                <div className="success-message">
                    Félicitations, votre compte a été créé!
                </div>
            )}
            <h2>Login Account</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
                <span>
                    If you don't have an account? <Link to="/register">Register</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login;