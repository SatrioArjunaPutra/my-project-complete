import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Semua kolom wajib diisi!');
        return;
      }
      // Simulate registering to localStorage
      localStorage.setItem('mjt_user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }));
      setMode('login');
      setError('Registrasi berhasil! Silakan masuk.');
      setFormData({ ...formData, password: '' }); 
    } else {
      if (!formData.email || !formData.password) {
        setError('Email dan Password wajib diisi!');
        return;
      }
      // Simulate checking from localStorage
      const savedUser = localStorage.getItem('mjt_user');
      if (savedUser) {
        const user = JSON.stringify(savedUser) === 'object' ? savedUser : JSON.parse(savedUser);
        if (user.email === formData.email && user.password === formData.password) {
          onSuccess(user.name);
          onClose();
        } else {
          setError('Email atau password salah!');
        }
      } else {
        setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
      }
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="auth-header">
          <img src="/mjt-logo.png" alt="Logo" className="auth-logo" />
          <h2>{mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}</h2>
          <p>{mode === 'login' ? 'Masuk untuk mengakses Peta Metro Jabar' : 'Daftar untuk menikmati navigasi cerdas'}</p>
        </div>

        {error && (
          <div className={`auth-alert ${error.includes('berhasil') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Masukkan nama Anda" 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="contoh@gmail.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
             <p>Belum punya akun? <span onClick={() => { setMode('register'); setError(''); }}>Daftar di sini</span></p>
          ) : (
             <p>Sudah punya akun? <span onClick={() => { setMode('login'); setError(''); }}>Masuk</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
