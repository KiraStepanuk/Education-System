import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import userIcon from './assets/user.svg';
import mainIcon from './assets/main.png';

const Header = ({ role }) => {
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (role === 'Гість' || role === 'guest') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        
        <div className="header-left" onClick={() => navigate('/home')}>
          <img src={mainIcon} alt="Main Menu" className="header-main-logo" />
        </div>

        <div className="header-right">
          <div className="header-role-info">
            <p className="role-label">Роль у системі:</p>
            <p className="role-name">{role}</p>
          </div>

          <div className="header-user-avatar" onClick={handleAvatarClick}>
            <img src={userIcon} alt="User Profile" className="header-user-icon" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;