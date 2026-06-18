import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../UI/Button/Button';
import './CourseCard.css';

const CourseCard = ({ course, variant, onApprove, onReject }) => {
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

    return (
        <div className="course-card-modern">
            <img
                src={course?.image || 'https://via.placeholder.com/300x200?text=Course'}
                alt={course?.title || 'Course'}
                className="cc-image"
                onClick={handleNavigate}
                style={{ cursor: 'pointer' }}
            />

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
