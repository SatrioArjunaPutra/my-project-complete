import React, { useState } from 'react';
import './LandingPage.css'; 

const HelpModal = ({ isOpen, onClose }) => {
  // State buat ngatur pertanyaan mana yang lagi dibuka
  const [activeIndex, setActiveIndex] = useState(null);

  if (!isOpen) return null;

  // Data FAQ dari referensi gambar lu (Udah diganti jadi Metro Jabar Trans)
  const faqs = [
    {
      q: "1. APA ITU METRO JABAR TRANS?",
      a: "Metro Jabar Trans adalah layanan bus perkotaan modern berbasis Bus Rapid Transit (BRT) yang beroperasi di wilayah Cekungan Bandung Raya, Provinsi Jawa Barat. Layanan MJT ini merupakan rebranding dari Trans Metro Pasundan, yang sebelumnya merupakan bagian dari program Teman Bus oleh Kementerian Perhubungan Republik Indonesia sejak tanggal 31 Desember 2024. Sejak tanggal 1 Januari 2025, pengelolaan layanan operasional MJT dilakukan PT Jasa Sarana yaitu BUMD yang mendapatkan penugasan dari Pemerintah Provinsi Jawa Barat."
    },
    {
      q: "2. BAGAIMANA INFRASTRUKTUR KE DEPAN?",
      a: "Mulai tahun 2025, infrastruktur pendukung seperti jalur khusus, jalur pejalan kaki, dan halte BRT akan dibangun untuk meningkatkan kenyamanan dan efisiensi layanan. Metro Jabar Trans juga merencanakan ekspansi layanan menjadi 21 koridor pada tahun 2027. Selain itu, integrasi dengan sistem transportasi lain seperti KRL Padalarang-Cicalengka sedang diupayakan agar mobilitas masyarakat semakin mudah dan terhubung."
    },
    {
      q: "3. APAKAH METRO JABAR TRANS RAMAH DISABILITAS?",
      a: "• Terdapat tarif khusus untuk penyandang disabilitas (Rp2.000 dengan KUE terdaftar).\n• Tersedia ramp portable di armada bus untuk penyandang disabilitas."
    },
    {
      q: "4. BAGAIMANA CARA MENGHUBUNGI INFORMASI LEBIH LANJUT?",
      a: "Kunjungi akun Instagram resmi @brt.metrojabartrans dan layanan pelanggan melalui aplikasi Whatsapp 0822-19158-6131 untuk update rute dan informasi lainnya."
    }
  ];

  // Fungsi buat buka/tutup jawaban FAQ
  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="japan-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      {/* Modal Content */}
      <div className="japan-modal-content" onClick={e => e.stopPropagation()} style={{ padding: '30px', maxWidth: '650px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="japan-modal-close" onClick={onClose}>✕</button>
        
        {/* Header FAQ */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#1f2937', marginBottom: '5px', fontSize: '1.2rem', fontWeight: 'bold' }}>FAQ</h2>
          <h3 style={{ color: '#2563eb', margin: '0 0 10px 0', fontSize: '1.6rem' }}>Pertanyaan yang sering diajukan</h3>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Temukan jawaban terbaik dari pertanyaan atau permasalahan Anda</p>
        </div>
        
        {/* List Pertanyaan (Accordion) */}
        <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: '1px solid #e5e7eb', 
                paddingBottom: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => toggleFaq(index)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#1f2937', lineHeight: '1.4', paddingRight: '20px', fontWeight: '600' }}>
                  {faq.q}
                </h4>
                <span style={{ fontSize: '1.5rem', color: '#2563eb', fontWeight: 'bold', transition: 'transform 0.3s ease', transform: activeIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </div>
              
              {/* Jawaban Muncul Kalau Diklik */}
              {activeIndex === index && (
                <div style={{ marginTop: '15px', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6', background: '#f8fafc', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                  {faq.a.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Copyright */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
          Metro Jabar Trans | Copyright © 2026 Nusantara Global Inovasi.<br/>All rights reserved. Version 0.0.1
        </div>
      </div>
    </div>
  );
};

export default HelpModal;