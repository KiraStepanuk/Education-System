import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer/Footer';
import Input from '../components/UI/Input/Input';
import Button from '../components/UI/Button/Button';
import mainIcon from '../components/Layout/Header/assets/main.png';
import './Login.css';

const Login = ({ setUser }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isModerator, setIsModerator] = useState(false);

  // Завдання 3: Передаємо об'єкт лише з роллю (без ID)
  const handleGuestLogin = () => {
    const guestUser = { role: 'guest' };
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    navigate('/home');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
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
      console.error('Помилка запиту:', error);
      alert('Не вдалося з’єднатися з сервером');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const role = isModerator ? 'admin' : 'user';

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, firstName, lastName, role })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Реєстрація успішна! Тепер ви можете увійти.');
        // Перемикаємо на логін і очищаємо пароль для безпеки
        setIsLoginView(true);
        setPassword('');
        setFirstName('');
        setLastName('');
        setIsModerator(false);
      } else {
        alert(data.error || 'Помилка при реєстрації');
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      alert('Не вдалося з’єднатися з сервером');
    }
  };

  return (
    <div className="login-page-container">
      <main className="login-content">
        <div className="login-card-wrapper">

          <div className="login-logo-container">
            <img src={mainIcon} alt="Education System Logo" className="login-system-logo" />
          </div>

          <div className="guest-login-option">
            <span onClick={handleGuestLogin} className="guest-link">
              Увійти як гість
            </span>
          </div>

          {/* Завдання 2: Два варіанти верстки (логін/реєстрація) */}
          {isLoginView ? (
            // ВАРІАНТ 1: ВХІД
            <form className="login-form-element" onSubmit={handleLoginSubmit}>
              <h2 className="form-heading-title">LOGIN</h2>

              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                variant="underline"
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="underline"
              />

              <div className="form-submit-wrapper">
                <Button text="Login Account" variant="red" type="submit" />
              </div>

              <div className="view-switch-text">
                Don't have an account?{' '}
                <span className="switch-view-link" onClick={() => setIsLoginView(false)}>
                  Registration
                </span>
              </div>
            </form>
          ) : (
            // ВАРІАНТ 2: РЕЄСТРАЦІЯ
            <form className="login-form-element" onSubmit={handleRegisterSubmit}>
              <h2 className="form-heading-title">REGISTRATION</h2>

              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                variant="underline"
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                variant="underline"
              />

              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                variant="underline"
              />

              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                variant="underline"
              />

              <div className="moderator-checkbox-wrapper">
                <label className="checkbox-custom-label">
                  <input
                    type="checkbox"
                    className="checkbox-hidden-input"
                    checked={isModerator}
                    onChange={(e) => setIsModerator(e.target.checked)}
                  />
                  <span className="checkbox-styled-box"></span>
                  <span className="checkbox-label-text">Are you a moderator?</span>
                </label>
              </div>

              <div className="form-submit-wrapper">
                <Button text="REGISTRATION Account" variant="red" type="submit" />
              </div>

              <div className="view-switch-text">
                Already have account?{' '}
                <span className="switch-view-link" onClick={() => setIsLoginView(true)}>
                  Log in
                </span>
              </div>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;