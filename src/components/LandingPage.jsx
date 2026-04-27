import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import AuthModal from './AuthModal';

const LandingPage = ({ onEnter }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeSession = sessionStorage.getItem('mjt_active_session');
    if (activeSession) {
      setIsLoggedIn(true);
      setUserName(activeSession);
    }
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    sessionStorage.removeItem('mjt_active_session');
  };

  const handleSuccessAuth = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    sessionStorage.setItem('mjt_active_session', name);
  };

  const handleEnterMap = () => {
    if (isLoggedIn) {
      onEnter();
    } else {
      openAuth('register');
    }
  };
  return (
    <div className="landing-container">
      {/* Background Effect: Map grid / topological styling */}
      <div className="landing-bg-map"></div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src="/mjt-logo.png" alt="Metro Jabar Trans Logo" className="brand-logo-img" />
          <div className="brand-text" style={{ marginLeft: '4px' }}>
            <span className="brand-title" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="brand-subtitle">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <ul className="nav-links">
          <li className="active">Beranda</li>
          <li>Rute Bus</li>
          <li>Penjadwalan</li>
          <li>Kartu Tiket</li>
          <li>Bantuan</li>
        </ul>

        <div className="nav-actions">
          <button className="nav-btn dashboard-btn" onClick={handleEnterMap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Buka Peta
          </button>
          
          <button className="nav-icon-btn" title="Peta Rute">
             {/* Map icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
              <line x1="8" y1="2" x2="8" y2="18"></line>
              <line x1="16" y1="6" x2="16" y2="22"></line>
            </svg>
          </button>

          {isLoggedIn ? (
            <div className="user-profile" onClick={handleLogout} title="Klik untuk Logout">
              <div className="avatar">{userName ? userName.charAt(0).toUpperCase() : 'A'}</div>
              <div className="user-info">
                <span className="user-name">{userName || 'Pengguna'}</span>
                <span className="user-role">Logout</span>
              </div>
            </div>
          ) : (
            <button className="nav-btn login-btn" onClick={() => openAuth('login')}>
              Masuk / Login
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Real-time Tracker Aktif
          </div>
          
          <h1 className="hero-title">
            Navigasi Pintar <br />
            <span className="text-gradient">Transportasi Publik</span>
          </h1>
          
          <h2 className="hero-subtitle">Masa Depan Bus Raya Terpadu</h2>
          
          <p className="hero-description">
            Planer perjalanan terintegrasi untuk <span className="highlight-text">Metro Jabar Trans</span>. Temukan halte terdekat, cek jadwal kedatangan secara real-time, dan nikmati kemudahan mobilitas di penjuru kota.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleEnterMap}>
              Mulai Eksplorasi Peta
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
            <button className="btn-secondary">
              Lihat Rute 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <div className="stats-container">
             <div className="stat-item">
               <h3>5+</h3>
               <p>Koridor</p>
             </div>
             <div className="stat-item">
               <h3>180+</h3>
               <p>Halte</p>
             </div>
             <div className="stat-item" style={{ minWidth: "150px" }}>
               <h3>04.30 - 20.30</h3>
               <p>Jam Operasional</p>
             </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="map-showcase">
             {/* Center Graphic */}
             <div className="showcase-wrapper">
               <img src="/bus_map_hero.png" alt="Bus Map Route 3D" className="map-img" />
             </div>

             {/* Floating Icons related to transit */}
             <div className="floating-card card-2">
                <div className="card-icon green-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="card-text">Halte Alun-alun</div>
             </div>
             
             <div className="floating-card card-3">
                <div className="card-icon yellow-bg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="card-text">Jadwal Tepat Waktu</div>
             </div>
          </div>
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSuccessAuth}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;
