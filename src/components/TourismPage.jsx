import React, { useEffect } from 'react';
import Lenis from 'lenis';
import './TourismPage.css';
import { translations } from '../utils/translations';

const TourismPage = ({ onBack, lang }) => {
  const t = translations[lang];

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="tourism-container">
      {/* Navbar Minimalis */}
      <nav className="tourism-nav">
        <button className="tourism-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t.back}
        </button>
        <div className="tourism-logo">
          <img src="/mjt-logo.png" alt="MJT Logo" />
          <span>{t.tourism_nav_title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="tourism-hero">
        <div className="tourism-hero-overlay"></div>
        <div className="tourism-hero-content">
          <div className="tourism-badge">MJT Sightseeing</div>
          <h1>{t.tourism_hero_title}</h1>
          <p>{t.tourism_hero_desc}</p>
        </div>
      </header>

      {/* Content Section */}
      <section className="tourism-content">
        <div className="tourism-section-header">
          <h2>{t.tourism_section_title}</h2>
          <div className="tourism-accent"></div>
        </div>

        <div className="tourism-grid">
          {/* Placeholder Destinations */}
          {[1, 2, 3, 4].map((item) => (
            <div className="tourism-card" key={item}>
              <div className="tourism-card-img">
                <div className="img-placeholder">
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="white" opacity="0.5">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
              </div>
              <div className="tourism-card-body">
                <div className="card-tag">{t.tourism_card_tag}</div>
                <h3>{t.tourism_dest_name} {item}</h3>
                <p>{t.tourism_dest_desc}</p>
                <div className="card-footer">
                  <span className="card-price">Rp 0,-</span>
                  <button className="card-btn">{t.tourism_check_route}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tourism-coming-soon">
          <div className="coming-soon-box">
             <h3>{t.tourism_coming_title}</h3>
             <p>{t.tourism_coming_desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourismPage;
