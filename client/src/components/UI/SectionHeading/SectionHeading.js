import React from 'react';
import './SectionHeading.css';

function SectionHeading(props) {

    const headingText = props.text;

    return (
        <div className="section-heading">
            <div className="red-rectangle"></div>
            <h2 className="heading-text">{headingText}</h2>
        </div>
    );
}

export default SectionHeading;