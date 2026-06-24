import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';

const TopNav = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/dashboard');
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Закриття дропдауну при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="topnav-brand" onClick={() => navigate('/home')}>
          Education-System
        </div>
      </div>

      <div className="topnav-right">
        {user && user.role !== 'guest' ? (
          <>
            <div className="topnav-search">
              <span className="search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input type="text" placeholder="Пошук..." className="search-input" />
            </div>

            <div className="topnav-profile-container" ref={dropdownRef}>
              <div 
                className="topnav-avatar" 
                onClick={toggleDropdown}
                style={{ padding: user?.avatar ? 0 : '', overflow: 'hidden' }}
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              
              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.firstName} {user.lastName}</p>
                    <p className="dropdown-role">{user.role === 'admin' ? 'Модератор' : 'Автор'}</p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    Мій Профіль
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Вийти
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button className="login-btn-header" onClick={() => navigate('/')}>Увійти</button>
        )}
      </div>
    </header>
  );
};

export default TopNav;