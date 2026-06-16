import React from 'react';
import './Button.css';

function Button({ text, variant = 'primary', type = "button", onClick, className = '', ...props }) {
    let variantClass = `button-${variant}`; // primary, outline, danger

    return (
        <button 
            type={type} 
            className={`button ${variantClass} ${className}`} 
            onClick={onClick}
            {...props} 
        >
            {text}
        </button>
    );
}

export default Button;