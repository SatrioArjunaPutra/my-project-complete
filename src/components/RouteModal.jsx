import React, { useState } from 'react';
import { corridors } from '../data/routeData';
import { translations } from '../utils/translations';
import './RouteModal.css';

const RouteModal = ({ isOpen, onClose, lang = 'id' }) => {
  const t = translations[lang];
  const [activeRoute, setActiveRoute] = useState(null);

  if (!isOpen) return null;

  const toggleRoute = (id) => {
    setActiveRoute(activeRoute === id ? null : id);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content route-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="route-header">
          <h2>{t.route_title}</h2>
          <p>{lang === 'id' ? 'Pilih koridor untuk melihat daftar halte secara detail.' : 'Select a corridor to view a detailed stop list.'}</p>
        </div>

        <div className="route-list">
          {corridors.map((route) => (
            <div 
              key={route.id} 
              className={`route-card ${activeRoute === route.id ? 'active' : ''}`}
            >
              <div 
                className="route-card-header"
                onClick={() => toggleRoute(route.id)}
              >
                <div 
                  className="route-badge" 
                  style={{ background: route.color }}
                >
                  K{route.id}
                </div>
                <div className="route-name">{route.route}</div>
                <div className={`route-toggle-icon ${activeRoute === route.id ? 'rotated' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>
              </div>

              {activeRoute === route.id && (
                <div className="route-details">
                  <div className="stop-timeline">
                    <div className="timeline-line"></div>
                    {route.stops.map((stop, index) => {
                      const isEndpoint = index === 0 || index === route.stops.length - 1;
                      return (
                        <div key={index} className="stop-item">
                          <div 
                            className={`stop-dot ${isEndpoint ? 'endpoint' : ''}`}
                            style={{ borderColor: isEndpoint ? route.color : 'var(--text-muted)' }}
                          ></div>
                          <span className={`stop-label ${isEndpoint ? 'important' : ''}`}>
                            {stop.name} {stop.direction !== "N/A" ? `(${stop.direction})` : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteModal;