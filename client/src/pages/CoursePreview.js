import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import Button from '../components/UI/Button/Button';
import RejectModal from '../components/Unique/RejectModal/RejectModal';
import { API_URL } from '../config';
import './CoursePreview.css';

const CoursePreview = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Помилка завантаження курсу:', err);
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}/approve`, {
        method: 'PUT',
        headers: {
          'user_id': user?.id
        }
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(`Помилка при погодженні курсу: ${errorData.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user_id': user?.id
        },
        body: JSON.stringify({ reject_reason: reason }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(`Помилка при відхиленні курсу: ${errorData.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

const handleDelete = async () => {
  const confirmDelete = window.confirm("Ви впевнені, що хочете видалити цей курс?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'user_id': user?.id
      }
    });

    if (response.ok) {
      navigate('/home');
    } else {
      const data = await response.json();
      alert(data.error || "Помилка при видаленні курсу");
    }
  } catch (error) {
    console.error("Помилка при видаленні:", error);
  }
};

  if (loading) {
    return <div className="preview-loading">Завантаження...</div>;
  }

  if (!course) {
    return <div className="preview-error">Курс не знайдено</div>;
  }

  const isAdmin = user?.role === 'admin';
  const isAuthor = user && course && course.author_id === user.id;

  return (
    <div className="preview-page">
      <Header role={isAdmin ? 'Адмін' : 'Користувач'} />

      <main className="preview-container">
        <div className="preview-header-row">
          <button className="back-circle-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <div className="preview-main-info">
            <div className="preview-image-box">
              {course.image ? (
                <img src={course.image} alt={course.title} className="preview-course-img" />
              ) : (
                <div className="preview-image-placeholder">Зображення</div>
              )}
            </div>
            
            <div className="preview-title-actions-container">
              <h1 className="preview-course-title">{course.title}</h1>

              {isAdmin && course.status === 'pending' && (
                <div className="preview-moderator-actions">
                  <Button 
                    text="Погодити" 
                    variant="blue" 
                    onClick={handleApprove} 
                  />
                  <Button 
                    text="Відхилити" 
                    variant="red" 
                    onClick={() => setIsModalOpen(true)} 
                  />
                </div>
              )}

              {isAuthor && (
                <div className="preview-author-actions">
                  <Button 
                    text="Редагувати" 
                    variant="blue" 
                    onClick={() => navigate(`/edit-course/${course.id}`)} 
                  />
                  <Button 
                    text="Видалити" 
                    variant="red" 
                    onClick={handleDelete} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <article className="preview-content-body">
          {course.content ? (
            course.content.split('\n').map((paragraph, index) => (
              <p key={index} className="preview-paragraph">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="no-content-notice">Вміст курсу порожній.</p>
          )}
        </article>
      </main>

      <RejectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleRejectConfirm} 
      />

      <Footer />
    </div>
  );
};

export default CoursePreview;