import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill-new/dist/quill.snow.css';
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

  // Стани для коментарів
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Стани для рейтингу
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');

  useEffect(() => {
    // Завантаження курсу
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

    // Завантаження коментарів
    fetch(`${API_URL}/courses/${id}/comments`)
        .then((res) => res.json())
        .then((data) => setComments(data))
        .catch((err) => console.error('Помилка завантаження коментарів:', err));
  }, [id]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}/approve`, {
        method: 'PUT',
        headers: { 'user_id': user?.id }
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

  const handlePostComment = async () => {
    if (!newComment.trim() || !user) return;

    setIsPostingComment(true);
    try {
      const response = await fetch(`${API_URL}/courses/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': user?.id
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments([addedComment, ...comments]);
        setNewComment('');
      } else {
        console.error('Не вдалося додати коментар');
      }
    } catch (error) {
      console.error('Помилка при додаванні коментаря:', error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleRate = async (ratingValue) => {
    if (!user) {
      setRatingMessage('Будь ласка, увійдіть, щоб оцінити курс.');
      return;
    }

    setIsSubmittingRating(true);
    try {
      const response = await fetch(`${API_URL}/courses/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': user?.id
        },
        body: JSON.stringify({ rating: ratingValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(prev => ({
          ...prev,
          rating: data.newAverageRating || prev.rating,
          reviews: data.newReviewsCount || prev.reviews
        }));
        setUserRating(ratingValue);
        setRatingMessage('Дякуємо за вашу оцінку!');
      } else {
        setRatingMessage('Не вдалося зберегти оцінку.');
      }
    } catch (error) {
      console.error('Помилка при відправці рейтингу:', error);
      setRatingMessage('Сталася помилка.');
    } finally {
      setIsSubmittingRating(false);
    }
  };
  
  const handleShare = () => {
    const currentUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: course?.title,
        text: 'Зверніть увагу на цей крутий курс!',
        url: currentUrl
      }).catch(err => console.error('Помилка при спробі поділитися:', err));
    } else {
      navigator.clipboard.writeText(currentUrl)
        .then(() => alert('Посилання на курс скопійовано у буфер обміну!'))
        .catch(err => console.error('Не вдалося скопіювати посилання:', err));
    }
  };

  const renderStaticStars = (rating) => {
    const validRating = Number(rating) || 0;
    return Array.from({ length: 5 }).map((_, index) => (
        <span key={index} style={{ color: index < Math.round(validRating) ? '#ffc107' : '#e4e5e9' }}>
        ★
      </span>
    ));
  };

  if (loading) return <div className="preview-loading">Завантаження...</div>;
  if (!course) return <div className="preview-error">Курс не знайдено</div>;

  const isAdmin = user?.role === 'admin';
  const isAuthor = user && course && course.author_id?.id === user.id;

  const authorName = course.author_id ? `${course.author_id.firstName} ${course.author_id.lastName}` : 'Невідомий Автор';
  const authorAvatar = course.author_id?.avatar || 'https://via.placeholder.com/80';

  return (
      <div className="preview-page">
        {/* Залізобетонний інжект стилів для фіксу перенесення слів безпосередньо у DOM */}
        <style>{`
          /* Застосовуємо правила до самого контейнера і до абсолютно кожного елемента всередині */
          .preview-content-body,
          .preview-content-body *,
          .ql-editor,
          .ql-editor * {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          /* Якщо всередині закралися теги pre або code, які намертво блокують перенесення */
          .preview-content-body pre,
          .preview-content-body code {
            white-space: pre-wrap !important;
            word-break: break-word !important;
          }

          /* Повертаємо нормальне відображення для блочних елементів */
          .preview-content-body p,
          .preview-content-body div {
            display: block !important;
            width: 100% !important;
          }
        `}</style>

        <main className="preview-container">

          <div className="preview-header-row">
            <button className="back-circle-btn modern" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <h1 className="preview-course-title">{course.title}</h1>
          </div>

          <div className="preview-rating-row">
            <span className="stars">{renderStaticStars(course.reviews > 0 ? course.rating : 0)}</span>
            <span>{course.reviews > 0 ? course.rating : '0.0'}</span>
            <span className="reviews-count">({course.reviews ?? 0} reviews)</span>
          </div>

          <div className="preview-layout">

            <div className="preview-left-col">
              <div className="about-course-card">
                <h2>About this course</h2>
                 <div className="preview-content-body ql-snow">
                   {course.content ? (
                     <div 
                        className="ql-editor" 
                        dangerouslySetInnerHTML={{ __html: course.content }} 
                        style={{ padding: 0 }} 
                        />
                    ) : (
                   <p className="no-content-notice">Вміст курсу порожній.</p>
                   )}
                 </div>

                <div className="feedback-section">
                  <p>Your feedback helps the community</p>
                  <div className="feedback-stars" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                          <span
                              key={star}
                              style={{
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: (hoverRating || userRating) >= star ? '#ffc107' : '#e4e5e9',
                                transition: 'color 0.2s ease-in-out'
                              }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => handleRate(star)}
                          >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text">
                      {isSubmittingRating ? 'Saving...' : userRating ? 'Rated!' : 'Click to rate'}
                    </span>
                  </div>
                  {ratingMessage && (
                      <p style={{ color: userRating ? '#28a745' : '#dc3545', fontSize: '14px', marginTop: '8px' }}>
                        {ratingMessage}
                      </p>
                  )}
                </div>
              </div>

              <div className="discussion-section">
                <h3>Discussion ({comments.length})</h3>

                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div className="comment-card" key={comment.id || comment._id}>
                          <div className="comment-header">
                            <div 
                               className="comment-user" 
                               onClick={() => comment.author?.id && navigate(`/profile/${comment.author.id}`)}
                               style={{ cursor: comment.author?.id ? 'pointer' : 'default' }}
                               title={comment.author?.id ? "Перейти до профілю" : ""}
                            >
                              <img
                                  src={comment.author?.avatar || "https://via.placeholder.com/40"}
                                  alt={comment.author?.name || "User"}
                                  className="comment-avatar"
                              />
                              <span className="comment-name">
                                {comment.author?.name || 'Anonymous User'}
                              </span>
                            </div>
                            <span className="comment-time">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#666', marginBottom: '20px' }}>Поки немає коментарів. Будьте першим!</p>
                )}

                {user ? (
                    <div className="add-comment-card">
                      <img src={user?.avatar || "https://via.placeholder.com/40"} alt="You" className="comment-avatar" style={{width: '40px', height: '40px'}} />
                      <div className="comment-input-area">
                    <textarea
                        placeholder="Share your thoughts on this lesson..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isPostingComment}
                    ></textarea>
                        <button
                            className="post-btn"
                            onClick={handlePostComment}
                            disabled={!newComment.trim() || isPostingComment}
                        >
                          {isPostingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                ) : (
                    <div className="add-comment-card" style={{ justifyContent: 'center', padding: '20px' }}>
                      <p>Увійдіть, щоб залишити коментар.</p>
                    </div>
                )}
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
                <button
                    className="view-profile-btn"
                    onClick={() => navigate(`/profile/${course.author_id._id || course.author_id.id}`)}
                >
                  View Profile
                </button>
              </div>

              <div className="share-card">
                <span>Share course:</span>
                <svg onClick={handleShare} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{cursor: 'pointer'}}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
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