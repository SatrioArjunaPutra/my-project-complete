import React, { useState } from 'react';
import { translations } from '../utils/translations';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login', lang = 'id' }) => {
  const t = translations[lang];
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
        setError(t.error_fill_all);
        return;
      }
      // Simulate registering to localStorage
      localStorage.setItem('mjt_user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }));
      setMode('login');
      setError(t.success_register);
      setFormData({ ...formData, password: '' }); 
    } else {
      if (!formData.email || !formData.password) {
        setError(t.error_fill_email_pass);
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
          setError(t.error_wrong_pass);
        }
      } else {
        setError(t.error_not_found);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-modal">
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="auth-header">
          <img src="/mjt-logo.png" alt="Logo" className="auth-logo" />
          <h2>{mode === 'login' ? t.auth_title_login : t.auth_title_register}</h2>
          <p>{mode === 'login' ? t.auth_desc_login : t.auth_desc_register}</p>
        </div>

        {error && (
          <div className={`auth-alert ${error.includes('berhasil') || error.includes('successful') ? 'success' : 'error'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>{t.label_name}</label>
              <input 
                type="text" 
                name="name" 
                placeholder={t.placeholder_name} 
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>{t.label_email}</label>
            <input 
              type="email" 
              name="email" 
              placeholder="contoh@gmail.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>{t.label_password}</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary auth-submit-btn">
            {mode === 'login' ? t.btn_login : t.btn_register}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'login' ? (
             <p>{t.auth_switch_login}<span onClick={() => { setMode('register'); setError(''); }}>{t.link_register}</span></p>
          ) : (
             <p>{t.auth_switch_register}<span onClick={() => { setMode('login'); setError(''); }}>{t.link_login}</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;