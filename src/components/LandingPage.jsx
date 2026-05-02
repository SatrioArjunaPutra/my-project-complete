import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './LandingPage.css';
import AuthModal from './AuthModal';
import ScheduleModal from './ScheduleModal';
import RouteModal from './RouteModal';
import HelpModal from './HelpModal';
import PaymentGuideModal from './PaymentGuideModal';
import { translations } from '../utils/translations';

const LandingPage = ({ onEnter, onShowTourism, onShowCulinary, lang, setLang }) => {
  const t = translations[lang];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  
  const [isScrolled, setIsScrolled] = useState(false);
  
  // STATE BUAT 3 MODAL
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRouteOpen, setIsRouteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false); 
  const [isPaymentGuideOpen, setIsPaymentGuideOpen] = useState(false);
  
  const [authMode, setAuthMode] = useState('login');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // REVEAL ANIMATION ON SCROLL
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  const toggleLanguage = () => {
    setLang(lang === 'id' ? 'en' : 'id');
  };

  return (
    <div className="landing-container">
      <div className="landing-bg-map"></div>
      
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <img src="/mjt-logo.png" alt="Metro Jabar Trans Logo" className="brand-logo-img" />
          <div className="brand-text" style={{ marginLeft: '4px' }}>
            <span className="brand-title" style={{ fontSize: '1.3rem', letterSpacing: '1px' }}>
              {currentTime.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              {lang === 'id' ? ' WIB' : ''}
            </span>
            <span className="brand-subtitle">
              {currentTime.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <ul className="nav-links">
          <li className="active">{t.nav_home}</li>
          <li onClick={() => setIsRouteOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_routes}</li>
          <li onClick={() => setIsScheduleOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_schedules}</li>
          <li onClick={() => setIsHelpOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_help}</li>
        </ul>

        <div className="nav-actions">
          {/* LANGUAGE TOGGLE */}
          <button className="nav-icon-btn lang-toggle" onClick={toggleLanguage} title="Switch Language" style={{ marginRight: '10px' }}>
             <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{lang.toUpperCase()}</span>
          </button>

          <button className="nav-btn dashboard-btn" onClick={handleEnterMap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            {t.btn_open_map}
          </button>
          

          {isLoggedIn ? (
            <div className="user-profile" onClick={handleLogout} title="Klik untuk Logout">
              <div className="avatar">{userName ? userName.charAt(0).toUpperCase() : 'A'}</div>
              <div className="user-info">
                <span className="user-name">{userName || 'User'}</span>
                <span className="user-role">{t.auth_logout}</span>
              </div>
            </div>
          ) : (
            <button className="nav-btn login-btn" onClick={() => openAuth('login')}>
              {t.auth_login}
            </button>
          )}
        </div>
      </nav>

      <main className="landing-hero reveal">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            {t.tracker_active}
          </div>
          
          <h1 className="hero-title">
            Metro <br />
            <span className="text-gradient">{t.hero_title.split(' ')[1]} {t.hero_title.split(' ')[2]}</span>
          </h1>
          <h2 className="hero-subtitle">{t.hero_subtitle}</h2>
          <p className="hero-description">
            {t.hero_desc}
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={handleEnterMap}>
              {t.btn_start}
            </button>
            <button className="btn-secondary" onClick={() => setIsRouteOpen(true)}>
              {t.btn_routes}
            </button>
          </div>
          
          <div className="stats-container">
             <div className="stat-item"><h3>5+</h3><p>{t.stats_corridors}</p></div>
             <div className="stat-item"><h3>180+</h3><p>{t.stats_stops}</p></div>
             <div className="stat-item" style={{ minWidth: '150px' }}><h3>04.30 - 20.30</h3><p>{t.stats_hours}</p></div>
          </div>

          <div className="scroll-down-hint" onClick={() => document.querySelector('.landing-info-section')?.scrollIntoView()}>
            <span>{t.scroll_down}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </div>
        </div>

      </main>

      {/* SECTION KEDUA - INFORMASI LAYANAN */}
      <section className="landing-info-section reveal">
        <div className="info-container">
          <div className="section-header">
            <div className="accent-line"></div>
            <h2>{t.service_info_title}</h2>
          </div>

          <div className="vehicle-info-grid">
            <div className="vehicle-card reveal">
              <div className="card-image">
                <img src="/mjt_bus_right.png" alt="MJT Sightseeing" />
              </div>
              <div className="card-content">
                <h3>{t.service_sightseeing}</h3>
                <p>{t.service_sightseeing_desc}</p>
                <button className="learn-more-btn" onClick={onShowTourism}>
                  {t.learn_more}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="vehicle-card reveal">
              <div className="card-image">
                <img src="/mjt_bus_right.png" alt="MJT Culinary" style={{ transform: 'scaleX(-1)' }} />
              </div>
              <div className="card-content">
                <h3>{t.service_culinary}</h3>
                <p>{t.service_culinary_desc}</p>
                <button className="learn-more-btn" onClick={onShowCulinary}>
                  {t.learn_more}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="user-guide-banner reveal">
            <div className="banner-visual">
               <img src="/mjt_bus_right.png" alt="MJT Guide" style={{ transform: 'scale(1.4) translateX(20px)' }} />
            </div>
            <div className="banner-text">
              <h2>{t.guide_title}</h2>
              <p>{t.guide_desc}</p>
              <button className="banner-btn" onClick={() => setIsPaymentGuideOpen(true)}>
                {t.btn_start_guide}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ANIMATED BUS STRIP (Hokutetsu Style) */}
          <div className="bus-animation-strip reveal">
            <div className="road-line"></div>
            <div className="bus-stop-sign">
              <div className="sign-top">MJT</div>
              <div className="sign-pole"></div>
            </div>
            <div className="moving-bus-container">
              <img src="/mjt_bus_right.png" alt="Moving Bus" className="mini-bus bus-1" />
              <img src="/mjt_bus_right.png" alt="Moving Bus" className="mini-bus bus-2" />
              <img src="/mjt_bus_right.png" alt="Moving Bus" className="mini-bus bus-3" />
              <img src="/mjt_bus_right.png" alt="Moving Bus" className="mini-bus bus-4" />
            </div>
          </div>
        </div>
      </section>

      {/* PANGGIL 3 MODAL DI SINI */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSuccessAuth}
        initialMode={authMode}
        lang={lang}
      />

      <ScheduleModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        lang={lang}
      />

      <RouteModal 
        isOpen={isRouteOpen} 
        onClose={() => setIsRouteOpen(false)} 
        lang={lang}
      />
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        lang={lang}
      />
      <PaymentGuideModal 
        isOpen={isPaymentGuideOpen}
        onClose={() => setIsPaymentGuideOpen(false)}
        lang={lang}
      />

    </div>
  );
};

export default LandingPage;