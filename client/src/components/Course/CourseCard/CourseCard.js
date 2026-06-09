import React from 'react';
import './CourseCard.css';
import Button from '../../UI/Button/Button';

const CourseCard = ({ course, variant }) => {
  return (
    <div className="course-card">
      <div className="card-image-container">
        {course.isMyCourse && <span className="blue-badge">Мій курс</span>}
        <img src={course.image} alt={course.title} className="course-img" />
        <div className="heart-icon-container">
        <span className="heart-symbol">♡</span>
        </div>
        
        <div className="image-overlay">
           <button className="overlay-btn">
             {variant === 'editable' ? 'Редагувати' : 'Переглянути'}
           </button>
        </div>
      </div>

      <div className="card-content">
        <h3 className="course-title">{course.title}</h3>
        <div className="course-rating">
          <span className="stars">★★★★★</span>
          <span className="reviews-count">({course.reviews})</span>
        </div>

        {variant === 'moderation' && (
          <div className="card-actions">
            <Button text="Погодити" variant="blue" />
            <Button text="Відхилити" variant="red" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;