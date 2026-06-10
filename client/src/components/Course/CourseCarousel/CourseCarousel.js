import React, { useRef } from 'react';
import './CourseCarousel.css';
import CourseCard from '../CourseCard/CourseCard';
import SectionHeading from '../../UI/SectionHeading/SectionHeading';
import Button from '../../UI/Button/Button';

// 1. ДОДАЛИ onApprove ТА onReject В ПРОПСИ
const CourseCarousel = ({ title, courses, variant, onApprove, onReject }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = 320;

    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
      <div className="carousel-section">
        <div className="carousel-header">
          <SectionHeading title={title} />

          <div className="carousel-arrows">
            <Button
                text="‹"
                onClick={() => scroll('left')}
                variant="arrow"
            />
            <Button
                text="›"
                onClick={() => scroll('right')}
                variant="arrow"
            />
          </div>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel" ref={carouselRef}>
            {courses?.map((course) => (
                <CourseCard
                    key={course.id}
                    course={course}
                    variant={variant}
                    // 2. ПЕРЕДАЄМО ФУНКЦІЇ ДАЛІ В КАРТКУ
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}
          </div>
        </div>
      </div>
  );
};

export default CourseCarousel;