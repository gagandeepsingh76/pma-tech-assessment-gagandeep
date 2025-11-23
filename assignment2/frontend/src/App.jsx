import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Records from './pages/Records'
import InfoModal from './components/InfoModal'
import { useState } from 'react'

function App() {
    const [showInfoModal, setShowInfoModal] = useState(false)
    const location = useLocation()

    return (
        <div className="app-container">
            <header className="header">
                <h1>🌤️ Weather Records</h1>
                <p>Search weather and save your records</p>
            </header>

            <nav className="nav">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Home
                </Link>
                <Link
                    to="/records"
                    className={`nav-link ${location.pathname === '/records' ? 'active' : ''}`}
                >
                    Saved Records
                </Link>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/records" element={<Records />} />
                </Routes>
            </main>

            <footer className="footer">
                <span className="footer-text">Created by Gagandeep Singh</span>
                <button
                    className="info-button"
                    onClick={() => setShowInfoModal(true)}
                    aria-label="Show information"
                >
                    ℹ️ Info
                </button>
            </footer>

            {showInfoModal && (
                <InfoModal
                    onClose={() => setShowInfoModal(false)}
                />
            )}
        </div>
    )
}

export default App


