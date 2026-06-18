import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/UI/Button/Button';
import { API_URL } from '../config';
import './Dashboard.css';

const Dashboard = ({ user, setUser }) => {
  const [activeCoursesCount, setActiveCoursesCount] = useState(0);

  // Ссилка на прихований input для фото
  const fileInputRef = useRef(null);

  // --- СТАНИ ДЛЯ МОДАЛОК ---
  // Модалка пароля
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');

  // Модалка профілю
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: '', lastName: '', bio: '' });

  useEffect(() => {
    if (user && user.id) {
      const targetId = user._id || user.id;
      fetch(`${API_URL}/courses?author_id=${targetId}`)
          .then(res => res.json())
          .then(data => {
            const active = data.filter(c => c.status === 'approved');
            setActiveCoursesCount(active.length);
          })
          .catch(err => console.error("Помилка завантаження статистики", err));
    }
  }, [user]);

  // Функція для виведення дати з бази даних
  const formatMembershipDate = (dateString) => {
    if (!dateString) return "Невідомо";

    const date = new Date(dateString);
    const month = date.toLocaleString('uk-UA', { month: 'long' });
    const year = date.getFullYear();

    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return (
        <>
          {capitalizedMonth}<br/>{year}
        </>
    );
  };

  // --- ЛОГІКА ЗАВАНТАЖЕННЯ АВАТАРА ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return alert("Файл занадто великий! Будь ласка, виберіть фото розміром до 2 МБ.");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      const targetId = user._id || user.id;

      try {
        const response = await fetch(`${API_URL}/users/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            avatar: base64Image
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setUser({ ...user, avatar: data.user.avatar });
          localStorage.setItem('user', JSON.stringify({ ...user, avatar: data.user.avatar }));
        } else {
          alert(`Помилка: ${data.error}`);
        }
      } catch (error) {
        console.error("Помилка завантаження аватара", error);
        alert("Помилка з'єднання з сервером");
      }
    };
  };

  // --- ЛОГІКА РЕДАГУВАННЯ ПРОФІЛЮ ---
  const openProfileModal = () => {
    setProfileData({ firstName: user.firstName, lastName: user.lastName, bio: user.bio || '' });
    setShowProfileModal(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.firstName || !profileData.lastName) return;

    const targetId = user._id || user.id;

    try {
      const response = await fetch(`${API_URL}/users/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: profileData.firstName, lastName: profileData.lastName, bio: profileData.bio })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const updatedUser = { ...user, firstName: data.user.firstName, lastName: data.user.lastName, bio: data.user.bio };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowProfileModal(false);
      } else {
        alert(`Помилка: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання з сервером");
    }
  };

  // --- ЛОГІКА ЗМІНИ ПАРОЛЯ ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.new.length < 6) {
      return setPasswordError('Новий пароль має бути не коротшим за 6 символів');
    }
    if (passwordData.new !== passwordData.confirm) {
      return setPasswordError('Нові паролі не співпадають!');
    }

    const targetId = user._id || user.id;

    try {
      const response = await fetch(`${API_URL}/users/${targetId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Пароль успішно змінено!');
        setShowPasswordModal(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        setPasswordError(data.error || 'Помилка зміни пароля');
      }
    } catch (error) {
      setPasswordError('Помилка з\'єднання з сервером');
    }
  };

  if (!user) return null;

  return (
      <div className="profile-page">
        <h1>Мій профіль</h1>
        <p className="profile-subtitle">Керуйте своєю особистою інформацією та безпекою акаунта.</p>

        <div className="profile-grid">
          {/* --- ЛІВА КОЛОНКА --- */}
          <div className="profile-card avatar-section">
            <div className="avatar-circle-wrapper">
              {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="avatar-circle" />
              ) : (
                  <div className="avatar-circle"></div>
              )}
              {/* Клік по олівцю */}
              <button className="avatar-edit-btn" onClick={() => fileInputRef.current.click()}>✎</button>
            </div>
            <h2 style={{margin: '0 0 20px 0'}}>{user.firstName} {user.lastName}</h2>

            {/* Прихований інпут для файлу */}
            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
            />

            <Button text="Змінити фото" style={{width: '100%'}} onClick={() => fileInputRef.current.click()} />
          </div>

          {/* --- ПРАВА КОЛОНКА --- */}
          <div>
            <div className="profile-card">
              <div className="info-header">
                <h2>Особиста інформація</h2>
                <span style={{color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '14px', fontWeight:'500'}} onClick={openProfileModal}>
                Редагувати
              </span>
              </div>

              <div className="info-grid">
                <div className="info-field">
                  <label>Повне ім'я</label>
                  <p><span className="info-icon">👤</span> {user.firstName}</p>
                </div>
                <div className="info-field">
                  <label>Прізвище</label>
                  <p><span className="info-icon">👤</span> {user.lastName}</p>
                </div>
                <div className="info-field">
                  <label>Електронна пошта</label>
                  <p><span className="info-icon">✉️</span> {user.username}</p>
                </div>
                <div className="info-field">
                  <label>Пароль</label>
                  <p style={{justifyContent: 'space-between', width: '100%'}}>
                    <span><span className="info-icon">🔒</span> ********</span>
                    <span
                        style={{color: 'var(--primary-blue)', cursor: 'pointer', fontSize:'12px', fontWeight:'600'}}
                        onClick={() => setShowPasswordModal(true)}
                    >
                    Змінити
                  </span>
                  </p>
                </div>
                
                {/* БЛОК БІОГРАФІЇ (На всю ширину завдяки gridColumn: '1 / -1') */}
                <div className="info-field" style={{ gridColumn: '1 / -1', borderBottom: 'none', paddingTop: '10px' }}>
                  <label>Біографія</label>
                  <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', fontWeight: '400', fontSize: '14px', margin: '8px 0 0 0', display: 'block' }}>
                    {user.bio || 'Інформація відсутня. Розкажіть щось про себе!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <label>Членство з</label>
                <h3>{formatMembershipDate(user.createdAt)}</h3>
              </div>
              <div className="stat-card">
                <label>Активні курси</label>
                <h3>{activeCoursesCount} Модулів</h3>
              </div>
              <div className="stat-card">
                <label>Роль у системі</label>
                <h3 style={{ textTransform: 'capitalize' }}>{user.role === 'admin' ? 'Модератор' : 'Користувач'}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* ================= МОДАЛКИ ================= */}

        {/* 1. Модальне вікно редагування профілю */}
        {showProfileModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Редагування профілю</h3>

                <form onSubmit={handleProfileSubmit}>
                  <div className="modal-field">
                    <label>Ім'я</label>
                    <input
                        type="text"
                        required
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="modal-field">
                    <label>Прізвище</label>
                    <input
                        type="text"
                        required
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    />
                  </div>
                  <div className="modal-field">
                    <label>Біографія</label>
                    <textarea
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Розкажіть трохи про себе та ваш досвід..."
                    />
                  </div>

                  <div className="modal-actions">
                    <span className="modal-cancel" onClick={() => setShowProfileModal(false)}>
                      Скасувати
                    </span>
                    <Button text="Зберегти" type="submit" />
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* 2. Модальне вікно зміни пароля */}
        {showPasswordModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Зміна пароля</h3>
                {passwordError && <div className="modal-error">{passwordError}</div>}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="modal-field">
                    <label>Поточний пароль</label>
                    <input
                        type="password"
                        required
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    />
                  </div>
                  <div className="modal-field">
                    <label>Новий пароль</label>
                    <input
                        type="password"
                        required
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                    />
                  </div>
                  <div className="modal-field">
                    <label>Підтвердіть новий пароль</label>
                    <input
                        type="password"
                        required
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                    />
                  </div>

                  <div className="modal-actions">
                    <span className="modal-cancel" onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError('');
                    }}>Скасувати</span>
                    <Button text="Зберегти" type="submit" />
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Dashboard;