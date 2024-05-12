import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRoute,
  faCar,
  faRightFromBracket,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import Logout from "../Pages/Logout";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";

const Header = () => {
  const { currentUser } = useContext(UserContext);

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

        {currentUser?.id ? (
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link text-black" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/rechercher">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ fontSize: "15px" }}
                  />
                  Rechercher
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/create-trajet">
                  <AddCircleRoundedIcon /> Publier un trajet
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/create-vehicule">
                  <DirectionsCarFilledRoundedIcon /> Créer un véhicule
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
                  {currentUser?.nom} {currentUser?.prenom}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/mes-trajets">
                      <FontAwesomeIcon icon={faRoute} /> Mes trajets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mes-vehicules">
                      <FontAwesomeIcon icon={faCar} />
                      Mes vehicules
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profil">
                      <FontAwesomeIcon icon={faUser} />
                      Profil
                    </Link>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/logout"
                      onClick={<Logout />}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Déconnexion
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        ) : (
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
        )}
      </div>
    </nav>
  );
};

export default Header;
