/* --- START OF FILE QuizResults.js --- */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './QuizResults.css';

// Імпорт зображення кубка з папки assets за вказаним шляхом
import celebratoryVisual from './assets/Celebratory Visual.png';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState("Завантаження...");
  const [isDownloading, setIsDownloading] = useState(false);

  // Отримуємо дані з роутера
  const resultData = location.state?.result;
  const timeSpentSeconds = location.state?.timeSpent || 0;

  useEffect(() => {
    // Завантажуємо назву курсу
    fetch(`${API_URL}/courses/${courseId}`)
      .then(res => res.json())
      .then(data => setCourseTitle(data.title || "Невідомий курс"))
      .catch(console.error);
  }, [courseId]);

  if (!resultData) {
    return (
      <div className="results-page-wrapper">
        <div className="results-card">
          <h2>Дані результатів не знайдено</h2>
          <button className="results-btn-primary" onClick={() => navigate(`/courses/${courseId}`)}>
            Повернутися до курсу
          </button>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, percent, isPassed } = resultData;
  const mistakes = totalQuestions - score;

  // Форматування часу (з секунд у хв:сек)
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m} хв ${s} сек`;
  };

  const handleGetCertificate = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Ваш сертифікат успішно згенеровано та завантажено!');
    }, 2000);
  };

  const handleRetake = () => {
    navigate(`/take-test/${courseId}`);
  };

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className={`results-page-wrapper ${!isPassed ? 'failed' : ''}`}>
      <div className="results-card">
        
        {/* Контейнер візуалізації успіху/помилки з анімацією */}
        <div className={`results-visual-container ${!isPassed ? 'failed-circle' : 'passed-visual'}`}>
          {isPassed ? (
            <img 
              src={celebratoryVisual} 
              alt="Celebratory Trophy" 
              className="results-trophy-img" 
            />
          ) : (
            <div className="failed-cross-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
          )}
        </div>

        {/* Заголовки */}
        <h1 className="results-title animated-fade-in-up delay-1">
          {isPassed ? 'Вітаємо! Ви успішно склали тест' : 'На жаль, тест не складено'}
        </h1>
        <p className="results-subtitle animated-fade-in-up delay-2">
          Ваш результат: <strong>{score}/{totalQuestions}</strong> правильних відповідей ({mistakes} {mistakes === 1 ? 'помилка' : mistakes > 1 && mistakes < 5 ? 'помилки' : 'помилок'})
        </p>

        {/* Картки з результатом та прогресом */}
        <div className="results-stats-grid animated-fade-in-up delay-3">
          <div className={`results-stat-box ${!isPassed ? 'failed-box' : ''}`}>
            <span className="results-stat-label">Прогрес</span>
            <span className="results-stat-value">{percent}%</span>
            <div className="results-progress-container">
              <div 
                className={`results-progress-bar-animated ${!isPassed ? 'failed-bar' : ''}`} 
                style={{ '--target-width': `${percent}%` }}
              ></div>
            </div>
          </div>

          <div className="results-stat-box">
            <span className="results-stat-label">Час проходження</span>
            <span className="results-stat-value">{formatTime(timeSpentSeconds)}</span>
          </div>
        </div>

        {/* Блок зворотного зв'язку */}
        <div className="results-feedback-box animated-fade-in-up delay-4">
          <p className="results-feedback-text">
            {isPassed 
              ? `"Ви продемонстрували хороше розуміння теми «${courseTitle}». Продовжуйте в тому ж дусі!"` 
              : `"Вам потрібно набрати вищий бал, щоб успішно скласти тест з курсу «${courseTitle}». Рекомендуємо переглянути матеріал ще раз."`
            }
          </p>
        </div>

        {/* Кнопка отримання сертифіката (лише при успіху) */}
        {isPassed && (
          <button 
            className="results-btn-primary animated-fade-in-up delay-5" 
            onClick={handleGetCertificate}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <div className="loading-spinner"></div>
                Завантаження...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
                Отримати сертифікат
              </>
            )}
          </button>
        )}

        {/* Нижня панель дій */}
        <div className="results-actions-row animated-fade-in-up delay-5">
          <button className="results-btn-outline" onClick={handleRetake}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Пройти тест ще раз
          </button>

          <button className="results-link-back" onClick={handleBackToCourse}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="results-link-text">Повернутися до курсу</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuizResults;
/* --- END OF FILE QuizResults.js --- */