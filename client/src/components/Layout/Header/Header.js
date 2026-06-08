import  './Header.css';

function Header () {
    return (
        <header className="header">
            <div className="header-logo">Адмін</div>

            <div className="header-avatar">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="white" stroke-width="1.2"/>
                    <path d="M5 20C5 16.6863 7.68629 14 11 14H13C16.3137 14 19 16.6863 19 20" stroke="white"
                          stroke-width="1.2" stroke-linecap="round"/>
                </svg>
            </div>
        </header>
    )
}

export default Header;