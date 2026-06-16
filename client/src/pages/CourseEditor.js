import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import SectionHeading from '../components/UI/SectionHeading/SectionHeading';
import Button from '../components/UI/Button/Button';
import { API_URL } from '../config';
import './CourseEditor.css';

const CourseEditor = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  let userRoleText = 'Гість';
  if (user) {
    if (user.role === 'admin') userRoleText = 'Адмін';
    else if (user.role === 'user') userRoleText = 'Користувач';
  }

  useEffect(() => {
    if (isEditMode) {
      fetch(`${API_URL}/courses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || '');
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

  if (loading) {
    return <div className="editor-loading">Завантаження...</div>;
  }

  return (
    <div className="editor-page">
      <Header role={userRoleText} />
      
      <main className="editor-container">
        <div className="editor-header-row">
          <button className="back-circle-btn" onClick={() => navigate(-1)}>
            ←
          </button>
          <SectionHeading text={isEditMode ? 'Редагування курсу' : 'Створення курсу'} />
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-top-section">
            
            <div className="course-image-preview-box" onClick={triggerFileSelect}>
              {image ? (
                <>
                  <img src={image} alt="Preview" className="editor-preview-img" />
                </>
              ) : (
                <div className="empty-image-placeholder">
                  <span>Зображення</span>
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
            
            <div className="course-title-input-container">
              <input
                type="text"
                className="course-title-input"
                placeholder="Введіть назву курсу..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {isEditMode && rejectReason && (
            <div className="rejection-notice">
              <p className="rejection-label">Причина відхилення від модератора:</p>
              <p className="rejection-text">{rejectReason}</p>
            </div>
          )}

          <div className="editor-content-section">
            <textarea
              className="course-content-textarea"
              placeholder="Склад курсу..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="editor-actions">
            <Button 
              text="Відправити на перевірку" 
              variant="red" 
              type="submit" 
            />
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CourseEditor;