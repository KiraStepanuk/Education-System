import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import SectionHeading from '../components/UI/SectionHeading/SectionHeading';
import CourseCarousel from '../components/Course/CourseCarousel/CourseCarousel';
import Button from '../components/UI/Button/Button';
import './Dashboard.css';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const mockCourses = []; 

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <Header role={user.role === 'admin' ? 'Адмін' : 'Користувач'} />
      
      <main className="dashboard-container">
        <div className="dashboard-header-row">
            <h1 className="welcome-text">Вітаємо, {user.firstName}!</h1>
            <Button text="Вийти з акаунта" variant="red" onClick={handleLogout} />
        </div>

        <div className="dashboard-content-grid">
            <section className="profile-section">
                <SectionHeading text="Контактні дані" />
                <div className="info-card">
                    <div className="info-group">
                        <div className="field">
                            <label>Логін:</label>
                            <p>{user.username}</p>
                        </div>
                        <div className="field">
                            <label>Роль у системі:</label>
                            <p>{user.role}</p>
                        </div>
                    </div>
                    <div className="info-group">
                        <div className="field">
                            <label>Ім'я:</label>
                            <p>{user.firstName}</p>
                        </div>
                        <div className="field">
                            <label>Прізвище:</label>
                            <p>{user.lastName}</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;