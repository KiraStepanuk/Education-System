import React from 'react';
import './Button.css';

function Button(props) {

    const buttonText = props.text;
    const buttonVariant = props.variant;

    let variantClass = '';
    if (buttonVariant === 'red') {
        variantClass = 'button-red';
    } else if (buttonVariant === 'blue') {
        variantClass = 'button-blue';
    } else {
        variantClass = 'button-blue';
    }

    return (
        <button className={`button ${variantClass}`}>
            {buttonText}
        </button>
    );
}

export default Button;