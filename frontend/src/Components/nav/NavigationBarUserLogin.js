import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const NavigationBarUserLogin = ({ user, logOut }) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-light fixed-top navbar-dark no-border-bottom">
            <div className="container-fluid">
                <Link className="navbar-brand" to="">
                    <img
                        src="/img/logo4.png"
                        width="170"
                        height="30"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarColor01"
                    aria-controls="navbarColor01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link active text-black" to="/">
                                Accueil
                                <span className="visually-hidden">(current)</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/trajet">
                                Trajet
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/vehicule">
                                Véhicule
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle text-black"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                {user.nom}
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <Link className="dropdown-item" to="/profil">
                                        Profil
                                    </Link>
                                </li>
                                <li>
                                    <div className="dropdown-divider"></div>
                                </li>
                                <li>
                                    <Link className="dropdown-item" to="/deconnexion" onClick={logOut}>
                                        Déconnexion
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );


};

export default NavigationBarUserLogin;
