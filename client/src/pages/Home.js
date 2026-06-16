import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './Home.css';

const Home = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження", err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/approve`, {
        method: 'PUT',
        headers: { 'user_id': user?.id }
      });
      if (response.ok) {
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'approved' } : c));
      }
    } catch (error) {}
  };

  const handleReject = async (courseId) => {
    const reason = prompt("Введіть причину відхилення:");
    if (!reason) return;
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'user_id': user?.id },
        body: JSON.stringify({ reject_reason: reason })
      });
      if (response.ok) {
         setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'rejected' } : c));
      }
    } catch (error) {}
  };

  if (loading) return <div style={{padding: '40px'}}>Завантаження...</div>;

  const approvedCourses = courses.filter(c => c.status === 'approved');
  const pendingCourses = courses.filter(c => c.status === 'pending');
  // const myRejectedCourses = courses.filter(c => c.status === 'rejected' && c.author_id === user?.id);

  return (
    <div className="home-page-content">
      <h1 className="home-header-title">
        {user?.role === 'admin' ? "Панель модерації" : "Вітаємо в Open Learning Collective"}
      </h1>
      <p className="home-subtitle">
        {user?.role === 'admin' ? "Перевірте курси, що очікують на публікацію" : "Твій простір для навчання та спільного розвитку."}
      </p>

      {user?.role === 'admin' ? (
        /* --- ВИГЛЯД ДЛЯ АДМІНА --- */
        <section>
          <div className="section-header"><h2>🛡️ Потребують модерації</h2></div>
          {pendingCourses.length > 0 ? (
            <div className="courses-grid">
              {pendingCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  variant="moderation" 
                  onApprove={handleApprove} 
                  onReject={handleReject} 
                />
              ))}
            </div>
          ) : (
            <p>Наразі немає нових запитів на модерацію.</p>
          )}
        </section>
      ) : (
        /* --- ВИГЛЯД ДЛЯ ЗВИЧАЙНОГО КОРИСТУВАЧА --- */
        <>
          <div className="home-top-grid">
            {/* Ліва колонка: Топ рейтингу */}
            <div className="home-top-left">
              <div className="section-header">
                <h2><span style={{color: 'var(--primary-blue)'}}>★</span> Топ за рейтингом</h2>
              </div>
              <div className="courses-grid-horizontal">
                {approvedCourses.slice(0, 2).map((course, idx) => (
                  <CourseCard key={course.id} course={course} variant="compact" />
                ))}
              </div>
            </div>

            {/* Права колонка: Топ Користувач */}
            <div className="home-top-right">
              <div className="section-header"><h2>Найкращий користувач</h2></div>
              <div className="top-user-card">
                 {/* ... вміст картки юзера ... */}
                 <h3>Ігор Михайленко</h3>
                 <button className="tu-btn">Переглянути профіль</button>
              </div>
            </div>
          </div>

          <section>
            <div className="section-header">
              <h2><span style={{color: 'var(--primary-blue)'}}>✓</span> Новинки</h2>
              <span className="section-actions" onClick={()=>navigate('/all-courses')}>Дивитися всі</span>
            </div>
            <div className="courses-grid">
              {approvedCourses.slice(0, 4).map(course => (
                <CourseCard key={course.id} course={course} variant="compact" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;