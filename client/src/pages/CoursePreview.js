import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Layout/Footer/Footer';
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
      if (response.ok) navigate('/home');
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'user_id': user?.id },
        body: JSON.stringify({ reject_reason: reason }),
      });
      if (response.ok) {
        setIsModalOpen(false);
        navigate('/home');
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
        headers: { 'user_id': user?.id }
      });
      if (response.ok) navigate('/home');
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  if (loading) return <div className="preview-loading">Завантаження...</div>;
  if (!course) return <div className="preview-error">Курс не знайдено</div>;

  const isAdmin = user?.role === 'admin';
  const isAuthor = user && course && course.author_id?.id === user.id;

  // Витягуємо дані автора
  const authorName = course.author_id ? `${course.author_id.firstName} ${course.author_id.lastName}` : 'Невідомий Автор';
  const authorAvatar = course.author_id?.avatar || 'https://via.placeholder.com/80';

  return (
    <div className="preview-page">
      <main className="preview-container">
        
        <div className="preview-header-row">
          <button className="back-circle-btn modern" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="preview-course-title">{course.title}</h1>
        </div>

        <div className="preview-rating-row">
          <span className="stars">★★★★★</span>
          <span>{course.rating || '4.8'}</span>
          <span className="reviews-count">({course.reviews || '124'} reviews)</span>
        </div>


        <div className="preview-layout">
          
          <div className="preview-left-col">
            <div className="about-course-card">
              <h2>About this course</h2>
              <div className="preview-content-body">
                {course.content ? (
                  course.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="preview-paragraph">{paragraph}</p>
                  ))
                ) : (
                  <p className="no-content-notice">Вміст курсу порожній.</p>
                )}
              </div>
              
              <div className="feedback-section">
                <p>Your feedback helps the community</p>
                <div className="feedback-stars">
                  ☆ ☆ ☆ ☆ ☆ <span className="text">Click to rate</span>
                </div>
              </div>
            </div>

            <div className="discussion-section">
              <h3>Discussion (2)</h3>

              <div className="comment-card">
                <div className="comment-header">
                  <div className="comment-user">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="Sarah" className="comment-avatar" />
                    <span className="comment-name">Sarah Benkins</span>
                  </div>
                  <span className="comment-time">2 hours ago</span>
                </div>
                <p className="comment-text">The explanation of useMemo vs useCallback was finally the one that clicked for me. Great production quality!</p>
              </div>

              <div className="comment-card">
                <div className="comment-header">
                  <div className="comment-user">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Marcus" className="comment-avatar" />
                    <span className="comment-name">Marcus Thorne</span>
                  </div>
                  <span className="comment-time">Yesterday</span>
                </div>
                <p className="comment-text">Are we going to cover Module Federation in the next section? That would be really helpful for our micro-frontend architecture.</p>
              </div>

              <div className="add-comment-card">
                <img src={user?.avatar || "https://via.placeholder.com/40"} alt="You" className="comment-avatar" style={{width: '40px', height: '40px'}} />
                <div className="comment-input-area">
                  <textarea placeholder="Share your thoughts on this lesson..."></textarea>
                  <button className="post-btn">Post Comment</button>
                </div>
              </div>
            </div>
          </div>

          <div className="preview-right-col">
            <div className="sidebar-image-card">
              <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'} alt={course.title} className="sidebar-course-img" />
              
              <div className="sidebar-category">
                <label>Категорія курсу:</label>
                <div className="category-badge">
                  {course.category || 'Без категорії'}
                </div>
              </div>
            </div>

            {isAdmin && course.status === 'pending' && (
              <div className="actions-card">
                <h4>Дії Модератора:</h4>
                <div className="actions-buttons">
                  <button className="btn-primary-action" onClick={handleApprove}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Схвалити
                  </button>
                  <button className="btn-secondary-action" onClick={() => setIsModalOpen(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                    Відхилити
                  </button>
                </div>
              </div>
            )}

            {isAuthor && (
              <div className="actions-card">
                <h4>Дії Автора:</h4>
                <div className="actions-buttons">
                  <button className="btn-primary-action" onClick={() => navigate(`/edit-course/${course.id}`)}>
                    Редагувати
                  </button>
                  <button className="btn-secondary-action" onClick={handleDelete}>
                    Видалити
                  </button>
                </div>
              </div>
            )}

            <div className="author-card">
              <div style={{display: 'inline-block', position: 'relative'}}>
                <img src={authorAvatar} alt="Author" className="author-card-avatar" />
                <div className="author-verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
              </div>
              <h3>{authorName}</h3>
              <p>Автор</p>
              <button className="view-profile-btn">View Profile</button>
            </div>

            <div className="share-card">
              <span>Share course:</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </div>

          </div>
        </div>
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