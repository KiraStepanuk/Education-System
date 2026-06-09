import React from 'react';
import './Input.css';

const Input = ({ label, type = "text", placeholder, value, onChange, variant = "underline" }) => {
  return (
    <div className={`custom-input-container ${variant}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="custom-input"
      />
    </div>
  );
};

export default Input;