import React, { useState } from 'react';
import IndicationPassword from "./card/IndicationPassword";



function Third({ formData, handleChange, errors }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    console.log(errors.password);

    return (
        <div>
            <h2>Votre mot de passe ?</h2>
            <div className="mb-3">
                <div className="password-input-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''} w-100`}
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {errors.password &&
                        <div className="invalid-feedback">{errors.password}</div>
                    }
                </div>
            </div>

            {/* Case à cocher pour afficher/masquer le mot de passe */}
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPasswordCheckbox"
                    onChange={togglePasswordVisibility}
                />
                <label className="form-check-label" htmlFor="showPasswordCheckbox">
                    Afficher le mot de passe
                </label>
            </div>
            
            <IndicationPassword></IndicationPassword>

        </div>
    );


}

export default Third;
