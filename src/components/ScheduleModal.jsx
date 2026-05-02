import React from 'react';
import { corridors } from '../data/routeData';
import { translations } from '../utils/translations';
import './ScheduleModal.css';

const ScheduleModal = ({ isOpen, onClose, lang = 'id' }) => {
  const t = translations[lang];
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content schedule-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="schedule-header">
          <h2>{t.schedule_title}</h2>
          <p>{lang === 'id' ? 'Waktu operasional armada Metro Jabar Trans (6 Koridor)' : 'Metro Jabar Trans fleet operational times (6 Corridors)'}</p>
        </div>

        <div className="schedule-list">
          {corridors.map((item) => (
            <div key={item.id} className="schedule-item">
              <div className="schedule-item-info">
                <div 
                  className="schedule-corridor-badge" 
                  style={{ background: item.color }}
                >
                  K{item.id}
                </div>
                <div>
                  <div className="schedule-route-name">{item.route}</div>
                  <div className="schedule-stops-count">Total {item.totalStopPoints} {t.stats_stops}</div>
                </div>
              </div>
              <div className="schedule-time">
                {item.operatingHours}
              </div>
            </div>
          ))}
        </div>

        <div className="schedule-warning">
          <span>⚠️</span> {lang === 'id' ? 'Jadwal tiba di halte menyesuaikan kondisi lalu lintas.' : 'Bus arrival schedules are subject to traffic conditions.'}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;