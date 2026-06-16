import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoursePreview from "./pages/CoursePreview";
import CourseEditor from './pages/CourseEditor';
import AllCourses from './pages/AllCourses'; // НОВИЙ
import MyLibrary from './pages/MyLibrary';   // НОВИЙ
import Sidebar from './components/Layout/Sidebar/Sidebar';
import TopNav from './components/Layout/TopNav/TopNav';
import './App.css';
import MyPublications from './pages/MyPublications'; // Імпортуйте нову сторінку

function AppContent({ user, setUser }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <div className="app-wrapper">
      {!isAuthPage && <Sidebar user={user} />}
      <main className="main-content" style={{ backgroundColor: isAuthPage ? 'white' : 'var(--bg-color)' }}>
        {!isAuthPage && <TopNav user={user} setUser={setUser} />}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
              <Route path="/" element={<Login setUser={setUser} />} />
              <Route path="/home" element={<Home user={user} />} />
              <Route path="/all-courses" element={<AllCourses user={user} />} />
              <Route path="/library" element={user ? <MyLibrary user={user} /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
              <Route path="/courses/:id" element={<CoursePreview user={user} />} />
              <Route path="/create-course" element={<CourseEditor user={user} />} />
              <Route path="/edit-course/:id" element={<CourseEditor user={user} />} />
              <Route path="/publications" element={user ? <MyPublications user={user} /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <Router>
            <AppContent user={user} setUser={setUser} />
        </Router>
    );
}

export default App;