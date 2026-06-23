/* --- START OF FILE QuizResults.js --- */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizResults.css';

const QuizResults = ({ 
  score = 9, 
  totalQuestions = 10, 
  timeSpent = "12:45", 
  courseName = "Основи нейронних мереж" 
}) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Розрахунок показників
  const percent = Math.round((score / totalQuestions) * 100);
  const mistakes = totalQuestions - score;

  // Симуляція завантаження сертифіката
  const handleGetCertificate = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Ваш сертифікат успішно згенеровано та завантажено!');
    }, 2000);
  };

  const handleRetake = () => {
    navigate('/test-quiz'); // Навігація на сторінку тесту
  };

  const handleBackToCourse = () => {
    navigate('/home'); // Навігація на головну або сторінку курсу
  };

  return (
    <div className="results-page-wrapper">
      <div className="results-card">
        
        {/* Іконка кубка */}
        <div className="results-trophy-circle">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"></path>
            <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"></path>
          </svg>
        </div>

        {/* Заголовки */}
        <h1 className="results-title">Вітаємо! Ви успішно пройшли тест</h1>
        <p className="results-subtitle">
          Ваш результат: <strong>{score}/{totalQuestions}</strong> правильних відповідей ({mistakes} {mistakes === 1 ? 'помилка' : 'помилки'})
        </p>

        {/* Картки з результатом та прогресом */}
        <div className="results-stats-grid">
          
          <div className="results-stat-box">
            <span className="results-stat-label">Прогрес</span>
            <span className="results-stat-value">{percent}%</span>
            <div className="results-progress-container">
              <div className="results-progress-bar" style={{ width: `${percent}%` }}></div>
            </div>
          </div>

          <div className="results-stat-box">
            <span className="results-stat-label">Час проходження</span>
            <span className="results-stat-value">{timeSpent}</span>
          </div>

        </div>

        {/* Фідбек система */}
        <div className="results-feedback-box">
          <p className="results-feedback-text">
            "Ви продемонстрували глибоке розуміння теми «{courseName}». Лише одна помилка 
            відділяє вас від досконалості — перегляньте модуль про зворотне поширення помилки, 
            щоб закріпити знання."
          </p>
        </div>

        {/* Основна кнопка отримання сертифіката */}
        <button 
          className="results-btn-primary" 
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

        {/* Нижня панель кнопок */}
        <div className="results-actions-row">
          
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