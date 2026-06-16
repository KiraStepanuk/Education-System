import React from 'react';
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

  const isActive = (path) => location.pathname === path ? 'active' : '';

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
          <Button text="+ Create Course" onClick={() => navigate('/create-course')} />
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          Settings
        </div>
        <div className="sidebar-bottom-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Help
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;