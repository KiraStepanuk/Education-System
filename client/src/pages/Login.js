import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import Footer from '../components/Layout/Footer/Footer';
import { API_URL } from '../config';
import './Login.css';

// Імпорт іконок з вказаних шляхів
import educationIcon from './assets/Education.png';
import moderationIcon from './assets/Moderation.png';

const Login = ({ setUser }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user'); // user або admin

  const triggerTransition = (targetView) => {
    setAnimate(true);
    setTimeout(() => {
      setIsLoginView(targetView);
      setAnimate(false);
    }, 250);
  };

  const handleGuestLogin = () => {
    const guestUser = { role: 'guest' };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    navigate('/home');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        alert(data.message || 'Невірний логін або пароль');
      }
    } catch (error) {
      alert('Не вдалося з’єднатися з сервером');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, firstName, lastName, role })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        triggerTransition(true);
      } else {
        alert(data.error || 'Помилка при реєстрації');
      }
    } catch (error) {
      alert('Не вдалося з’єднатися з сервером');
    }
  };

  // SVG-іконки для полів введення
  const userSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const mailSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const lockSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          Education-System
        </div>
        <div className="auth-header-right">
          <span className="auth-guest-link" onClick={handleGuestLogin}>
            Увійти як гість
          </span>
          <button className="auth-login-btn" onClick={() => triggerTransition(true)}>
            Login
          </button>
        </div>
      </header>

      <div className={`auth-main-content ${animate ? 'fade-out' : 'fade-in'}`}>
        {isLoginView ? (
          /* --- ЕКРАН 1: ВХІД --- */
          <div className="auth-centered">
            <div className="login-card-container">
              <div className="login-card">
                <div className="login-card-header">
                  <h2>Welcome Back</h2>
                  <p>Continue your learning journey with Education-System</p>
                </div>
                
                <form onSubmit={handleLoginSubmit}>
                  <Input
                    label="Email Address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@university.edu"
                    icon={mailSvg}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    icon={lockSvg}
                  />
                  
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                  <Button text="Sign In" type="submit" className="auth-submit-btn" />
                </div>
                  
                  <div className="auth-switch">
                    New to the ecosystem? <span onClick={() => triggerTransition(false)}>Create an account</span>
                  </div>
                </form>
              </div>

              <div className="security-badges">
                <span className="badge-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure Login
                </span>
                <span className="badge-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Data Privacy
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* --- ЕКРАН 2: РЕЄСТРАЦІЯ --- */
          <div className="auth-split-container">
            <div className="registration-card">
              {/* Ліва темна панель */}
              <div className="auth-left-panel">
                <h1>Empower your <br /><span className="gradient-text">learning journey.</span></h1>
                <p className="left-panel-subtitle">Join a global ecosystem of thinkers, creators, and mentors dedicated to open educational growth.</p>
                
                <div className="feature-cards-container">
                  <div className="feature-card">
                    <div className="feature-icon-wrapper edu-icon">
                      <img src={educationIcon} alt="Education" className="feature-icon-img" />
                    </div>
                    <div className="feature-text">
                      <h3>Education</h3>
                      <p>Share educational content with the world</p>
                    </div>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon-wrapper mod-icon">
                      <img src={moderationIcon} alt="Moderation" className="feature-icon-img" />
                    </div>
                    <div className="feature-text">
                      <h3>Moderation</h3>
                      <p>All courses in the database are moderated</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Права світла панель з формою */}
              <div className="auth-right-panel">
                <div className="auth-form-container">
                  <h2>Create an account</h2>
                  <p className="form-subtitle">Start your learning or teaching journey today.</p>

                  <form onSubmit={handleRegisterSubmit}>
                    <div className="role-selection-container">
                      <label className="input-label">I want to...</label>
                      <div className="role-toggle">
                        <button 
                          type="button" 
                          className={`role-btn ${role === 'user' ? 'active' : ''}`} 
                          onClick={() => setRole('user')}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                          </svg>
                          Learn
                        </button>
                        <button 
                          type="button" 
                          className={`role-btn ${role === 'admin' ? 'active' : ''}`} 
                          onClick={() => setRole('admin')}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          Moderate
                        </button>
                      </div>
                    </div>

                    <div className="name-fields-row">
                      <Input 
                        label="First Name" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        placeholder="John" 
                        icon={userSvg}
                      />
                      <Input 
                        label="Last Name" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        placeholder="Doe" 
                        icon={userSvg}
                      />
                    </div>
                    
                    <Input 
                      label="Email Address" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="name@example.com" 
                      icon={mailSvg}
                    />
                    
                    <div className="password-input-group">
                      <Input 
                        label="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="••••••••" 
                        icon={lockSvg}
                      />
                      <span className="password-tip">Must be at least 8 characters long.</span>
                    </div>
                    
                    <div style={{ marginTop: '24px' }}>
                      <Button text="Create Account" type="submit" className="auth-submit-btn" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Login;