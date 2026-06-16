import React from 'react';
import Button from '../components/UI/Button/Button';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>Мій профіль</h1>
      <p className="profile-subtitle">Керуйте своєю особистою інформацією та безпекою акаунта.</p>

      <div className="profile-grid">
        {/* Ліва колонка - Аватар */}
        <div className="profile-card avatar-section">
          <div className="avatar-circle-wrapper">
             <div className="avatar-circle"></div>
             <button className="avatar-edit-btn">✎</button>
          </div>
          <h2 style={{margin: '0 0 20px 0'}}>{user.firstName} {user.lastName}</h2>
          <Button text="Змінити фото" style={{width: '100%'}}/>
          <p style={{fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px', lineHeight: '1.5'}}>
            Рекомендовано: JPG або PNG,<br/> мін. 400x400 пікселів.
          </p>
        </div>

        {/* Права колонка - Інформація */}
        <div>
          <div className="profile-card">
            <div className="info-header">
              <h2>Особиста інформація</h2>
              <span style={{color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '14px', fontWeight:'500'}}>Редагувати все</span>
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
                  <span style={{color: 'var(--primary-blue)', cursor: 'pointer', fontSize:'12px', fontWeight:'600'}}>Відкрити</span>
                </p>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <label>Членство з</label>
              <h3>Вересень<br/>2023</h3>
            </div>
            <div className="stat-card">
              <label>Активні курси</label>
              <h3>12 Модулів</h3>
            </div>
            <div className="stat-card">
              <label>Роль у системі</label>
              <h3 style={{ textTransform: 'capitalize' }}>{user.role === 'admin' ? 'Модератор' : 'Автор'}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;