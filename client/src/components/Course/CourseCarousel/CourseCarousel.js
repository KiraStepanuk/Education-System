import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import './CourseCard.css';

const CourseCard = ({ course, variant, onApprove, onReject, showHeart = false, description, category, metaInfo }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (variant === 'editable') {
            navigate(`/edit-course/${course.id}`);
        } else {
            navigate(`/courses/${course.id}`);
        }
    };

    // Фейкові дані для краси якщо їх немає в БД
    const fakeCategory = category || "Освіта";
    const fakeRating = course.rating || 4.8;
    const fakeReviews = course.reviews || Math.floor(Math.random() * 500) + 10;
    const fakeDesc = description || "Детальний курс, що покриває основи та передові практики. Підходить для початківців та спеціалістів.";
    const fakeMeta = metaInfo || "Безкоштовно";

    return (
        <div className="course-card-modern">
            <div className="cc-image-wrapper" onClick={handleNavigate}>
                <img
                    src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80'}
                    alt={course.title}
                    className="cc-image"
                />
                <div className="cc-badge">{fakeCategory}</div>
                {showHeart && (
                  <div className="cc-heart">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                )}
            </div>
            
            <div className="cc-body" onClick={handleNavigate}>
                <h3 className="cc-title">{course.title}</h3>
                <div className="cc-rating">
                    ★ {fakeRating} <span>({fakeReviews} відгуків)</span>
                </div>
                
                {variant !== 'compact' && <p className="cc-description">{fakeDesc}</p>}
                
                <div className="cc-footer">
                    <div className="cc-author-info">
                        <div className="cc-author-avatar"></div>
                        <div className="cc-author-details">
                            <span className="cc-author-name">Автор #{course.author_id.substring(0,4)}</span>
                            <span className="cc-author-role">Викладач</span>
                        </div>
                    </div>
                    <div className="cc-meta-right">{fakeMeta}</div>
                </div>
            </div>

            {variant === 'moderation' && (
                <div className="cc-actions">
                    <Button text="Погодити" onClick={() => onApprove(course.id)} />
                    <Button text="Відхилити" variant="danger" onClick={() => onReject(course.id)} />
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