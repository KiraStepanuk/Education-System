import React from 'react';
import './Button.css';

function Button({ text, variant, type = "button", onClick, ...props }) {
    let variantClass = variant === 'red' ? 'button-red' : 'button-blue';

    return (
        <button 
            type={type} 
            className={`button ${variantClass}`} 
            onClick={onClick}
            {...props} 
        >
            {text}
        </button>
    );
}

export default Button;