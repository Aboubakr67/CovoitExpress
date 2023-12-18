function First({ formData, handleChange, errors }) {

    return (
        <div>
            <h2>Votre adresse e-mail ?</h2>
            <div className="mb-3">
                <input type="email" name="email" className={`form-control ${errors.email || errors.existingUser ? 'is-invalid' : ''} w-100`} placeholder="E-mail" value={formData.email} onChange={handleChange} onBlur={errors.existingUser ? () => { } : null} required />

                {errors.email && <p className="invalid-feedback">{errors.email}</p>}
                {errors.existingUser && <p className="invalid-feedback">{errors.existingUser}</p>}
            </div>
        </div>
    )
}

export default First;