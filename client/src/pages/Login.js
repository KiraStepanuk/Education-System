import React from 'react';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';
import LoginForm from '../components/Unique/LoginForm/LoginForm';
import './Login.css'; 

const Login = ({ setUser }) => {
  return (
    <div className="login-page-container">

       
       <h1 className="system-title">Система публікації та модерації навчальних курсів</h1>

       <main className="login-content">
          <LoginForm onLoginSuccess={setUser} />
       </main>

       <Footer />
    </div>
  );
};

export default Login;