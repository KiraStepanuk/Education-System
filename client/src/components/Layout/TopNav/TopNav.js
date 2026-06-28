import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopNav.css';
import {API_URL} from "../../../config";

const TopNav = ({ user, setUser }) => {
  const navigate = useNavigate();

  // Стейт профілю
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Стейт живого пошуку
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

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

  // Закриття дропдаунів при кліку поза ними
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ефект живого пошуку (з Debounce, щоб не робити запит на кожну літеру миттєво)
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const fetchTimer = setTimeout(() => {
      setIsSearching(true);
      fetch(`${API_URL}/api/users/search?q=${searchQuery}`)
          .then((res) => res.json())
          .then((data) => {
            setSearchResults(data);
            setShowSearchDropdown(true);
          })
          .catch(err => console.error("Помилка пошуку:", err))
          .finally(() => setIsSearching(false));
    }, 300); // Затримка 300мс після останнього натискання клавіші

    return () => clearTimeout(fetchTimer);
  }, [searchQuery]);

  // Перехід на профіль знайденого користувача
  const handleResultClick = (userId) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

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
                {/* КОНТЕЙНЕР ПОШУКУ */}
                <div className="topnav-search-container" ref={searchContainerRef}>
                  <div className="topnav-search">
                <span className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                    <input
                        type="text"
                        placeholder="Пошук акаунтів..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                    />
                  </div>

                  {/* ВИПАДАЮЧЕ МЕНЮ ПОШУКУ */}
                  {showSearchDropdown && (
                      <div className="search-results-dropdown">
                        {isSearching ? (
                            <div className="search-loading">Шукаємо...</div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((resultUser) => (
                                <div
                                    key={resultUser._id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(resultUser._id)}
                                >
                                  <div className="search-result-avatar">
                                    {resultUser.avatar ? (
                                        <img src={resultUser.avatar} alt="avatar" />
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                          <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    )}
                                  </div>
                                  <div className="search-result-info">
                                    <p className="search-result-name">{resultUser.firstName} {resultUser.lastName}</p>
                                    <p className="search-result-role">{resultUser.role === 'admin' ? 'Модератор' : (resultUser.role === 'author' ? 'Автор' : 'Студент')}</p>
                                  </div>
                                </div>
                            ))
                        ) : (
                            <div className="search-no-results">Нікого не знайдено</div>
                        )}
                      </div>
                  )}
                </div>

                {/* ПРОФІЛЬ КОРИСТУВАЧА */}
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