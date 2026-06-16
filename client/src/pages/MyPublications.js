import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button/Button';
import { API_URL } from '../config';
import './MyPublications.css';

const MyPublications = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, [user.id]);

  const fetchMyCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/courses?author_id=${user.id}`);
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      console.error("Помилка завантаження публікацій", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цей курс?")) return;
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'user_id': user.id }
      });
      if (response.ok) {
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (error) {
      alert("Помилка видалення");
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Завантаження...</div>;

  const activeCourses = courses.filter(c => c.status !== 'rejected');
  const rejectedCourses = courses.filter(c => c.status === 'rejected');

  return (
    <div className="publications-page">
      {/* Заголовок */}
      <header className="pub-header">
        <div className="pub-title">
          <h1>Кабінет автора</h1>
          <p className="pub-subtitle">Керуйте вашим навчальним контентом та публікаціями</p>
        </div>
        <Button 
          text="⊕ Створити новий курс" 
          onClick={() => navigate('/create-course')} 
          style={{ padding: '12px 24px', borderRadius: '10px' }}
        />
      </header>

      {/* Статистика */}
      <div className="pub-stats-row">
        <div className="pub-stat-card">
          <label>Всього курсів</label>
          <div className="value">{courses.length}</div>
        </div>
        <div className="pub-stat-card">
          <label>Перегляди</label>
          <div className="value">1,248</div>
        </div>
        <div className="pub-stat-card">
          <label>Середній рейтинг</label>
          <div className="value">4.8 <span className="star">★</span></div>
        </div>
      </div>

      {/* Список курсів */}
      <section className="my-courses-section">
        <div className="section-header-row">
          <h2>Мої курси</h2>
          <div className="table-controls">
            <div className="search-mini">
              <span style={{ position: 'absolute', left: '12px', top: '10px' }}>🔍</span>
              <input type="text" placeholder="Пошук курсу..." />
            </div>
            <button className="filter-btn-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Фільтр
            </button>
          </div>
        </div>

        <div className="courses-table-container">
          <div className="table-header">
            <div>Назва курсу</div>
            <div>Дата створення</div>
            <div>Дії</div>
          </div>
          {activeCourses.map(course => (
            <div className="table-row" key={course.id}>
              <div className="course-info-cell">
                <img src={course.image || "https://via.placeholder.com/50"} className="course-mini-img" alt="img" />
                <div className="course-text-meta">
                  <h4>{course.title}</h4>
                  <span>Дизайн • 24 лекції</span>
                </div>
              </div>
              <div className="date-cell">12 Жов 2023</div>
              <div className="actions-cell">
                <button className="btn-sm btn-view" onClick={() => navigate(`/courses/${course.id}`)}>Переглянути</button>
                <button className="btn-sm btn-edit-sm" onClick={() => navigate(`/edit-course/${course.id}`)}>Редагувати</button>
                <button className="btn-sm btn-delete-sm" onClick={() => handleDelete(course.id)}>Видалити</button>
              </div>
            </div>
          ))}
          {activeCourses.length === 0 && <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>У вас поки немає активних курсів.</div>}
        </div>
      </section>

      {/* Відхилено */}
      <section className="rejected-section">
        <h2>
          <span style={{color:'#ef4444'}}>☄</span> Відхилено 
          {rejectedCourses.length > 0 && <span className="count-badge">{rejectedCourses.length}</span>}
        </h2>
        
        <div style={{display:'flex', flexWrap:'wrap', gap:'20px'}}>
          {rejectedCourses.map(course => (
            <div className="rejected-card" key={course.id}>
              <div className="rej-card-top">
                <img src={course.image || "https://via.placeholder.com/60"} className="rej-img" alt="img" />
                <div className="rej-info-header">
                  <span className="rej-status-tag">Повернено</span>
                  <h4>{course.title}</h4>
                  <p>Автор: {user.firstName} {user.lastName}</p>
                  <p style={{fontSize:'11px', marginTop:'4px'}}>🕒 Сьогодні, 10:45</p>
                </div>
              </div>
              <p className="rej-desc">
                {course.reject_reason || "Курс потребує перевірки на відповідність навчальній програмі та стандартам платформи."}
              </p>
              <div className="rej-actions">
                <button className="rej-btn-edit" onClick={() => navigate(`/edit-course/${course.id}`)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Редагувати
                </button>
                <button className="rej-btn-del" onClick={() => handleDelete(course.id)}>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                   Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyPublications;