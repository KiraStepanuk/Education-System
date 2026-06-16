import React from 'react';
import './Input.css';

const Input = ({ label, type = "text", placeholder, value, onChange, icon }) => {
  return (
    <div className="custom-input-container">
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input 
          type={type} 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange} 
          className={`custom-input ${icon ? 'with-icon' : ''}`}
        />
      </div>
    </div>
  );
};

export default Input;