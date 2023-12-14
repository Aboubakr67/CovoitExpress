function Third({ formData, handleChange, errors }) {

    return (
        <div>
            <h2>Votre mot de passe ?</h2>
            <div className="mb-3">
                <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''} w-100`}
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
        </div>
    );
}

export default Third;