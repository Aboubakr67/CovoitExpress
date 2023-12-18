import React, { useState } from 'react';

const TrajetSearch = () => {
    const [depart, setDepart] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [nbPassagers, setNbPassagers] = useState('');

    const handleSearch = () => {
        // Mettez ici la logique de recherche avec les valeurs de depart, destination, date et nbPassagers
        console.log('Recherche de trajet avec les valeurs :', depart, destination, date, nbPassagers);
    };

    return (
        // <div className="container-fluid">

        <div className="row">
            {/* Colonne de gauche avec l'image */}
            <div className="col-md-6">
                <img
                    src="/img/covoit_express_accueil.jpg"
                    alt="Image"
                    className="img-fluid"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>


            <h2>Recherche de Trajet</h2>
            <form className="d-flex flex-row">
                <div className="mb-3 me-2">
                    <label htmlFor="depart" className="form-label">
                        Départ
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="depart"
                        value={depart}
                        onChange={(e) => setDepart(e.target.value)}
                    />
                </div>
                <div className="mb-3 me-2">
                    <label htmlFor="destination" className="form-label">
                        Destination
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
                <div className="mb-3 me-2">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-3 me-2">
                    <label htmlFor="nbPassagers" className="form-label">
                        Nombre de passagers
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="nbPassagers"
                        value={nbPassagers}
                        onChange={(e) => setNbPassagers(e.target.value)}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleSearch}>
                    Recherche
                </button>
            </form>
        </div>
        // </div>
    );
};

export default TrajetSearch;
