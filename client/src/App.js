import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CoursePreview from "./pages/CoursePreview";
import CourseEditor from './pages/CourseEditor';
import './App.css';


function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <Router>
            <div className="app-wrapper">
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Login setUser={setUser} />} />
                        <Route
                            path="/dashboard"
                            element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" />}
                        />
                        <Route path="/home" element={<Home user={user} />} />

                        <Route path="/courses/:id" element={<CoursePreview user={user} />} />

                        <Route path="/create-course" element={<CourseEditor user={user} />} />

                        <Route path="/edit-course/:id" element={<CourseEditor user={user} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;