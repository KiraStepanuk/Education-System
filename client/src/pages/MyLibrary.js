// --- START OF FILE MyLibrary.js ---
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './MyLibrary.css';

// Імпорт утиліти та компонента сертифіката
import { generateCertificatePDF } from '../utils/pdfGenerator'; // Підправте шлях
import Certificate from '../components/Certificate/Certificate'; // Підправте шлях

const MyLibrary = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [passedQuizzes, setPassedQuizzes] = useState([]); 
  const [downloadingId, setDownloadingId] = useState(null); 
  
  // Стейт для даних поточного активного сертифіката
  const [activeCertificateData, setActiveCertificateData] = useState(null);

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

    fetch(`${API_URL}/api/users/${userId}/quiz-results`)
      .then((res) => res.json())
      .then((data) => setPassedQuizzes(Array.isArray(data) ? data : []))
      .catch(err => console.error("Помилка завантаження тестів", err));

  }, [user]);




  
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(stored);
    } catch (e) {
      console.error("Помилка читання історії переглядів", e);
    }
  }, []);

  // ОНОВЛЕНИЙ ОБРОБНИК: завантаження сертифіката
  const handleDownloadCertificate = (e, resultId, courseTitle, percent, dateStr) => {
    e.stopPropagation(); // Зупиняє подію кліку на картку
    setDownloadingId(resultId);
    
    // Оновлюємо стейт даними обраного тесту
    setActiveCertificateData({
      studentName: `${user.firstName} ${user.lastName}`.trim(),
      courseTitle: courseTitle,
      score: `${percent}%`,
      date: dateStr,
      certificateId: resultId
    });

    // Використовуємо короткий таймаут, щоб React встиг оновити DOM компонента Certificate
    setTimeout(async () => {
      try {
        await generateCertificatePDF('certificate-template', `Сертифікат_${courseTitle}.pdf`);
      } catch (error) {
        console.error("Помилка генерації:", error);
        alert("Помилка при створенні PDF.");
      } finally {
        setDownloadingId(null);
        // Не очищуємо setActiveCertificateData одразу, щоб уникнути миготіння,
        // це безпечно, оскільки компонент прихований
      }
    }, 150); 
  };

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


  // ДОДАНО: Функція для динамічного видалення улюбленого курсу
  const handleFavoriteUpdate = (courseId, isNowFavorite) => {
    if (!isNowFavorite) {
      // Видаляємо курс із стейту, якщо сердечко прибрано
      setFavorites(prevFavorites => 
        prevFavorites.filter(course => (course._id || course.id) !== courseId)
      );
    }
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
                      <div className="category-progress-fill" style={{ width: `${item.percentage}%` }}></div>
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
          <h4>🏆 Пройдено тестів</h4>
          <h2 style={{ fontSize: '36px', margin: '8px 0' }}>{passedQuizzes.length}</h2>
          <p>Успішно складені фінальні тестування.</p>
        </div>
      </div>

      {/* СЕКЦІЯ: МОЇ ДОСЯГНЕННЯ */}
      {passedQuizzes.length > 0 && (
        <>
          <div className="section-header">
            <h2>Мої досягнення (Пройдені тести)</h2>
          </div>
          <div className="recent-courses">
            {passedQuizzes.map((result) => {
              const course = result.course_id;
              if (!course) return null;
              const isDownloading = downloadingId === result._id;

              return (
                <div 
                  className="recent-card passed-quiz-card" 
                  key={result._id} 
                  onClick={() => navigate(`/courses/${course._id}`)}
                  style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}
                >
                  <img 
                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80"} 
                    alt={course.title} 
                    className="recent-img"
                  />
                  <div className="recent-info" style={{ flex: 1 }}>
                    <h4>{course.title}</h4>
                    <p style={{ color: '#10b981', fontWeight: '600' }}>✓ Тест складено ({result.percent}%)</p>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Дата: {new Date(result.createdAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>

                  {/* Кнопка завантаження */}
                  <button
                    className={`download-cert-btn ${isDownloading ? 'loading' : ''}`}
                    onClick={(e) => handleDownloadCertificate(
                      e, 
                      result._id, 
                      course.title, 
                      result.percent, 
                      new Date(result.createdAt).toLocaleDateString('uk-UA')
                    )}
                    disabled={downloadingId !== null}
                  >
                    {isDownloading ? (
                      <div className="spinner-sm"></div>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Сертифікат</span>
                      </>
                    )}
                  </button>

                </div>
              );
            })}
          </div>
        </>
      )}

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
            <CourseCard 
               key={course._id || course.id} 
               course={course} 
               onFavoriteToggle={handleFavoriteUpdate} /* ДОДАНО */
            />
          ))
        )}
      </div>

      {/* ПРИХОВАНИЙ КОМПОНЕНТ СЕРТИФІКАТА ДЛЯ ГЕНЕРАЦІЇ */}
      {activeCertificateData && (
        <Certificate
          studentName={activeCertificateData.studentName}
          courseTitle={activeCertificateData.courseTitle}
          score={activeCertificateData.score}
          date={activeCertificateData.date}
          certificateId={activeCertificateData.certificateId}
          isHidden={true}
        />
      )}

    </div>
  );
};

export default MyLibrary;
// --- END OF FILE MyLibrary.js ---