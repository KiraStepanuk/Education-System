import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import Button from '../components/UI/Button/Button';
import RejectModal from '../components/Unique/RejectModal/RejectModal';
import './CoursePreview.css';

const CoursePreview = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/courses/${id}`)
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
      const response = await fetch(`http://localhost:5000/courses/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        navigate('/home');
      } else {
        alert('Помилка при погодженні курсу');
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const response = await fetch(`http://localhost:5000/courses/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectReason: reason }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        navigate('/home');
      } else {
        alert('Помилка при відхиленні курсу');
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  if (loading) {
    return <div className="preview-loading">Завантаження...</div>;
  }

  if (!course) {
    return <div className="preview-error">Курс не знайдено</div>;
  }

  const isAdmin = user?.role === 'admin';

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