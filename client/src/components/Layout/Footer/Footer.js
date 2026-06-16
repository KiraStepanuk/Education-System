import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <span className="footer-brand">Education-System</span>
        </div>
        
        <div className="footer-center">
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms of Service</span>
          <span className="footer-link">Help Center</span>
        </div>

        <div className="footer-right">
          <span className="footer-text">© “The Magnificent Seven-1” 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;