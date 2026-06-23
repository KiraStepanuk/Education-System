import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button/Button';
import { API_URL } from '../config';
import './MyPublications.css';

const MyPublications = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. Додані стани для пошуку та сортування
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('new');
  
  const navigate = useNavigate();

  useEffect(() => {
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

    if (user && user.id) {
      fetchMyCourses();
    }
  }, [user.id]);

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

  // 2. Фільтрація: беремо лише активні (не відхилені)
  let activeCourses = courses.filter(c => c.status !== 'rejected');

  // 3. Пошук за назвою
  if (searchTerm) {
    activeCourses = activeCourses.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 4. Сортування
  activeCourses.sort((a, b) => {
    if (sortBy === 'new') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'old') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    return 0;
  });

  const rejectedCourses = courses.filter(c => c.status === 'rejected');
  const totalViews = courses.reduce((sum, course) => sum + (course.views || 0), 0);
  
  // Розрахунок середнього рейтингу
  const totalRating = courses.reduce((sum, course) => sum + (course.rating || 0), 0);
  const averageRating = courses.length > 0 ? (totalRating / courses.length).toFixed(1) : '0.0';

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
          <div className="value">{totalViews.toLocaleString()}</div>
        </div>
        <div className="pub-stat-card">
          <label>Середній рейтинг</label>
          <div className="value">{averageRating} <span className="star">★</span></div>
        </div>
      </div>

      {/* Список курсів */}
      <section className="my-courses-section">
        <div className="section-header-row">
          <h2>Мої курси</h2>
          <div className="table-controls">
            
            {/* Поле пошуку */}
            <div className="search-mini">
              <span style={{ position: 'absolute', left: '12px', top: '10px' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Пошук курсу..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Випадаючий список сортування (замість кнопки Фільтр) */}
            <select 
              className="filter-btn-outline"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ outline: 'none', cursor: 'pointer', appearance: 'auto' }}
            >
              <option value="new">Нові</option>
              <option value="old">Старі</option>
              <option value="views">За популярністю</option>
            </select>

          </div>
        </div>

        <div className="courses-table-container">
          <div className="table-header">
            <div>Назва курсу</div>
            <div>Дата створення</div>
            <div>Дії</div>
          </div>
          {activeCourses.map(course => (
            <div className="table-row" key={course.id || course._id}>
              <div className="course-info-cell">
                <img src={course.image || "https://via.placeholder.com/50"} className="course-mini-img" alt="img" />
                <div className="course-text-meta">
                  <h4>{course.title}</h4>
                  <span>{course.category || 'Без категорії'}</span>
                </div>
              </div>
              
              {/* Відображення реальної дати створення */}
              <div className="date-cell">
                {course.createdAt ? new Date(course.createdAt).toLocaleDateString('uk-UA') : 'Невідомо'}
              </div>
              
              <div className="actions-cell">
                <button className="btn-sm btn-view" onClick={() => navigate(`/courses/${course.id || course._id}`)}>Переглянути</button>
                <button className="btn-sm btn-edit-sm" onClick={() => navigate(`/edit-course/${course.id || course._id}`)}>Редагувати</button>
                <button className="btn-sm" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }} onClick={() => navigate(`/create-test/${course.id || course._id}`)}>Тест</button>
                <button className="btn-sm btn-delete-sm" onClick={() => handleDelete(course.id || course._id)}>Видалити</button>
              </div>
            </div>
          ))}
          {activeCourses.length === 0 && (
            <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
               {searchTerm ? 'За вашим запитом курсів не знайдено.' : 'У вас поки немає активних курсів.'}
            </div>
          )}
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
            <div className="rejected-card" key={course.id || course._id}>
              <div className="rej-card-top">
                <img src={course.image || "https://via.placeholder.com/60"} className="rej-img" alt="img" />
                <div className="rej-info-header">
                  <span className="rej-status-tag">Повернено</span>
                  <h4>{course.title}</h4>
                  <p>Автор: {user.firstName} {user.lastName}</p>
                  <p style={{fontSize:'11px', marginTop:'4px'}}>
                    🕒 {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('uk-UA') : 'Сьогодні'}
                  </p>
                </div>
              </div>
              <p className="rej-desc">
                {course.reject_reason || "Курс потребує перевірки на відповідність навчальній програмі та стандартам платформи."}
              </p>
              <div className="rej-actions">
                <button className="rej-btn-edit" onClick={() => navigate(`/edit-course/${course.id || course._id}`)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Редагувати
                </button>
                <button className="rej-btn-del" onClick={() => handleDelete(course.id || course._id)}>
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