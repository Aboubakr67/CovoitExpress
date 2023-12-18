import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
    // return (
    //     <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    //         <div className="container-fluid">
    //             <Link className="navbar-brand" to="/">
    //                 <img
    //                     src="/img/logo3.png"
    //                     width="170"
    //                     height="30"
    //                     className="d-inline-block align-top"
    //                     alt="Logo"
    //                 />
    //             </Link>
    //             <button
    //                 className="navbar-toggler"
    //                 type="button"
    //                 data-bs-toggle="collapse"
    //                 data-bs-target="#navbarColor01"
    //                 aria-controls="navbarColor01"
    //                 aria-expanded="false"
    //                 aria-label="Toggle navigation"
    //             >
    //                 <span className="navbar-toggler-icon"></span>
    //             </button>
    //             <div className="collapse navbar-collapse" id="navbarColor01">
    //                 <ul className="navbar-nav ms-auto">
    //                     <li className="nav-item">
    //                         <Link className="nav-link active" to="/">
    //                             Accueil
    //                             <span className="visually-hidden">(current)</span>
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/register">
    //                             Inscription
    //                         </Link>
    //                     </li>
    //                     <li className="nav-item">
    //                         <Link className="nav-link" to="/login">
    //                             Connexion
    //                         </Link>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </nav>
    // );


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-light fixed-top navbar-dark no-border-bottom">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
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
                            <Link className="nav-link text-black" to="/register">
                                Inscription
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/login">
                                Connexion
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );




};

export default NavigationBar;
