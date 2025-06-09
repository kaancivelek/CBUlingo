import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/LogonController';
import '../styles/Auth.css';

// Email validation regex pattern
const EMAIL_REGEX = /\S+@\S+\.\S+/;

/**
 * Login page component that handles user authentication
 * @param {Function} updateUser - Callback to update user state in parent component
 */
export default function Login({ updateUser }) {
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes and clear field-specific errors
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

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.userEmail) {
      newErrors.userEmail = 'E-posta adresi gerekli';
    } else if (!EMAIL_REGEX.test(formData.userEmail)) {
      newErrors.userEmail = 'Geçerli bir e-posta adresi girin';
    }

    // Password validation
    if (!formData.userPassword) {
      newErrors.userPassword = 'Şifre gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await loginUser(formData.userEmail, formData.userPassword, navigate, updateUser);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const goBack = () => navigate('/logon');

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Header section */}
        <div className="auth-header">
          <button className="back-button" onClick={goBack}>
            ← Geri
          </button>
          <h1 className="auth-title">👋 Tekrar Hoş Geldin!</h1>
          <p className="auth-subtitle">
            Hesabına giriş yap ve öğrenmeye devam et
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email input */}
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
              autoComplete="email"
            />
            {errors.userEmail && (
              <span className="error-message">{errors.userEmail}</span>
            )}
          </div>

          {/* Password input */}
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
              placeholder="Şifrenizi girin"
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.userPassword && (
              <span className="error-message">{errors.userPassword}</span>
            )}
          </div>

          {/* Submit button */}
          <button 
            type="submit" 
            className="auth-submit-button login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Giriş Yapılıyor...
              </>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        {/* Additional links */}
        <div className="auth-links">
          <button 
            className="link-button forgot-password" 
            onClick={() => navigate('/forgot-password')}
            disabled={loading}
          >
            Şifremi Unuttum
          </button>
        </div>

        {/* Footer with registration link */}
        <div className="auth-footer">
          <p>
            Hesabın yok mu?{' '}
            <button 
              className="link-button" 
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              Kayıt Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
