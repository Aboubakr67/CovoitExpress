function First({ formData, handleChange, errors }) {

    return (
        <div>
            <h2>Votre adresse e-mail ?</h2>
            <div className="mb-3">
                <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''} w-100`} placeholder="E-mail" value={formData.email} onChange={handleChange} required />
                {errors.email && <p className="error">{errors.email}</p>}
            </div>
        </div>
    )
}

export default First;