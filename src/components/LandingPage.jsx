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
import { supabase } from '../utils/supabaseClient';

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
    // Cek session saat pertama kali diload
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.user?.user_metadata?.full_name || session.user.email.split('@')[0]);
      }
    });

    // Listen untuk perubahan auth (login/logout dari tempat lain)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.user?.user_metadata?.full_name || session.user.email.split('@')[0]);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserName('');
  };

  const handleSuccessAuth = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
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

       {/* 👇 BAGIAN MENU NAVBAR YANG UDAH DIBERSIHIN 👇 */}
        <ul className="nav-links">
          <li className="active">{t.nav_home}</li>
          <li onClick={() => setIsRouteOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_routes}</li>
          <li onClick={() => setIsScheduleOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_schedules}</li>
          <li onClick={() => setIsHelpOpen(true)} style={{ cursor: 'pointer' }}>{t.nav_help}</li>
        </ul>
        {/* 👆 ==================================== 👆 */}

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
  Login / Masuk
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
                <img src="/wisata.jpg" alt="MJT Sightseeing" />
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
                <img src="/kuliner.png" alt="MJT Culinary" style={{ transform: 'scaleX(-1)' }} />
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
               <img src="/driver_bus.jpg" alt="MJT Guide" />
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

{/* 👇 SECTION BARU: PUSAT BANTUAN & SOSIAL MEDIA 👇 */}
                    
          <div className="support-center-section">
            <div className="support-content-wrapper">
              <h3 className="support-subtitle">Temukan informasi seputar layanan, dan 
                 berguna untuk Anda di sini.</h3>
              
              <div className="support-cards-grid">
                {/* Card 1: FAQ */}
                <div className="support-card" onClick={() => setIsHelpOpen(true)}>
                  <div className="support-icon bg-blue-light">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </div>
                  <div className="support-text">
                    <h4>Butuh Bantuan? Cek FAQ</h4>
                    <p>Temukan jawaban terbaik dari pertanyaan atau permasalahan Anda</p>
                  </div>
                </div>

                {/* Card 2: Customer Service */}
                <div className="support-card" onClick={() => window.open('https://wa.me/6285158663932?text=Halo%20Admin%20Metro%20Jabar%20Trans%2C%20saya%20butuh%20bantuan%20terkait%20layanan%20bus.', '_blank')}>
                  <div className="support-icon bg-indigo-light">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </div>
                  <div className="support-text">
                    <h4>Ingin menghubungi CS Kami?</h4>
                    <p>Lapor permasalahan Anda & cari tahu info lebih lanjut dengan mudah</p>
                  </div>
                </div>
              </div>

              {/* Bagian Sosial Media Rata Kiri */}
              <div className="social-media-container">
                <h4>Ikuti Metro Jabar Trans di Sosial Media</h4>
                <p>Dapatkan informasi terbaru seputar layanan Metro Jabar Trans yang dibagikan di sosial media kami</p>
                
                <div className="social-icons">
                  <div className="social-btn instagram" onClick={() => window.open('https://www.instagram.com/brt.metrojabartrans?igsh=MWJ1azMzc3ZyMHJmdA==', '_blank')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <div className="social-btn facebook" onClick={() => window.open('https://www.facebook.com/share/1H2MnPTW6m/?mibextid=wwXIfr', '_blank')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <div className="social-btn tiktok" onClick={() => window.open('https://www.tiktok.com/@brt.metrojabartrans?_r=1&_t=ZS-96D9ueklYdl', '_blank')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 👆 AKHIR SECTION BARU 👆 */}

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