import React from 'react';
import './Certificate.css';

const Certificate = ({
  studentName,
  courseTitle,
  score,
  date,
  certificateId,
  isHidden = true
}) => {
  return (
    <div className={`certificate-wrapper ${isHidden ? 'hidden' : ''}`} id="certificate-template">
      <div className="certificate-inner-border">
        
        {/* Верхня частина: Логотип */}
        <div className="certificate-header">
          <div className="certificate-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#5a5ce5" />
              <path d="M2 17L12 22L22 17" stroke="#5a5ce5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#5a5ce5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-brand-text">Education-System</span>
          </div>
        </div>

        {/* Головний блок заголовків */}
        <div className="certificate-title-section">
          <h1 className="certificate-main-title">СЕРТИФІКАТ ПРО ЗАВЕРШЕННЯ</h1>
          <div className="title-accent-line"></div>
          <p className="certificate-subtitle">Цим підтверджується, що</p>
        </div>

        {/* Ім'я студента */}
        <div className="certificate-recipient">
          <h2 className="recipient-name">{studentName || 'Ім\'я Фамилія'}</h2>
        </div>

        {/* Інформація про успішне проходження курсу */}
        <div className="certificate-course-section">
          <p className="course-prefix">успішно завершив(ла) курс навчання за програмою:</p>
          <h3 className="course-title">{courseTitle || 'Назва Навчального Курсу'}</h3>
        </div>

        {/* Середня частина: Результати (Три колонки) */}
        <div className="certificate-stats-row">
          <div className="stats-col">
            <span className="stats-label">Результат тесту</span>
            <span className="stats-value">{score || '0%'}</span>
          </div>
          <div className="stats-col">
            <span className="stats-label">Дата видачі</span>
            <span className="stats-value">{date || 'ДД.ММ.РРРР'}</span>
          </div>
          <div className="stats-col">
            <span className="stats-label">ID Сертифіката</span>
            <span className="stats-value">{certificateId || 'ID-PLACEHOLDER'}</span>
          </div>
        </div>

        {/* Нижня частина: Підписи та печатка */}
        <div className="certificate-footer">
          
          {/* Підпис 1 (Засновник) */}
          <div className="signature-block">
            <span className="signature-font">Dr. Alan Turing</span>
            <div className="signature-line"></div>
            <span className="signature-name">Д-р Алан Тюрінг</span>
            <span className="signature-title">Засновник ScholarSync</span>
          </div>

          {/* Офіційна печатка */}
          <div className="seal-block">
            <div className="seal-dotted-circle">
              <div className="seal-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '4px' }}>
                  <path d="M9 12L11 14L15 10" stroke="#5a5ce5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#5a5ce5" strokeWidth="2" />
                </svg>
                <span className="seal-text">OFFICIAL SEAL</span>
              </div>
            </div>
          </div>

          {/* Підпис 2 (Інструктор) */}
          <div className="signature-block">
            <span className="signature-font">Elena Masterton</span>
            <div className="signature-line"></div>
            <span className="signature-name">Олена Майстертон</span>
            <span className="signature-title">Провідний інструктор</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Certificate;