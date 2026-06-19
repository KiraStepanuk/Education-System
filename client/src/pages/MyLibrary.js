import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './MyLibrary.css';

const MyLibrary = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => {
        const approved = data.filter(c => c.status === 'approved');
        setCourses(approved);
      })
      .catch(err => console.error("Помилка завантаження курсів", err));
  }, []);


  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;
    fetch(`${API_URL}/users/${userId}/favorites`)
      .then((res) => res.json())
      .then((data) => setFavorites(Array.isArray(data) ? data : []))
      .catch(err => console.error("Помилка завантаження обраного", err));
  }, [user]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(stored);
    } catch (e) {
      console.error("Помилка читання історії переглядів", e);
    }
  }, []);


  const getCategoryDistribution = () => {
    if (!favorites || favorites.length === 0) return [];

    const counts = {};
    favorites.forEach((course) => {
      const cat = course.category || "Інше";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.keys(counts)
      .map((cat) => ({
        name: cat,
        percentage: Math.round((counts[cat] / favorites.length) * 100),
        count: counts[cat],
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
  };


  const getRegistrationDate = () => {
    if (!user?.createdAt) return 'Нещодавно';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('uk-UA', { year: 'numeric', month: 'long' });
  };


  const displayRecentOrRecommended = recentlyViewed.length > 0 
    ? recentlyViewed.slice(0, 3) 
    : courses.slice(0, 3);

  return (
    <div className="library-page">
      <div className="library-header">
        <div>
          <h1 className="home-header-title">Моя Бібліотека</h1>
          <p className="home-subtitle" style={{ margin: 0 }}>Ваш персональний простір для навчання та збережених матеріалів.</p>
        </div>
      </div>

      <div className="library-stats-grid">
        <div className="ls-card ls-card-dark">
          <div className="category-stats-container">
            <h4>Фокус моїх інтересів</h4>
            {favorites.length > 0 ? (
              <div className="category-stats-list">
                {getCategoryDistribution().map((item, idx) => (
                  <div key={idx} className="category-stat-item">
                    <div className="category-stat-info">
                      <span className="category-name">{item.name}</span>
                      <span className="category-percentage">{item.percentage}%</span>
                    </div>
                    <div className="category-progress-bar">
                      <div 
                        className="category-progress-fill" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-stats-text">
                Збережіть кілька курсів до улюблених, щоб ми могли сформувати аналітику ваших інтересів.
              </p>
            )}
          </div>
        </div>

        <div className="ls-card ls-card-blue">
          <h4>⭐ Збережено курсів</h4>
          <h2>{favorites.length}</h2>
          <p>Курси, які ви додали до свого списку обраного.</p>
        </div>

        <div className="ls-card ls-card-white">
          <h4>📅 Член спільноти з</h4>
          <h2 style={{ fontSize: '24px', margin: '12px 0' }}>{getRegistrationDate()}</h2>
          <p style={{ textTransform: 'capitalize' }}>
            Роль у системі: {user?.role === 'admin' ? 'Модератор' : 'Користувач'}
          </p>
        </div>
      </div>

      <div className="section-header">
        <h2>{recentlyViewed.length > 0 ? "Нещодавно переглянуті" : "Рекомендовані для вас"}</h2>
      </div>
      
      <div className="recent-courses">
        {displayRecentOrRecommended.map((course) => {
          const courseId = course._id || course.id;
          return (
            <div 
              className="recent-card" 
              key={courseId} 
              onClick={() => navigate(`/courses/${courseId}`)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80"} 
                alt={course.title} 
                className="recent-img"
              />
              <div className="recent-info" style={{ flex: 1 }}>
                <h4>{course.title}</h4>
                <p>{course.category || "Загальний курс"}</p>
                <span className="recent-rating-badge">★ {course.rating || '0.0'}</span>
              </div>
            </div>
          );
        })}
        {displayRecentOrRecommended.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>Немає доступних курсів для відображення.</p>
        )}
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