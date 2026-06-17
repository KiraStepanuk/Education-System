import React, { useState, useEffect } from 'react';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './AllCourses.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('new');

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/courses?sort=${sort}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.filter(c => c.status === 'approved'));
      })
      .finally(() => setLoading(false));
  }, [sort]);

  if (loading) return <div style={{padding: '40px'}}>Завантаження...</div>;

  return (
    <div className="all-courses-page">
      <h1 className="home-header-title">Всі курси</h1>
      <p className="home-subtitle">Досліджуйте знання від провідних експертів спільноти.</p>

      <div className="filter-bar">
        <div className="filter-group" style={{flex: 2}}>
          <label>Ключові слова</label>
          <input type="text" className="filter-input" placeholder="🔍 Що ви хочете вивчити сьогодні?" />
        </div>

        <div className="filter-group">
          <label>Сортувати за</label>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="new">Найновіші</option>
            <option value="old">Найстаріші</option>
            <option value="views">За популярністю</option>
            <option value="rating">За рейтингом</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Тривалість курсу</label>
          <select className="filter-select">
            <option>Будь-яка</option>
            <option>До 5 годин</option>
          </select>
        </div>

        <button className="filter-btn-dark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course, idx) => {
            const categories = ["Дизайн", "Програмування", "Психологія", "Бізнес"];
            return (
              <CourseCard 
                  key={course._id} 
                  course={course} 
                  category={categories[idx % categories.length]}
                  metaInfo={`${Math.floor(Math.random() * 20 + 5)} розділів`}
              />
            )
        })}
      </div>
    </div>
  );
};

export default AllCourses;