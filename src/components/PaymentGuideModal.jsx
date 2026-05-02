import React from 'react';
import { translations } from '../utils/translations';
import './PaymentGuideModal.css';

const PaymentGuideModal = ({ isOpen, onClose, lang = 'id' }) => {
  if (!isOpen) return null;

  const t = translations[lang];

  const steps = [
    {
      id: 1,
      icon: '💳',
      title: lang === 'id' ? 'Siapkan Kartu' : 'Prepare Card',
      desc: lang === 'id' ? 'Pastikan saldo E-Money, Flazz, Brizzi, atau TapCash Anda cukup.' : 'Ensure your E-Money, Flazz, Brizzi, or TapCash balance is sufficient.'
    },
    {
      id: 2,
      icon: '🚌',
      title: lang === 'id' ? 'Naik ke Bus' : 'Board the Bus',
      desc: lang === 'id' ? 'Masuk melalui pintu depan dan sapa pengemudi dengan ramah.' : 'Enter through the front door and greet the driver politely.'
    },
    {
      id: 3,
      icon: '📱',
      title: lang === 'id' ? 'Tap In (Masuk)' : 'Tap In (Enter)',
      desc: lang === 'id' ? 'Tempelkan kartu Anda pada mesin Tap-On-Bus (TOB) saat masuk hingga lampu hijau menyala.' : 'Tap your card on the Tap-On-Bus (TOB) machine when entering until the green light turns on.'
    },
    {
      id: 4,
      icon: '👋',
      title: lang === 'id' ? 'Tap Out (Keluar)' : 'Tap Out (Exit)',
      desc: lang === 'id' ? 'Jangan lupa tempelkan kembali kartu Anda pada mesin saat akan turun dari bus.' : 'Don\'t forget to tap your card again on the machine before getting off the bus.'
    },
    {
      id: 5,
      icon: '✅',
      title: lang === 'id' ? 'Selesai' : 'Success',
      desc: lang === 'id' ? 'Saldo akan terpotong dan Anda telah sampai tujuan.' : 'Balance will be deducted and you have reached your destination.'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-guide-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        
        <div className="pg-header">
          <div className="pg-icon-main">💳</div>
          <h2>{lang === 'id' ? 'Panduan Pembayaran' : 'Payment Guide'}</h2>
          <p>{lang === 'id' ? 'Sistem Tap-On-Bus (TOB) Metro Jabar Trans' : 'Metro Jabar Trans Tap-On-Bus (TOB) System'}</p>
        </div>

        <div className="pg-steps-grid">
          {steps.map(step => (
            <div key={step.id} className="pg-step-card">
              <div className="pg-step-number">{step.id}</div>
              <div className="pg-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="pg-footer">
          <div className="pg-info-box">
             <strong>{lang === 'id' ? 'Catatan:' : 'Note:'}</strong>
             <p>{lang === 'id' ? 'Satu kartu hanya dapat digunakan untuk satu orang per perjalanan.' : 'One card can only be used for one person per trip.'}</p>
          </div>
          <button className="pg-btn-done" onClick={onClose}>
            {lang === 'id' ? 'Mengerti' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentGuideModal;
