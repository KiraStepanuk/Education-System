import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import { API_URL } from '../../../config';
import './CourseCard.css';

// ДОДАНО: проп onFavoriteToggle
const CourseCard = ({ course, variant, onApprove, onReject, onFavoriteToggle }) => {
    const navigate = useNavigate();
    
    const courseId = course?.id || course?._id;

    const handleNavigate = () => {
        if (variant === 'editable') {
            navigate(`/edit-course/${courseId}`);
        } else {
            navigate(`/courses/${courseId}`);
        }
    };

    const authorName = course?.authorName || (
        typeof course?.author_id === 'object' && course?.author_id?.firstName
            ? `${course.author_id.firstName} ${course.author_id.lastName}`
            : `Автор #${typeof course?.author_id === 'object' 
                ? (course.author_id?.id || course.author_id?._id) 
                : (course?.author_id || 'Невідомий')}`
    );

    const authorAvatarUrl = course?.authorAvatar || (
        typeof course?.author_id === 'object' && course?.author_id?.avatar 
            ? course.author_id.avatar 
            : ''
    );

    const userId = (() => { try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u._id || u.id || null; } catch { return null; } })();
    const storedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const [isFavorite, setIsFavorite] = useState(storedFavs.includes(courseId));
    const [loadingFav, setLoadingFav] = useState(false);

    const handleFavoriteToggle = async (e) => {
        e.stopPropagation(); // Зупиняємо подію, щоб не відбувся перехід на курс
        if (!userId || loadingFav) return;
        setLoadingFav(true);
        try {
            const res = await fetch(`${API_URL}/users/${userId}/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId })
            });
            const data = await res.json();
            if (data.success) {
                const newFavs = data.favorites.map(id => id.toString());
                localStorage.setItem('favorites', JSON.stringify(newFavs));
                
                const currentStatus = newFavs.includes(courseId);
                setIsFavorite(currentStatus);
                
                // ДОДАНО: Повідомляємо батьківський компонент, якщо передана функція
                if (onFavoriteToggle) {
                    onFavoriteToggle(courseId, currentStatus);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingFav(false);
        }
    };

    return (
        <div className="course-card-modern">
            <div className="cc-image-wrapper">
                <img
                    src={course?.image || 'https://via.placeholder.com/300x200?text=Course'}
                    alt={course?.title || 'Course'}
                    className="cc-image"
                    onClick={handleNavigate}
                    style={{ cursor: 'pointer' }}
                />
                {course?.category && (
                    <span className="cc-category-badge">{course.category}</span>
                )}
                {variant !== 'moderation' && variant !== 'editable' && (
                    <button
                        className={`cc-heart-btn${isFavorite ? ' cc-heart-btn--active' : ''}`}
                        onClick={handleFavoriteToggle}
                        disabled={loadingFav}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24"
                            fill={isFavorite ? "#ef4444" : "none"}
                            stroke={isFavorite ? "#ef4444" : "white"}
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="cc-body" onClick={handleNavigate} style={{ cursor: 'pointer' }}>
                <h3 className="cc-title">{course?.title}</h3>

                <div className="cc-rating">
                    ★ {course?.reviews > 0 ? course?.rating : '0.0'}
                    <span>({course?.reviews ?? 0} відгуків)</span>
                </div>

                <div className="cc-footer">
                    {authorAvatarUrl ? (
                        <img 
                            src={authorAvatarUrl} 
                            alt={authorName} 
                            className="cc-author-avatar" 
                            style={{ objectFit: 'cover', width: '24px', height: '24px', borderRadius: '50%' }} 
                        />
                    ) : (
                        <div className="cc-author-avatar"></div>
                    )}
                    <span className="cc-author-name">
                        {authorName}
                    </span>
                </div>
            </div>

            {variant === 'moderation' && (
                <div className="cc-actions">
                    <Button text="Погодити" onClick={() => onApprove && onApprove(courseId)} />
                    <Button text="Відхилити" variant="danger" onClick={() => onReject && onReject(courseId)} />
                </div>
            )}

            {variant === 'editable' && (
                <div className="cc-actions">
                    <Button text="Редагувати" variant="outline" onClick={handleNavigate} />
                </div>
            )}
        </div>
    );
};

export default CourseCard;