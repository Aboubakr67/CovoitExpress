function Second({ formData, handleChange, errors }) {


    return (
        <div>
            <h2>Vos informations ?</h2>
            <div className="mb-3">
                <input
                    type="text"
                    name="nom"
                    className={`form-control ${errors.nom ? 'is-invalid' : ''} w-100`}
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                />
                {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="prenom"
                    className={`form-control ${errors.prenom ? 'is-invalid' : ''} w-100`}
                    placeholder="Votre prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                />
                {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
            </div>
            <div className="mb-3">
                <input
                    type="date"
                    name="dateNaissance"
                    className={`form-control ${errors.dateNaissance ? 'is-invalid' : ''} w-100`}
                    placeholder="Votre date de naissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    required
                />
                {errors.dateNaissance && <div className="invalid-feedback">{errors.dateNaissance}</div>}
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="adresse"
                    className={`form-control ${errors.adresse ? 'is-invalid' : ''} w-100`}
                    placeholder="Votre adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    required
                />
                {errors.adresse && <div className="invalid-feedback">{errors.adresse}</div>}
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    name="tel"
                    className={`form-control ${errors.tel ? 'is-invalid' : ''} w-100`}
                    placeholder="Votre tel"
                    value={formData.tel}
                    onChange={handleChange}
                    required
                />
                {errors.tel && <div className="invalid-feedback">{errors.tel}</div>}
            </div>
        </div>
    );
}

export default Second;