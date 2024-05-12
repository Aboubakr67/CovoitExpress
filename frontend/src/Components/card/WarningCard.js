import React, { useState, useEffect } from "react";
import "./WarningCard.css";

const WarningCard = ({
  warningObject,
  message,
  btn1,
  btn2,
  onConfirm,
  onCancel,
}) => {
  return (
    <div class="card_warning">
      <div class="header">
        <div class="image">
          <svg
            aria-hidden="true"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div class="content">
          <span class="title">{warningObject}</span>
          <p class="message">{message}</p>
        </div>
        <div class="actions">
          <button class="desactivate" type="button" onClick={onConfirm}>
            {btn1}
          </button>
          <button class="cancel" type="button" onClick={onCancel}>
            {btn2}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningCard;
