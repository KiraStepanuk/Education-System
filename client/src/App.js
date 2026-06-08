import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Layout/Header/Header';
import Footer from "./components/Layout/Footer/Footer";
import './App.css';

function App() {
    return (
        <div className="app-wrapper">
            <Header />

            {/* Оборачиваем роутер в main, чтобы он занимал всё свободное место */}
            <main className="main-content">
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Router>
            </main>

            <Footer />
        </div>
    );
}

export default App;
