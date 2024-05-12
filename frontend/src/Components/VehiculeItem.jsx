import React from "react";
import { Link } from "react-router-dom";

const VehiculeItem = ({ vehicule }) => {
  //   return (
  //     <div className="card">
  //       <img
  //         src="/img/un_vehicule.jpg"
  //         className="card-img-top"
  //         alt={vehicule.marque + " " + vehicule.modele}
  //       />
  //       <div className="card-body">
  //         <h5 className="card-title">
  //           {vehicule.marque} - {vehicule.modele}
  //         </h5>
  //         <p className="card-text">Année: {vehicule.annee}</p>
  //         <Link to={`/vehicule/${vehicule._id}`} className="btn btn-primary">
  //           Voir détails
  //         </Link>
  //       </div>
  //     </div>
  //   );

  return (
    <article className="vehicule">
      <div className="vehicule_thumbnail">
        <img src="/img/un_vehicule.jpg" alt="Vehicule" />
      </div>
      <div className="vehicule_content">
        <h3>
          {vehicule.marque} - {vehicule.modele}
        </h3>
        <p className="card-text">Année: {vehicule.annee}</p>
        <div className="vehicule_footer">
          <Link
            to={`/vehicule-details/${vehicule._id}`}
            className="btn btn-primary btn-block"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </article>
  );
};

export default VehiculeItem;
