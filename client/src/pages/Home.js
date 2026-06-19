import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './Home.css';

import { 
  Code2, 
  Palette, 
  Briefcase, 
  TrendingUp, 
  Binary, 
  Globe2, 
  Brain, 
  Landmark, 
  Activity, 
  Sparkles 
} from 'lucide-react';


const ALL_CATEGORIES = [
  { name: "IT та Програмування", icon: Code2 },
  { name: "Дизайн та UX/UI", icon: Palette },
  { name: "Бізнес та Менеджмент", icon: Briefcase },
  { name: "Маркетинг", icon: TrendingUp },
  { name: "Фізико-математичні науки", icon: Binary },
  { name: "Вивчення мов", icon: Globe2 },
  { name: "Психологія", icon: Brain },
  { name: "Мистецтво та Гуманітарні науки", icon: Landmark },
  { name: "Здоров'я та Фітнес", icon: Activity },
  { name: "Особистий розвиток", icon: Sparkles }
];

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

  const topRatedCourses = [...approvedCourses]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2);

  const getTopAuthor = () => {
    if (approvedCourses.length === 0) return null;

    const authorStats = {};
    approvedCourses.forEach(course => {
      const authorId = course.author_id;
      if (!authorId) return;

      if (!authorStats[authorId]) {
        authorStats[authorId] = {
          id: authorId,
          name: course.authorName || 'Невідомий автор',
          avatar: course.authorAvatar || '',
          courseCount: 0,
          totalViews: 0
        };
      }
      authorStats[authorId].courseCount += 1;
      authorStats[authorId].totalViews += (course.views || 0);
    });

    const authorsList = Object.values(authorStats);
    if (authorsList.length === 0) return null;

    authorsList.sort((a, b) => b.courseCount - a.courseCount || b.totalViews - a.totalViews);
    return authorsList[0];
  };

  const topAuthor = getTopAuthor();

  const handleCategoryClick = (categoryName) => {
    navigate('/all-courses', { state: { selectedCategory: categoryName } });
  };

  return (
    <div className="home-page-content">
      <h1 className="home-header-title">
        {user?.role === 'admin' ? "Панель модерації" : "Вітаємо в Education-System"}
      </h1>
      <p className="home-subtitle">
        {user?.role === 'admin' ? "Перевірте курси, що очікують на публікацію" : "Твій простір для навчання та спільного розвитку."}
      </p>

      {user?.role === 'admin' ? (
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
        <>
          <div className="home-top-grid">
            <div className="home-top-left">
              <div className="section-header">
                <h2><span style={{color: 'var(--primary-blue)'}}>★</span> Топ за рейтингом</h2>
              </div>
              <div className="courses-grid-horizontal">
                {topRatedCourses.length > 0 ? (
                  topRatedCourses.map((course) => (
                    <CourseCard key={course.id || course._id} course={course} variant="compact" />
                  ))
                ) : (
                  <p className="empty-text">Рейтингові курси відсутні.</p>
                )}
              </div>
            </div>

            <div className="home-top-right">
              <div className="section-header"><h2>Найкращий автор</h2></div>
              {topAuthor ? (
                <div className="top-user-card">
                  <div 
                    className="top-user-avatar" 
                    style={{ backgroundImage: `url(${topAuthor.avatar || 'https://via.placeholder.com/100'})` }}
                  >
                    <div className="top-user-badge">👑</div>
                  </div>
                  <h3>{topAuthor.name}</h3>
                  <div className="top-user-stats">
                    <div className="tu-stat">
                      <span>Курси</span>
                      <strong>{topAuthor.courseCount}</strong>
                    </div>
                    <div className="tu-stat">
                      <span>Перегляди</span>
                      <strong>{topAuthor.totalViews}</strong>
                    </div>
                  </div>
                  <button 
                    className="tu-btn" 
                    onClick={() => navigate(`/profile/${topAuthor.id}`)}
                  >
                    Переглянути профіль
                  </button>
                </div>
              ) : (
                <div className="top-user-card" style={{ justifyContent: 'center', minHeight: '300px' }}>
                  <p style={{ opacity: 0.6 }}>Автори відсутні</p>
                </div>
              )}
            </div>
          </div>

          <section className="categories-section" style={{ marginBottom: '40px' }}>
            <div className="section-header">
              <h2>Напрямки навчання</h2>
            </div>
            <div className="popular-categories-grid">
              {ALL_CATEGORIES.map((cat, idx) => {
                const IconComponent = cat.icon;
                const count = approvedCourses.filter(c => c.category === cat.name).length;
                return (
                  <div 
                    key={idx} 
                    className="category-card-mini"
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    <span className="category-card-icon">
                      <IconComponent size={20} strokeWidth={2} />
                    </span>
                    <div className="category-card-info">
                      <h4>{cat.name}</h4>
                      <span>{count} курсів</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

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