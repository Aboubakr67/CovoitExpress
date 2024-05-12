import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="container-fluid landing-page">
      <div className="row">
        {/* Colonne de gauche avec CovoitExpress */}
        <div className="col-md-4 d-flex align-items-center justify-content-center text-center">
          <div>
            <h1
              className="fw-bold display-6"
              style={{ fontFamily: "Josefin Sans, sans-serif" }}
            >
              Covoit Express
            </h1>
            <p
              className="mb-4 text-dark"
              style={{
                fontFamily: "Nova Square, sans-serif",
                marginTop: "30px",
              }}
            >
              Explorez de nouvelles perspectives de mobilité avec CovoitExpress,
              la plateforme de covoiturage qui rapproche les conducteurs et les
              passagers pour des trajets partagés, écolos et économiques
            </p>
            {/* <button className="btn btn-primary btn-lg rounded-circle custom-button" style={{ color: 'black', backgroundColor: '#ee7942', fontFamily: 'Open Sans, sans-serif', fontWeight: 700 }} >Trouver un trajet</button> */}

            <Link to="/register" className="text-white">
              <button className="cssbuttons-io-button" href="/register">
                Commencer
                <div className="icon">
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </button>
            </Link>
          </div>
        </div>
        {/* Colonne de droite avec l'image */}
        <div className="col-md-8">
          <img
            src="/img/covoit_express_accueil_2.jpg"
            alt="CovoitExpress Image"
            className="img-fluid"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
