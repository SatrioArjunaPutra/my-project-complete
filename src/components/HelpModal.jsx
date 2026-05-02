import React from 'react';
import { translations } from '../utils/translations';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose, lang = 'id' }) => {
  const t = translations[lang];
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content help-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="help-header">
          <h2>{t.help_title}</h2>
          <p>{t.help_desc}</p>
        </div>

        <div className="help-body">
          <section className="help-section">
            <h3> Panduan Penggunaan</h3>
            <ul className="help-list">
              <li>Gunakan tombol <strong>GPS</strong> di pojok kanan untuk melihat posisi Anda.</li>
              <li>Klik pada <strong>Ikon Halte</strong> untuk melihat status halte tersebut.</li>
              <li>Warna garis di peta menunjukkan koridor bus yang berbeda.</li>
            </ul>
          </section>

          <section className="help-section contact-box">
            <h3> {t.contact_us}</h3>
            <p>{t.contact_desc}</p>
            <div className="contact-btns">
              <a 
                href="https://wa.me/6282218586131?text=Halo%20Metro%20Jabar%20Trans,%20saya%20membutuhkan%20bantuan%20terkait..." 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary whatsapp-btn"
                style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
              >
                {t.btn_wa}
              </a>
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Atau bisa hubungi email kami: <span style={{ color: 'var(--accent)', fontWeight: '600' }}>MasRdanATaji@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;