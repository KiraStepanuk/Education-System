/* --- START OF FILE TestCreator.js --- */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './TestCreator.css';

const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const TestCreator = ({ user }) => {
  const navigate = useNavigate();
  const { courseId } = useParams(); // Отримуємо ID курсу з URL

  // Налаштування тесту
  const [testSettings, setTestSettings] = useState({
    title: '',
    description: '',
    timeLimit: 45,
    passingScore: 60
  });

  // Список питань
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: [
        { letter: 'A', text: '' },
        { letter: 'B', text: '' }
      ],
      correctLetter: 'A'
    }
  ]);

  const [loading, setLoading] = useState(true);

  // Завантаження існуючого тесту при відкритті (якщо є)
  useEffect(() => {
    fetch(`${API_URL}/api/courses/${courseId}/quiz`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && data._id) {
          setTestSettings({
            title: data.title || '',
            description: data.description || '',
            timeLimit: data.timeLimit || 45,
            passingScore: data.passingScore || 60
          });
          
          if (data.questions && data.questions.length > 0) {
            const formattedQuestions = data.questions.map((q, idx) => ({
              id: idx + 1,
              text: q.text,
              correctLetter: q.correctLetter,
              options: q.options.map((optText, i) => ({ 
                letter: optionLetters[i] || String.fromCharCode(65 + i), 
                text: optText 
              }))
            }));
            setQuestions(formattedQuestions);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка завантаження тесту", err);
        setLoading(false);
      });
  }, [courseId]);

  // Обробники налаштувань
  const handleSettingChange = (field, value) => {
    setTestSettings({ ...testSettings, [field]: value });
  };

  // Обробники питань
  const handleQuestionTextChange = (id, val) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text: val } : q));
  };

  const handleOptionTextChange = (qId, oLetter, val) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const updatedOptions = q.options.map(o => o.letter === oLetter ? { ...o, text: val } : o);
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };

  const handleSelectCorrect = (qId, letter) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctLetter: letter } : q));
  };

  const handleAddOption = (qId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (q.options.length >= optionLetters.length) return q;
        const nextLetter = optionLetters[q.options.length];
        return {
          ...q,
          options: [...q.options, { letter: nextLetter, text: '' }]
        };
      }
      return q;
    }));
  };

  const handleAddQuestion = () => {
    const newId = questions.length + 1;
    const newQuestion = {
      id: newId,
      text: '',
      options: [
        { letter: 'A', text: '' },
        { letter: 'B', text: '' },
        { letter: 'C', text: '' },
        { letter: 'D', text: '' }
      ],
      correctLetter: 'A'
    };
    setQuestions([...questions, newQuestion]);
  };

  // Експорт та збереження фінального об'єкту
  const handlePublish = async () => {
    if (!user) {
      alert('Будь ласка, увійдіть в систему.');
      return;
    }

    // Перетворюємо дані під схему Mongoose (варіанти як масив рядків)
    const payloadQuestions = questions.map(q => ({
      text: q.text,
      options: q.options.map(opt => opt.text),
      correctLetter: q.correctLetter
    }));

    const payload = {
      ...testSettings,
      questions: payloadQuestions
    };

    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/quiz`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user_id': user?.id || user?._id 
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(`Тест «${testSettings.title || 'Новий тест'}» успішно збережено!`);
        navigate('/publications');
      } else {
        alert('Помилка при збереженні тесту: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Не вдалося з\'єднатися з сервером');
    }
  };

  const handleSaveDraft = () => {
    alert("Конструктор: Тест збережено у чернетку (локально).");
  };

  if (loading) return <div style={{padding: 40}}>Завантаження конструктора...</div>;

  return (
    <div className="creator-page-wrapper">
      <div className="creator-container">
        
        {/* Хлібні крихти */}
        <div className="breadcrumbs">
          <span>Мої видання</span>
          <span>&gt;</span>
          <span>Назва курсу</span>
          <span>&gt;</span>
          <span className="active">Конструктор тесту</span>
        </div>

        {/* Шапка конструктора */}
        <header className="creator-header-row">
          <h1 className="creator-page-title">Конструктор тесту</h1>
          <div className="creator-header-actions">
            <button className="btn-save-draft" onClick={handleSaveDraft}>Зберегти як чернетку</button>
            <button className="btn-publish" onClick={handlePublish}>Опублікувати тест</button>
          </div>
        </header>

        {/* --- СЕКЦІЯ 1: НАЛАШТУВАННЯ ТЕСТУ --- */}
        <section className="creator-card">
          <div className="creator-card-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Налаштування тесту
          </div>

          <div className="creator-input-group">
            <label>Назва тесту</label>
            <input 
              type="text" 
              className="creator-input"
              placeholder="Наприклад: Основи квантової фізики" 
              value={testSettings.title}
              onChange={(e) => handleSettingChange('title', e.target.value)}
            />
          </div>

          <div className="creator-input-group">
            <label>Опис тесту</label>
            <textarea 
              className="creator-textarea"
              placeholder="Опишіть, що перевіряє цей тест..." 
              value={testSettings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
            />
          </div>

          <div className="creator-inputs-row">
            
            <div className="creator-input-group">
              <label>Час на проходження (хв)</label>
              <div className="icon-input-wrapper">
                <input 
                  type="number" 
                  className="creator-input" 
                  value={testSettings.timeLimit}
                  onChange={(e) => handleSettingChange('timeLimit', Number(e.target.value))}
                />
                <span className="input-inline-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
              </div>
            </div>

            <div className="creator-input-group">
              <label>Прохідний бал (%)</label>
              <div className="icon-input-wrapper">
                <input 
                  type="number" 
                  className="creator-input" 
                  value={testSettings.passingScore}
                  onChange={(e) => handleSettingChange('passingScore', Number(e.target.value))}
                />
                <span className="input-inline-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* --- СЕКЦІЯ 2: СПИСОК ПИТАНЬ (ДИНАМІЧНИЙ) --- */}
        {questions.map((question, index) => (
          <section className="creator-card question-card" key={question.id}>
            
            <div className="question-card-title-bar">
              <h3>Питання №{index + 1}</h3>
            </div>

            <div className="question-card-body">
              
              <div className="creator-input-group">
                <label>Текст питання</label>
                <textarea 
                  className="creator-textarea"
                  placeholder="Введіть ваше запитання тут..." 
                  value={question.text}
                  onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                />
              </div>

              <div className="creator-input-group">
                <label>Варіанти відповідей</label>
                <div className="options-container">
                  {question.options.map((opt) => (
                    <div className="option-edit-row" key={opt.letter}>
                      
                      {/* Радіо селектор вибору правильної відповіді */}
                      <div 
                        className={`radio-selector ${question.correctLetter === opt.letter ? 'active' : ''}`}
                        onClick={() => handleSelectCorrect(question.id, opt.letter)}
                      >
                        <div className="radio-selector-inner"></div>
                      </div>

                      {/* Текстовий інпут з бейджем */}
                      <div className="option-input-box">
                        <div className="option-letter-badge">{opt.letter}</div>
                        <input 
                          type="text" 
                          className="option-text-input" 
                          placeholder="Додати текст відповіді..."
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(question.id, opt.letter, e.target.value)}
                        />
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              <div className="question-card-footer">
                <button className="btn-add-option" onClick={() => handleAddOption(question.id)}>
                  <span>⊕</span> Додати варіант
                </button>
                
                <div className="question-type-dropdown">
                  <span>Тип: Одна правильна відповідь</span>
                  <span className="icon-more-vertical">⋮</span>
                </div>
              </div>

            </div>
          </section>
        ))}

        {/* --- СЕКЦІЯ 3: КНОПКА ДОДАННЯ НОВОГО ПИТАННЯ --- */}
        <button className="btn-dashed-add-question" onClick={handleAddQuestion}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Додати нове питання</span>
        </button>

        {/* Нижня загальна панель дій */}
        <footer className="creator-bottom-actions">
          <button className="btn-cancel" onClick={() => navigate(-1)}>Відмінити зміни</button>
          <button className="btn-publish" onClick={handlePublish}>Опублікувати тест</button>
        </footer>

      </div>
    </div>
  );
};

export default TestCreator;