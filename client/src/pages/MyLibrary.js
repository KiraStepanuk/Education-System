import React, { useState, useEffect } from 'react';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './MyLibrary.css';

const MyLibrary = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data.filter(c => c.status === 'approved')));
  }, []);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    fetch(`${API_URL}/users/${userId}/favorites`)
      .then((res) => res.json())
      .then((data) => setFavorites(Array.isArray(data) ? data : []));
  }, [user]);

  return (
    <div className="library-page">
      <div className="library-header">
        <div>
          <h1 className="home-header-title">Моя Бібліотека</h1>
          <p className="home-subtitle" style={{margin:0}}>Ваш персональний простір для навчання та збережених матеріалів.</p>
        </div>
        <button className="filter-btn-dark" style={{width:'auto', padding:'0 20px', background:'white', color:'black', border:'1px solid #ddd'}}>
          <span style={{marginRight: '8px'}}>≡</span> Фільтрувати
        </button>
      </div>

      <div className="library-stats-grid">
        <div className="ls-card ls-card-dark">
          <div>
            <h4>Активність за тиждень</h4>
            <h2>5 курсів</h2>
            <p>Ви на 12% активніші, ніж минулого тижня!</p>
          </div>
          <div className="bar-chart-mock">
            <div className="bar" style={{height: '30%'}}></div>
            <div className="bar" style={{height: '50%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '100%'}}></div>
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '20%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
          </div>
        </div>
        <div className="ls-card ls-card-blue">
          <h4>⏱ Час навчання</h4>
          <h2>12г 40хв</h2>
        </div>
        <div className="ls-card ls-card-white">
          <h4>🏆 Сертифікати</h4>
          <h2>3 нових</h2>
        </div>
      </div>

      <div className="section-header">
        <h2>Нещодавно переглянуті</h2>
        <span className="section-actions">Дивитися всі</span>
      </div>
      <div className="recent-courses">
         <div className="recent-card">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80" alt="img" className="recent-img"/>
            <div className="recent-info" style={{flex:1}}>
               <h4>Основи Data Science</h4>
               <p>Модуль 3: Візуалізація</p>
               <div className="progress-bar"><div className="progress-fill" style={{width:'60%'}}></div></div>
            </div>
         </div>
         <div className="recent-card">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80" alt="img" className="recent-img"/>
            <div className="recent-info" style={{flex:1}}>
               <h4>Сучасний Менеджмент</h4>
               <p>Стаття: Гнучкі методології</p>
               <div className="progress-bar"><div className="progress-fill" style={{width:'80%'}}></div></div>
            </div>
         </div>
         <div className="recent-card">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80" alt="img" className="recent-img"/>
            <div className="recent-info" style={{flex:1}}>
               <h4>Побудова Спільнот</h4>
               <p>Відео: Соціальна динаміка</p>
               <div className="progress-bar"><div className="progress-fill" style={{width:'20%'}}></div></div>
            </div>
         </div>
      </div>

      <div className="section-header">
        <h2>Улюблені курси</h2>
      </div>
      <div className="courses-grid">
        {favorites.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Ви ще не додали жодного курсу до улюблених.</p>
        ) : (
          favorites.map(course => (
            <CourseCard key={course._id || course.id} course={course} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyLibrary;