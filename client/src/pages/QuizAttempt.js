// --- START OF FILE QuizAttempt.js ---
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './QuizAttempt.css';

const QuizAttempt = ({ user }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0); 
  const [answers, setAnswers] = useState({}); 
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0); 

  useEffect(() => {
    fetch(`${API_URL}/api/courses/${courseId}/quiz`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setQuiz(data);
          setTimeLeft(data.timeLimit * 60); 
        }
      })
      .catch(console.error);
  }, [courseId]);

  useEffect(() => {
    if (!quiz) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [quiz]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optionIndex) => {
    setAnswers({ ...answers, [currentQIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentQIndex < quiz.questions.length - 1) setCurrentQIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1);
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQIndex)) newFlagged.delete(currentQIndex);
    else newFlagged.add(currentQIndex);
    setFlagged(newFlagged);
  };

  const handleFinish = async () => {
    const confirm = window.confirm("Ви впевнені, що хочете завершити тест та відправити результати?");
    if (!confirm) return;

    if (!user) {
      alert("Будь ласка, авторизуйтесь для збереження результатів.");
      navigate(`/courses/${courseId}`);
      return;
    }

    const formattedAnswers = Object.keys(answers).map(qIdx => {
      const selectedNumber = answers[qIdx];
      const selectedLetter = String.fromCharCode(65 + selectedNumber); 
      return {
        questionIndex: parseInt(qIdx),
        selectedLetter: selectedLetter
      };
    });

    try {
      const timeSpent = (quiz.timeLimit * 60) - timeLeft; // Рахуємо витрачений час

      const response = await fetch(`${API_URL}/api/quizzes/${quiz._id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user_id': user?.id || user?._id 
        },
        body: JSON.stringify({
          answers: formattedAnswers,
          timeSpent: timeSpent
        })
      });

      const data = await response.json();
      if (response.ok) {
        // Замість alert робимо навігацію і передаємо state
        navigate(`/quiz-results/${courseId}`, { state: { result: data, timeSpent } });
      } else {
        alert("Помилка відправки результатів: " + data.error);
        navigate(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error(error);
      alert("Не вдалося відправити результати.");
      navigate(`/courses/${courseId}`);
    }
  };

  if (!quiz) return <div style={{padding: 40}}>Завантаження тесту...</div>;

  const currentQuestion = quiz.questions[currentQIndex];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressOffset = `${100 - (answeredCount / totalQuestions) * 100}%`;

  const FlagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={flagged.has(currentQIndex) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  );

  return (
    <div className="quiz-page-container">
      <header className="quiz-header">
        <div className="quiz-header-left" style={{ flex: 1, marginRight: '40px' }}>
          <div className="quiz-title-wrapper" style={{ width: '100%', minWidth: '150px' }}>
            <div className="quiz-progress-line" style={{ left: 0, right: progressOffset }}></div>
          </div>
        </div>

        <div className="quiz-header-right">
          <div className="quiz-timer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {formatTime(timeLeft)} залишилося
          </div>
          <button className="btn-finish-attempt" onClick={handleFinish}>Завершити спробу</button>
        </div>
      </header>

      <main className="quiz-main-content">
        <aside className="quiz-sidebar">
          <div className="quiz-progress-card">
            <h3 className="quiz-progress-title">ПРОГРЕС ТЕСТУ</h3>
            <div className="question-grid">
              {quiz.questions.map((_, idx) => {
                let statusClass = "remaining";
                if (idx === currentQIndex) statusClass = "current";
                else if (answers[idx] !== undefined) statusClass = "answered";
                const isFlagged = flagged.has(idx) ? "flagged" : "";
                return (
                  <div className="q-node-wrapper" key={idx}>
                    <div className={`q-node ${statusClass} ${isFlagged}`} onClick={() => setCurrentQIndex(idx)}>
                      {idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="progress-legend">
              <div className="legend-item"><span className="legend-dot answered"></span> Відповів(ла)</div>
              <div className="legend-item"><span className="legend-dot current"></span> Поточне</div>
              <div className="legend-item"><span className="legend-dot remaining"></span> Залишилось</div>
            </div>
          </div>
          <div className="pro-tip-card">
            <h4>Порада</h4>
            <p>"{quiz.description || 'Уважно читайте питання перед тим як дати відповідь. Удачі!'}"</p>
          </div>
        </aside>

        <div className="quiz-question-area">
          <div className="question-header-card">
            <div className="q-header-top">
              <h2 className="q-number-indicator">Питання {currentQIndex + 1} з {totalQuestions}</h2>
              <button className={`btn-flag ${flagged.has(currentQIndex) ? 'active' : ''}`} onClick={toggleFlag}>
                <FlagIcon /> Позначити
              </button>
            </div>
            <h1 className="question-text">{currentQuestion.text}</h1>
          </div>

          <div className="options-list">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = answers[currentQIndex] === idx;
              return (
                <div key={idx} className={`option-card ${isSelected ? 'selected' : ''}`} onClick={() => handleSelectOption(idx)}>
                  <div className="custom-radio"><div className="custom-radio-inner"></div></div>
                  <span className="option-text">{optionText}</span>
                </div>
              );
            })}
          </div>

          <div className="quiz-controls">
            <button className="btn-prev" onClick={handlePrev} disabled={currentQIndex === 0}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Попереднє питання
            </button>
            
            <div className="quiz-controls-right">
              <button className="btn-skip" onClick={handleNext}>Пропустити поки що</button>
              
              {currentQIndex === totalQuestions - 1 ? (
                 <button className="btn-next" onClick={handleFinish}>
                   Завершити тест
                 </button>
              ) : (
                <button className="btn-next" onClick={handleNext}>
                  Наступне питання
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizAttempt;
// --- END OF FILE QuizAttempt.js ---