import React, { useState, useEffect } from 'react';
import CourseCard from '../components/Course/CourseCard/CourseCard';
import { API_URL } from '../config';
import './AllCourses.css';

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${API_URL}/courses?sort=${sort}`).then((res) => res.json()),
      fetch(`${API_URL}/api/categories`).then((res) => res.json())
    ])
        .then(([coursesData, categoriesData]) => {
          setCourses(coursesData.filter(c => c.status === 'approved'));
          setAvailableCategories(categoriesData);
        })
        .catch(err => console.error("Помилка завантаження даних:", err))
        .finally(() => setLoading(false));
  }, [sort]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
    );
  };

  if (loading) return <div style={{padding: '40px'}}>Завантаження...</div>;

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    return matchesSearch && matchesCategory;
  });

  return (
      <div className="all-courses-page">
        <div className="catalog-header-text">
          <h1 className="home-header-title">Всі курси</h1>
          <p className="home-subtitle">Досліджуйте знання від провідних експертів спільноти.</p>
        </div>

        <div className="catalog-layout">

          {/* ЛІВИЙ САЙДБАР З ФІЛЬТРАМИ (Як на Rozetka) */}
          <aside className="catalog-sidebar">
            <div className="filter-section">
              <div className="filter-section-header">
              <span className="filter-title">
                Категорії <span className="filter-count">{availableCategories.length}</span>
              </span>
                {/*/!* Іконка стрілочки (шеврон) *!/*/}
                {/*<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                {/*  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>*/}
                {/*</svg>*/}
              </div>

              <div className="filter-section-list">
                {availableCategories.map(category => (
                    <label key={category} className="custom-checkbox-label">
                      <input
                          type="checkbox"
                          className="hidden-checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                      />
                      {/* Це наш кастомний квадратик */}
                      <span className="custom-checkbox"></span>
                      <span className="checkbox-text">{category}</span>
                    </label>
                ))}
                {availableCategories.length === 0 && (
                    <span className="checkbox-text" style={{color: '#94a3b8'}}>Категорій ще немає</span>
                )}
              </div>
            </div>
          </aside>

          {/* ПРАВА ЧАСТИНА (Пошук та сітка курсів) */}
          <div className="catalog-content">
            <div className="filter-bar">
              <div className="filter-group" style={{flex: 2}}>
                <label>Ключові слова</label>
                <input
                    type="text"
                    className="filter-input"
                    placeholder="🔍 Що ви хочете вивчити сьогодні?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
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

              <button className="filter-btn-dark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              </button>
            </div>

            <div className="courses-grid">
              {filteredCourses.map((course) => {
                return (
                    <CourseCard
                        key={course._id || course.id}
                        course={course}
                        category={course.category || "Без категорії"}
                        metaInfo={`${course.chaptersCount || Math.floor(Math.random() * 20 + 5)} розділів`}
                    />
                )
              })}
              {filteredCourses.length === 0 && (
                  <div className="no-results">За вашими фільтрами нічого не знайдено 😔</div>
              )}
            </div>
          </div>

        </div>
      </div>
  );
};

export default AllCourses;