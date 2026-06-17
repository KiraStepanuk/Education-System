import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer/Footer';
import { API_URL } from '../config';
import './CourseEditor.css';

const CATEGORIES = [
  "IT та Програмування",
  "Дизайн та UX/UI",
  "Бізнес та Менеджмент",
  "Маркетинг",
  "Фізико-математичні науки",
  "Вивчення мов",
  "Психологія",
  "Мистецтво та Гуманітарні науки",
  "Здоров'я та Фітнес",
  "Особистий розвиток"
];

const CourseEditor = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetch(`${API_URL}/courses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || '');
          setCategory(data.category || CATEGORIES[0]);
          setContent(data.content || '');
          setRejectReason(data.reject_reason || '');
          setImage(data.image || '');
          setLoading(false);
        })
        .catch((err) => {
          console.error('Помилка завантаження даних курсу:', err);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert('Помилка: Ви не авторизовані! Будь ласка, увійдіть в систему знову.');
      return;
    }

    const courseData = {
      title,
      category,
      content,
      image: image || '',
      author_id: user.id,
    };

    const url = isEditMode
      ? `${API_URL}/courses/${id}`
      : `${API_URL}/courses`;

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        navigate('/home');
      } else {
        alert('Помилка під час збереження курсу');
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  if (loading) return <div className="editor-loading">Завантаження...</div>;

  return (
    <div className="editor-page">
      <main className="editor-container">
        
        <div className="editor-header-row">
          <button className="back-circle-btn modern" onClick={() => navigate(-1)} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="preview-course-title">
            {isEditMode ? 'Редагування курсу' : 'Створення нового курсу'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="editor-form-card">
          
          <div className="editor-top-grid">
            <div className="course-image-preview-box" onClick={triggerFileSelect}>
              {image ? (
                <img src={image} alt="Preview" className="editor-preview-img" />
              ) : (
                <div className="empty-image-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginBottom: '8px'}}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  <br />Завантажити обкладинку
                </div>
              )}
            </div>

            <input 
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageChange}
            />
            
            <div className="editor-inputs">
              <div className="input-group">
                <label>Назва курсу</label>
                <input
                  type="text"
                  className="course-title-input"
                  placeholder="Введіть назву, наприклад: Основи Python"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Категорія</label>
                <select 
                  className="course-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isEditMode && rejectReason && (
            <div className="rejection-notice">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <div className="rejection-text-content">
                <p><strong>Відхилено модератором:</strong> {rejectReason}</p>
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Текст курсу (зміст)</label>
            <textarea
              className="course-content-textarea"
              placeholder="Розпишіть детальну інформацію про ваш курс..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="editor-actions">
            <button type="submit" className="btn-submit-course">
              Відправити на перевірку
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CourseEditor;