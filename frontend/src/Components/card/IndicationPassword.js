import React from 'react';
import './IndicationPassword.css';
import { FaLightbulb } from 'react-icons/fa';

const IndicationPassword = () => {
    return (
        <div class="notifications-container">
            <div class="info-alert">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <FaLightbulb color="#4CAF50" size={32} />
                    </div>
                    <div class="info-prompt-container">
                        <p class="info-prompt-heading">Votre mot de passe doit avoir :
                        </p><div class="info-prompt-wrap">
                            <ul class="info-prompt-list" role="list">
                                <li>8 caractères ou plus</li>
                                <li>Une majuscule et minuscule</li>
                                <li>Au moins un chiffre et un caractère spécial</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndicationPassword;