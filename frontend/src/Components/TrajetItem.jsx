import React from "react";
import { Link } from "react-router-dom";

const TrajetItem = ({
  trajetId,
  depart,
  destination,
  heure_depart,
  heure_arrivee,
}) => {
  return (
    <article className="trajet">
      <div className="trajet_thumbnail">
        <img src="/img/trajet_card.png" alt="Trajet" />
      </div>
      <div className="trajet_content">
          <h3>
            {depart} - {destination}
          </h3>
        <p>
          Départ: {heure_depart} | Arrivée: {heure_arrivee}
        </p>
        <div className="trajet_footer">
          {/* <Link to={`/trajet-details/${trajetId}`} className="btn category">
            Voir les détails
          </Link> */}

          <Link
            to={`/trajet-details/${trajetId}`}
            className="btn btn-primary btn-block"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
};

export default TrajetItem;
