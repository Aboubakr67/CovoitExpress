import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function Register() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        dateNaissance: "",
        adresse: "",
        tel: "",
    });


    const generateError = (err) => {
        toast.error(err, {
            position: "bottom-right",
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:4000/api/auth/register", {
                ...values,
            },
                {
                    withCredentials: true,
                },
            );
            console.log(data);

            if (data) {
                if (data.errors) {
                    console.log(data.errors);
                    // Parcourir les propriétés de data.errors
                    Object.keys(data.errors).forEach((fieldName) => {
                        generateError(data.errors[fieldName]);
                    });

                } else {
                    // Stocker les données dans localStorage
                    localStorage.setItem('created', data.created);
                    navigate('/login', () => {

                    });
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

    return (
        <div className="container">
            <h2>Register Account</h2>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div>
                    <label htmlFor="nom">Nom</label>
                    <input type="text" name="nom" placeholder="Nom" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="prenom">Prenom</label>
                    <input type="text" name="prenom" placeholder="Prenom" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="dateNaissance">Date de naissance</label>
                    <input type="date" name="dateNaissance" placeholder="Date de naissance" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="adresse">Adresse</label>
                    <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="tel">Tel</label>
                    <input type="text" name="tel" placeholder="Téléphone" onChange={handleChange} />
                </div>
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
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Register;