import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import './CourseCard.css';

const CourseCard = ({ course, variant, onApprove, onReject }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (variant === 'editable') {
            navigate(`/edit-course/${course.id}`);
        } else {
            navigate(`/courses/${course.id}`);
        }
    };

    return (
        <div className="course-card-modern">
            <img
                src={course.image || 'https://via.placeholder.com/300x200?text=Course'}
                alt={course.title}
                className="cc-image"
                onClick={handleNavigate}
            />
            
            <div className="cc-body" onClick={handleNavigate}>
                <h3 className="cc-title">{course.title}</h3>
                <div className="cc-rating">
                    ★ 4.9 <span>(128 відгуків)</span>
                </div>

                <div className="cc-footer">
    {course.authorAvatar ? (
        <img 
            src={course.authorAvatar} 
            alt={course.authorName || 'Автор'} 
            className="cc-author-avatar" 
            style={{ objectFit: 'cover' }} 
        />
    ) : (
        <div className="cc-author-avatar"></div>
    )}

    <span className="cc-author-name">
        {course.authorName || `Автор #${typeof course.author_id === 'object' 
            ? (course.author_id?.id || course.author_id?._id) 
            : course.author_id}`}
    </span>
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