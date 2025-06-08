import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/LogonController';
import '../styles/Auth.css';
import { getAllUsers } from '../services/userService';

// Constants
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 6;

export default function Register({ updateUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: '',
    userFullName: '',
    userPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userEmail) {
      newErrors.userEmail = 'E-posta adresi gerekli';
    } else if (!EMAIL_REGEX.test(formData.userEmail)) {
      newErrors.userEmail = 'Geçerli bir e-posta adresi girin';
    }

    if (!formData.userFullName) {
      newErrors.userFullName = 'Ad soyad gerekli';
    } else if (formData.userFullName.length < MIN_NAME_LENGTH) {
      newErrors.userFullName = `Ad soyad en az ${MIN_NAME_LENGTH} karakter olmalı`;
    }

    if (!formData.userPassword) {
      newErrors.userPassword = 'Şifre gerekli';
    } else if (formData.userPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.userPassword = `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gerekli';
    } else if (formData.userPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.userEmail, {
        userEmail: formData.userEmail,
        userFullName: formData.userFullName,
        userPassword: formData.userPassword,
        userId: getAllUsers
      }, navigate, updateUser);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/logon');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <button className="back-button" onClick={goBack}>
            ← Geri
          </button>
          <h1 className="auth-title">🚀 Hesap Oluştur</h1>
          <p className="auth-subtitle">
            CBUlingo'ya katıl ve İngilizce öğrenmeye başla!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="userEmail" className="form-label">
              E-posta Adresi
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className={`form-input ${errors.userEmail ? 'error' : ''}`}
              placeholder="ornek@email.com"
              disabled={loading}
            />
            {errors.userEmail && (
              <span className="error-message">{errors.userEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userFullName" className="form-label">
              Ad Soyad
            </label>
            <input
              type="text"
              id="userFullName"
              name="userFullName"
              value={formData.userFullName}
              onChange={handleChange}
              className={`form-input ${errors.userFullName ? 'error' : ''}`}
              placeholder="Adınız Soyadınız"
              disabled={loading}
            />
            {errors.userFullName && (
              <span className="error-message">{errors.userFullName}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userPassword" className="form-label">
              Şifre
            </label>
            <input
              type="password"
              id="userPassword"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChange}
              className={`form-input ${errors.userPassword ? 'error' : ''}`}
              placeholder="En az 6 karakter"
              disabled={loading}
            />
            {errors.userPassword && (
              <span className="error-message">{errors.userPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Şifre Tekrar
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Şifrenizi tekrar girin"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-submit-button register-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Hesap Oluşturuluyor...
              </>
            ) : (
              'Hesap Oluştur'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Zaten hesabın var mı?{' '}
            <button 
              className="link-button" 
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Giriş Yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
