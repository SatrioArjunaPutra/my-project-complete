import React, { useEffect } from 'react';
import Lenis from 'lenis';
import './TourismPage.css'; // Reuse tourism styles
import { translations } from '../utils/translations';

const CulinaryPage = ({ onBack, lang }) => {
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
    <div className="tourism-container culinary-theme">
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
          <span>{t.culinary_nav_title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="tourism-hero culinary-hero">
        <div className="tourism-hero-overlay culinary-overlay"></div>
        <div className="tourism-hero-content">
          <div className="tourism-badge">MJT Culinary</div>
          <h1>{t.culinary_hero_title}</h1>
          <p>{t.culinary_hero_desc}</p>
        </div>
      </header>

      {/* Content Section */}
      <section className="tourism-content">
        <div className="tourism-section-header">
          <h2>{t.culinary_section_title}</h2>
          <div className="tourism-accent" style={{ background: '#F39C12' }}></div>
        </div>

        <div className="tourism-grid">
          {/* Placeholder Destinations */}
          {[1, 2, 3, 4].map((item) => (
            <div className="tourism-card" key={item}>
              <div className="tourism-card-img" style={{ background: '#fef3c7' }}>
                <div className="img-placeholder" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="white" opacity="0.5">
                    <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                  </svg>
                </div>
              </div>
              <div className="tourism-card-body">
                <div className="card-tag" style={{ color: '#F39C12' }}>{t.culinary_card_tag}</div>
                <h3>{t.culinary_food_name} {item}</h3>
                <p>{t.culinary_food_desc}</p>
                <div className="card-footer">
                  <span className="card-price">Rp 0,-</span>
                  <button className="card-btn" style={{ background: '#F39C12' }}>{t.tourism_check_route}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tourism-coming-soon" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
          <div className="coming-soon-box">
             <h3>{t.culinary_coming_title}</h3>
             <p>{t.culinary_coming_desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulinaryPage;
