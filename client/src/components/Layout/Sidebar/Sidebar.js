import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import './Sidebar.css';

// Импорт иконок
import homeIcon from '../../../pages/assets/Dashboard.png';
import allCoursesIcon from '../../../pages/assets/All Courses.png';
import libraryIcon from '../../../pages/assets/My Library.png';
import publicationsIcon from '../../../pages/assets/My Publications.png';

// Импортируем ваш логотип (путь относительно Sidebar.js)
import logoIcon from '../TopNav/assets/logo.svg'; 

const Sidebar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const helpRef = useRef(null);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const toggleHelpPopup = () => {
    setShowHelpPopup((prev) => !prev);
  };

  // Закриття попапу Help при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelpPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo-container">
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
          {/* Заменили блок .logo-icon на тег img */}
          <img src={logoIcon} alt="Learning Hub Logo" className="sidebar-logo-img" />
          <div className="logo-text">
            <h2>Learning Hub</h2>
            <p>EDUCATIONAL ECOSYSTEM</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-menu">
        <div className={`sidebar-link ${isActive('/home')}`} onClick={() => navigate('/home')}>
          <img src={homeIcon} alt="Home" /> Home page
        </div>
        <div className={`sidebar-link ${isActive('/all-courses')}`} onClick={() => navigate('/all-courses')}>
          <img src={allCoursesIcon} alt="All Courses" /> All Courses
        </div>

        {user && user.role !== 'guest' && (
          <>
            {user.role !== 'admin' && (
              <>
                <div className={`sidebar-link ${isActive('/publications')}`} onClick={() => navigate('/publications')}>
                  <img src={publicationsIcon} alt="Publications" /> My Publications
                </div>
                <div className={`sidebar-link ${isActive('/library')}`} onClick={() => navigate('/library')}>
                  <img src={libraryIcon} alt="Library" /> My Library
                </div>
              </>
            )}
            <div className={`sidebar-link ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: isActive('/dashboard') ? 1 : 0.6 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My profile
            </div>
          </>
        )}
      </nav>

      {user && user.role !== 'guest' && user.role !== 'admin' && (
        <div className="sidebar-create-btn">
          <Button text="+ Створити курс" onClick={() => navigate('/create-course')} />
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-link sidebar-help-container" ref={helpRef}>
          <div onClick={toggleHelpPopup} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Help
          </div>

          {showHelpPopup && (
            <div className="help-popup">
              <p className="help-popup-title">Тех підтримка</p>
              <a
                href="https://t.me/StepanukKira"
                target="_blank"
                rel="noopener noreferrer"
                className="help-popup-link"
              >
                Степанюк Кіра
              </a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;