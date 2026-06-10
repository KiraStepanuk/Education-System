import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseCard.css';
import Button from '../../UI/Button/Button';

const CourseCard = ({ course, variant, onApprove, onReject }) => {
    const navigate = useNavigate();

    // СТВОРЮЄМО РОЗУМНУ ФУНКЦІЮ НАВІГАЦІЇ
    const handleNavigate = () => {
        if (variant === 'editable') {
            navigate(`/edit-course/${course.id}`); // Веде в редактор
        } else {
            navigate(`/courses/${course.id}`); // Веде в режим перегляду
        }
    };

    return (
        <div className="course-card">
            <div className="card-image-container">
                {course.isMyCourse && <span className="blue-badge">Мій курс</span>}

                {/* Якщо картинки немає, ставимо заглушку, щоб не ламався дизайн */}
                <img
                    src={course.image || 'https://via.placeholder.com/300x200?text=Немає+зображення'}
                    alt={course.title}
                    className="course-img"
                />

                <div className="heart-icon-container">
                    <span className="heart-symbol">♡</span>
                </div>

                <div className="image-overlay">
                    {/* 3. ВІШАЄМО ФУНКЦІЮ НА КНОПКУ */}
                    <button className="overlay-btn" onClick={handleNavigate}>
                        {variant === 'editable' ? 'Редагувати' : 'Переглянути'}
                    </button>
                </div>
            </div>

            <div className="card-content">
                <h3 className="course-title">{course.title}</h3>
                <div className="course-rating">
                    <span className="stars">★★★★★</span>
                    <span className="reviews-count">({course.reviews || 0})</span>
                </div>

                {variant === 'moderation' && (
                    <div className="card-actions">
                        <Button
                            text="Погодити"
                            variant="blue"
                            onClick={() => onApprove(course.id)}
                        />
                        <Button
                            text="Відхилити"
                            variant="red"
                            onClick={() => onReject(course.id)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;