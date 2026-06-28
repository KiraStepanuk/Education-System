/* --- START OF FILE TestCreator.js --- */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';
import './TestCreator.css';

const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

const TestCreator = ({ user }) => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Налаштування тесту
  const [testSettings, setTestSettings] = useState({
    title: '',
    description: '',
    timeLimit: 45,
    passingScore: 60
  });

  // Локальні стани для AI генерації та назви курсу
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [courseTitle, setCourseTitle] = useState('Завантаження...');

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

  // Завантаження існуючого тесту та інформації про курс
  useEffect(() => {
    // Отримуємо назву курсу
    fetch(`${API_URL}/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.title) {
          setCourseTitle(data.title);
        } else {
          setCourseTitle('Невідомий курс');
        }
      })
      .catch(err => console.error("Помилка завантаження курсу", err));

    // Отримуємо сам тест
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

  // --- ОБРОБНИК АВТОМАТИЧНОЇ ГЕНЕРАЦІЇ ШІ ---
  const handleGenerateAI = async () => {
    if (!user) {
      alert("Необхідна авторизація.");
      return;
    }
    if (aiQuestionCount < 3 || aiQuestionCount > 10) {
      alert("Кількість питань має бути від 3 до 10.");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/quiz/generate-ai`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user_id': user?.id || user?._id
        },
        body: JSON.stringify({ questionCount: aiQuestionCount })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const formattedAIQuestions = data.questions.map((q, idx) => ({
          id: idx + 1,
          text: q.text,
          correctLetter: q.correctLetter,
          options: q.options.map((optText, i) => ({
            letter: optionLetters[i] || String.fromCharCode(65 + i),
            text: optText
          }))
        }));
        
        setQuestions(formattedAIQuestions);
        alert('Питання успішно згенеровано! Тепер ви можете переглянути та відредагувати їх перед збереженням.');
      } else {
        alert("Помилка генерації: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Помилка з'єднання з сервером під час генерації.");
    } finally {
      setAiLoading(false);
    }
  };

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
        return { ...q, options: [...q.options, { letter: nextLetter, text: '' }] };
      }
      return q;
    }));
  };

  const handleRemoveOption = (qId, letterToRemove) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        if (q.options.length <= 2) {
          alert("Питання має містити мінімум 2 варіанти відповіді.");
          return q;
        }
        
        // Видаляємо вибраний варіант
        const filteredOptions = q.options.filter(o => o.letter !== letterToRemove);
        
        // Перепризначаємо букви (A, B, C...) по порядку
        const updatedOptions = filteredOptions.map((o, idx) => ({
          ...o,
          letter: optionLetters[idx]
        }));
        
        // Якщо видалили правильну відповідь, робимо першу відповідь правильною
        let newCorrectLetter = q.correctLetter;
        if (!updatedOptions.find(o => o.letter === newCorrectLetter)) {
          newCorrectLetter = updatedOptions[0].letter;
        }
        
        return { ...q, options: updatedOptions, correctLetter: newCorrectLetter };
      }
      return q;
    }));
  };

  const handleAddQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
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

  const handleRemoveQuestion = (qId) => {
    if (questions.length === 1) {
      alert("У тесті має бути щонайменше 1 питання.");
      return;
    }
    if (window.confirm("Видалити це питання?")) {
      setQuestions(questions.filter(q => q.id !== qId));
    }
  };

  const handlePublish = async () => {
    if (!user) return alert('Будь ласка, увійдіть в систему.');

    const payloadQuestions = questions.map(q => ({
      text: q.text,
      options: q.options.map(opt => opt.text),
      correctLetter: q.correctLetter
    }));

    const payload = { ...testSettings, questions: payloadQuestions };

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

  if (loading) return <div style={{padding: 40}}>Завантаження конструктора...</div>;

  return (
    <div className="creator-page-wrapper">
      <div className="creator-container">

        {/* Шапка конструктора з кнопкою Назад */}
        <header className="creator-header-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="back-circle-btn modern" onClick={() => navigate(-1)} type="button" title="Назад">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="creator-page-title">Конструктор тесту</h1>
          </div>
          
          <div className="creator-header-actions">
            <button className="btn-publish" onClick={handlePublish}>Опублікувати тест</button>
          </div>
        </header>

        {/* СЕКЦІЯ 0: ШІ ГЕНЕРАТОР */}
        <section className="creator-card ai-generator-card">
          <div className="creator-card-header ai-header">
             <span className="ai-sparkle">✨</span> Автоматична генерація ШІ
          </div>
          <p className="ai-desc">Система Google Gemini проаналізує зміст вашого курсу та автоматично створить релевантні питання з варіантами відповідей.</p>
          <div className="ai-controls">
            <div className="creator-input-group" style={{ width: '220px', marginBottom: 0 }}>
              <label>Кількість питань (3-10)</label>
              <input
                type="number"
                min="3"
                max="10"
                className="creator-input"
                value={aiQuestionCount}
                onChange={(e) => setAiQuestionCount(Number(e.target.value))}
              />
            </div>
            <button className="btn-generate-ai" onClick={handleGenerateAI} disabled={aiLoading}>
              {aiLoading ? <div className="loading-spinner-sm"></div> : 'Згенерувати'}
            </button>
          </div>
        </section>

        {/* СЕКЦІЯ 1: НАЛАШТУВАННЯ ТЕСТУ */}
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* СЕКЦІЯ 2: СПИСОК ПИТАНЬ */}
        {questions.map((question, index) => (
          <section className="creator-card question-card" key={question.id}>
            <div className="question-card-title-bar">
              <h3>Питання №{index + 1}</h3>
              <button className="btn-remove-question" onClick={() => handleRemoveQuestion(question.id)}>
                Видалити
              </button>
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
                <label>Варіанти відповідей (натисніть на кружок, щоб вказати правильну)</label>
                <div className="options-container">
                  {question.options.map((opt) => (
                    <div className="option-edit-row" key={opt.letter}>
                      <div 
                        className={`radio-selector ${question.correctLetter === opt.letter ? 'active' : ''}`}
                        onClick={() => handleSelectCorrect(question.id, opt.letter)}
                      >
                        <div className="radio-selector-inner"></div>
                      </div>
                      <div className="option-input-box">
                        <div className="option-letter-badge">{opt.letter}</div>
                        <input 
                          type="text" 
                          className="option-text-input" 
                          placeholder="Додати текст відповіді..."
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(question.id, opt.letter, e.target.value)}
                        />
                        {/* Кнопка видалення конкретного варіанту */}
                        <button 
                          type="button" 
                          className="btn-remove-option-inline"
                          onClick={() => handleRemoveOption(question.id, opt.letter)}
                          title="Видалити варіант"
                        >
                          &times;
                        </button>
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

        {/* СЕКЦІЯ 3: КНОПКА ДОДАННЯ НОВОГО ПИТАННЯ */}
        <button className="btn-dashed-add-question" onClick={handleAddQuestion}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Додати питання вручну</span>
        </button>

        {/* Нижня загальна панель дій (кнопку "Опублікувати тест" видалено звідси) */}
        <footer className="creator-bottom-actions">
          <button className="btn-cancel" onClick={() => navigate(-1)}>Відмінити зміни</button>
        </footer>

      </div>
    </div>
  );
};

export default TestCreator;