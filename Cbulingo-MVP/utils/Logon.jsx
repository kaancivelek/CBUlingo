import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../src/styles/Logon.css';

// Landing page component that provides options for login and registration
export default function Logon() {
  const navigate = useNavigate();

  // Navigation handlers
  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');

  return (
    <div className="logon-container">
      <div className="logon-content">
        {/* Header section with welcome message */}
        <div className="logon-header">
          <h1 className="logon-title">🎓 CBUlingo'ya Hoş Geldin!</h1>
          <p className="logon-subtitle">
            İngilizce öğrenmeye başlamak için giriş yap veya hesap oluştur
          </p>
        </div>

        {/* Main options section with login and register cards */}
        <div className="logon-options">
          <div className="option-card">
            <div className="option-icon">👋</div>
            <h3>Hesabın var mı?</h3>
            <p>Mevcut hesabınla giriş yaparak öğrenmeye devam et</p>
            <button 
              className="option-button login-button" 
              onClick={goToLogin}
            >
              Giriş Yap
            </button>
          </div>

          <div className="option-separator">
            <span>VEYA</span>
          </div>

          <div className="option-card">
            <div className="option-icon">🚀</div>
            <h3>Yeni misin?</h3>
            <p>Ücretsiz hesap oluştur ve İngilizce öğrenmeye başla</p>
            <button 
              className="option-button register-button" 
              onClick={goToRegister}
            >
              Kayıt Ol
            </button>
          </div>
        </div>

        {/* Feature highlights section */}
        <div className="logon-features">
          <div className="feature">
            <span className="feature-icon">📚</span>
            <span>Binlerce kelime</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🧠</span>
            <span>Akıllı tekrar sistemi</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <span>Gamification</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>İlerleme takibi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
