import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import CourseCarousel from '../components/Course/CourseCarousel/CourseCarousel';
import Button from '../components/UI/Button/Button';
import './Home.css';


import financeImg from '../components/Course/CourseCarousel/assets/Finance.png';
import pythonImg from '../components/Course/CourseCarousel/assets/Python.png';
import englishImg from '../components/Course/CourseCarousel/assets/English.png';
import interviewImg from '../components/Course/CourseCarousel/assets/Interview.png';
import psychologyImg from '../components/Course/CourseCarousel/assets/Psychology.png';
import securityImg from '../components/Course/CourseCarousel/assets/Security.png';
import excelImg from '../components/Course/CourseCarousel/assets/Excel.png';

const DEFAULT_MOCK_COURSES = [
  {
    id: 1,
    title: "Основи фінансової грамотності для початківців",
    image: financeImg,
    reviews: 88,
    status: "approved",
    author_id: 2
  },
  {
    id: 2,
    title: "Вступ до програмування на Python",
    image: pythonImg,
    reviews: 75,
    status: "approved",
    author_id: 999
  },
  {
    id: 3,
    title: "Англійська для повсякденного спілкування: корисні фрази та поради",
    image: englishImg,
    reviews: 99,
    status: "approved",
    author_id: 999
  },
  {
    id: 4,
    title: "Як підготуватися до співбесіди",
    image: interviewImg,
    reviews: 98,
    status: "approved",
    author_id: 999
  },
  {
    id: 5,
    title: "Психологія мотивації: як досягати поставлених цілей",
    image: psychologyImg,
    reviews: 99,
    status: "approved",
    author_id: 999
  },
  {
    id: 6,
    title: "Основи цифрової безпеки",
    image: securityImg,
    reviews: 88,
    status: "rejected",
    author_id: 2
  },
  {
    id: 7,
    title: "Робота з даними в Excel: від базових формул до автоматизації",
    image: excelImg,
    reviews: 75,
    status: "rejected",
    author_id: 2
  },
  {
    id: 8,
    title: "Основи Python (на модерацію)",
    image: pythonImg,
    reviews: 12,
    status: "pending",
    author_id: 3
  }
];

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRoleText = user ? (user.role === 'admin' ? 'Адмін' : 'Користувач') : 'Гість';

  useEffect(() => {
    fetch('http://localhost:5000/courses')
      .then((res) => {
        if (!res.ok) throw new Error('Помилка сервера');
        return res.json();
      })
      .then((data) => {
        if (data.length <= 2) {
          setCourses(DEFAULT_MOCK_COURSES);
        } else {
          setCourses(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Сервер не доступний або база порожня. Використовуються локальні дані:", err);
        setCourses(DEFAULT_MOCK_COURSES);
        setLoading(false);
      });
  }, []);

  const processedCourses = courses.map(course => ({
    ...course,
    isMyCourse: user && course.author_id === user.id
  }));

  const approvedCourses = processedCourses.filter(c => c.status === 'approved');
  const myRejectedCourses = processedCourses.filter(c => c.status === 'rejected' && c.author_id === (user?.id || 2));
  const pendingCourses = processedCourses.filter(c => c.status === 'pending');

  if (loading) {
    return (
      <div className="home-page">
        <Header role={userRoleText} />
        <div className="home-loading">Завантаження курсів...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header role={userRoleText} />

      <main className="home-container">
        {user?.role === 'admin' ? (
          <section className="moderator-section">
            <CourseCarousel 
              title="Курси що потребують модерації" 
              courses={pendingCourses} 
              variant="moderation" 
            />
          </section>
        ) : (
          <>
            <div className="home-action-row">
              <Button 
                text="Створити свій курс" 
                variant="red" 
                onClick={() => navigate('/create-course')} 
              />
            </div>

            <section className="user-section">
              <CourseCarousel 
                title="Курси які можна прочитати" 
                courses={approvedCourses} 
                variant="view" 
              />
            </section>

            {myRejectedCourses.length > 0 && (
              <section className="user-section">
                <CourseCarousel 
                  title="Курси які потребують редагування" 
                  courses={myRejectedCourses} 
                  variant="editable" 
                />
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;