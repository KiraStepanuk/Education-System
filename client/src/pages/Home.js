import React from 'react';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer/Footer';

const Home = ({ user }) => {
    const userRole = user ? (user.role === 'admin' ? 'Адмін' : 'Користувач') : 'Гість';

    return (
        <div className="app-container">
            <Header role={userRole} />
            
            <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ color: '#ccc' }}>...</h2>
            </main>

            <Footer />
        </div>
    );
};

export default Home;