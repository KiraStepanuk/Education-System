import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer/Footer';
import { API_URL } from '../config';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Паралельне завантаження даних користувача та його курсів
    Promise.all([
      fetch(`${API_URL}/users/${id}`).then((res) => {
        if (!res.ok) throw new Error('Не вдалося завантажити дані користувача');
        return res.json();
      }),
      fetch(`${API_URL}/courses?author_id=${id}`).then((res) => {
        if (!res.ok) throw new Error('Не вдалося завантажити курси автора');
        return res.json();
      })
    ])
      .then(([userData, coursesData]) => {
        setProfileUser(userData);
        // Відображаємо лише опубліковані (схвалені) курси
        setCourses(coursesData.filter((c) => c.status === 'approved'));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="profile-loading">Завантаження профілю...</div>;
  if (error) return <div className="profile-error">Помилка: {error}</div>;
  if (!profileUser) return <div className="profile-error">Користувача не знайдено</div>;

  // Розрахунок статистики на основі завантажених курсів
  const totalCoursesCount = courses.length;
  const averageRating =
    totalCoursesCount > 0
      ? (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / totalCoursesCount).toFixed(2)
      : '0.00';

  const fullName = `${profileUser.firstName} ${profileUser.lastName}`;

  return (
    <div className="user-profile-page">
      <main className="profile-main-container">
        
        {/* Картка інформації профілю */}
        <div className="profile-info-card">
          <div className="profile-top-banner"></div>
          
          <div className="profile-card-body">
            <div className="profile-avatar-wrapper">
              {profileUser.avatar ? (
                  <img
                      src={profileUser.avatar}
                      alt={fullName}
                      className="profile-user-avatar"
                  />
              ) : (
                  <div className="profile-user-avatar"></div>
              )}
              <div className="profile-verified-checkmark" title="Підтверджений акаунт">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h1 className="profile-user-name">{fullName}</h1>
            
            <p className="profile-user-bio">
              {profileUser.bio || 'Опис профілю відсутній. Автор ще не розповів про себе.'}
            </p>
          </div>
        </div>

        {/* Плитки статистики */}
        <div className="profile-stats-grid">
          <div className="stat-info-box">
            <span className="stat-box-label">TOTAL COURSES</span>
            <strong className="stat-box-value">{totalCoursesCount}</strong>
          </div>
          <div className="stat-info-box">
            <span className="stat-box-label">AVERAGE RATING</span>
            <strong className="stat-box-value">
              {averageRating} <span className="star-icon">★</span>
            </strong>
          </div>
        </div>

        {/* Секція опублікованих курсів */}
        <section className="user-published-section">
          <div className="section-title-row">
            <h2>Опубліковані курси</h2>
            <span className="view-all-link" onClick={() => navigate('/all-courses')}>
              Всі курси &rarr;
            </span>
          </div>

          {courses.length > 0 ? (
            <div className="user-courses-grid-layout">
              {courses.map((course) => (
                <div 
                  key={course.id || course._id} 
                  className="user-course-card-modern"
                  onClick={() => navigate(`/courses/${course.id || course._id}`)}
                >
                  <div className="uc-image-wrapper">
                    <img
                      src={course.image || 'https://via.placeholder.com/300x200?text=Course'}
                      alt={course.title}
                      className="uc-card-image"
                    />
                    <div className="uc-rating-badge">
                      ★ {course.rating > 0 ? course.rating : '0.0'}
                    </div>
                  </div>

                  <div className="uc-card-body">
                    <h3 className="uc-card-title">{course.title}</h3>
                    
                    <div className="uc-card-footer">
                      <span className="uc-students-count">
                        👤 {course.views || 0} переглядів
                      </span>
                      <img
                          src={profileUser.avatar || 'https://via.placeholder.com/120'}
                          alt={fullName}
                          className="uc-author-mini-avatar"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-courses-placeholder">
              <p>Цей автор ще не опублікував жодного курсу.</p>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;