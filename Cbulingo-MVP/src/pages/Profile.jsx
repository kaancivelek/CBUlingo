import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearnedWordsByUserId, getAllEnWords } from '../services/wordService';

import { 
  calculateCompleteStats, 
  calculateStagePercentages 
} from '../utils/statsCalculation';
import { 
  handleAddWord, 
  handleUpdateWord, 
  validateWordForm, 
  resetWordForm 
} from '../utils/wordManagement';
import '../styles/Profile.css';

/**
 * SVG configuration for circular progress chart
 */
const SVG_CONFIG = {
  CENTER: 100,
  RADIUS: 80,
  CIRCUMFERENCE: 502.4 // 2 * π * radius
};

/**
 * Profile page component that displays user information and learning statistics
 * Includes word management functionality and progress visualization
 */
export default function Profile() {
  const navigate = useNavigate();
  
  // User and statistics state
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedCount: 0,
    progressPercentage: 0,
    stageStats: {}
  });
  const [loading, setLoading] = useState(true);
  
  // Word management state
  const [showWordForm, setShowWordForm] = useState(false);
  const [wordFormMode, setWordFormMode] = useState('add'); // 'add' or 'edit'
  const [wordFormData, setWordFormData] = useState(resetWordForm());
  const [wordFormErrors, setWordFormErrors] = useState({});
  const [wordFormLoading, setWordFormLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  /**
   * Initialize profile data on component mount
   */
  useEffect(() => {
    initializeProfile();
  }, [navigate]);

  /**
   * Load user data and calculate learning statistics
   */
  const initializeProfile = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/logon');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch both learned words and all available words
      const [learnedWordsData, allWordsData] = await Promise.all([
        getLearnedWordsByUserId(parsedUser.userId),
        getAllEnWords()
      ]);

      // Calculate complete statistics
      const calculatedStats = calculateCompleteStats(
        learnedWordsData || [], 
        allWordsData || []
      );
      
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/logon');
  };

  /**
   * Calculate SVG dash array for circular progress
   * @param {number} percentage - Progress percentage
   * @returns {string} SVG dash array value
   */
  const getProgressDashArray = (percentage) => {
    const progressLength = (percentage / 100) * SVG_CONFIG.CIRCUMFERENCE;
    return `${progressLength} ${SVG_CONFIG.CIRCUMFERENCE}`;
  };

  // Word Management Functions
  /**
   * Open word addition form
   */
  const openAddWordForm = () => {
    setWordFormMode('add');
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setShowWordForm(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  /**
   * Close word form and reset form state
   */
  const closeWordForm = () => {
    setShowWordForm(false);
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setFeedbackMessage({ type: '', text: '' });
  };

  /**
   * Handle form input changes and clear field-specific errors
   * @param {string} field - Form field name
   * @param {string} value - New field value
   */
  const handleFormInputChange = (field, value) => {
    setWordFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (wordFormErrors[field]) {
      setWordFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handle word form submission for both add and edit operations
   * @param {Event} e - Form submission event
   */
  const handleWordFormSubmit = async (e) => {
    e.preventDefault();
    setWordFormLoading(true);
    setFeedbackMessage({ type: '', text: '' });

    try {
      let result;
      if (wordFormMode === 'add') {
        result = await handleAddWord(wordFormData);
      } else {
        result = await handleUpdateWord(wordFormData.originalWord, wordFormData);
      }

      if (result.success) {
        setFeedbackMessage({ type: 'success', text: result.message });
        // Refresh stats after successful operation
        setTimeout(() => {
          initializeProfile();
          closeWordForm();
        }, 1500);
      } else {
        if (result.errors) {
          setWordFormErrors(result.errors);
        } else {
          setFeedbackMessage({ type: 'error', text: result.message });
        }
      }
    } catch (error) {
      setFeedbackMessage({ type: 'error', text: 'Beklenmeyen bir hata oluştu' });
    } finally {
      setWordFormLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-profile">
          <div className="spinner-large"></div>
          <p>Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-profile">
          <h2>Kullanıcı bulunamadı</h2>
          <button className="btn-primary" onClick={() => navigate('/logon')}>
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // Calculate stage percentages for progress visualization
  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats);

  return (
    <div className="profile-container">
      {/* User information header */}
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {user.userFullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h1 className="user-name">{user.userFullName}</h1>
            <p className="user-email">{user.userEmail}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Çıkış Yap
        </button>
      </div>

      {/* Learning statistics cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.learnedCount}</h3>
            <p className="stat-label">Öğrenilen Kelime</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalWords}</h3>
            <p className="stat-label">Toplam Kelime</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.progressPercentage}%</h3>
            <p className="stat-label">İlerleme</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.stageStats[7]?.count || 0}</h3>
            <p className="stat-label">Tamamlanan</p>
          </div>
        </div>
      </div>

      {/* Progress visualization section */}
      <div className="chart-section">
        <h2 className="section-title">📈 Öğrenme İlerlemesi</h2>
        <div className="progress-chart">
          <div className="progress-circle">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx={SVG_CONFIG.CENTER}
                cy={SVG_CONFIG.CENTER}
                r={SVG_CONFIG.RADIUS}
                className="progress-track"
              />
              <circle
                cx={SVG_CONFIG.CENTER}
                cy={SVG_CONFIG.CENTER}
                r={SVG_CONFIG.RADIUS}
                className="progress-fill"
                strokeDasharray={getProgressDashArray(stats.progressPercentage)}
              />
            </svg>
            <div className="progress-text">
              <span className="progress-percentage">{stats.progressPercentage}%</span>
              <span className="progress-label">Tamamlandı</span>
            </div>
          </div>
          <div className="progress-info">
            {/* Stage progress information */}
            {Object.entries(stageStatsWithPercentages).map(([stage, data]) => (
              <div key={stage} className="stage-info">
                <div className="stage-label">
                  <span className="stage-number">Seviye {stage}</span>
                  <span className="stage-count">({data.count} kelime)</span>
                </div>
                <div className="stage-bar">
                  <div 
                    className="stage-progress" 
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
                <span className="stage-percentage">{data.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Word management section */}
      <div className="word-management-section">
        <div className="section-header">
          <h2 className="section-title">📝 Kelime Yönetimi</h2>
          <button className="add-word-btn" onClick={openAddWordForm}>
            + Yeni Kelime Ekle
          </button>
        </div>

        {/* Word form modal */}
        {showWordForm && (
          <div className="word-form-modal">
            <div className="word-form-content">
              <h3>{wordFormMode === 'add' ? 'Yeni Kelime Ekle' : 'Kelime Düzenle'}</h3>
              <form onSubmit={handleWordFormSubmit}>
                <div className="form-group">
                  <label htmlFor="enWord">İngilizce Kelime</label>
                  <input
                    type="text"
                    id="enWord"
                    value={wordFormData.enWord}
                    onChange={(e) => handleFormInputChange('enWord', e.target.value)}
                    className={wordFormErrors.enWord ? 'error' : ''}
                  />
                  {wordFormErrors.enWord && (
                    <span className="error-message">{wordFormErrors.enWord}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="trWord">Türkçe Karşılığı</label>
                  <input
                    type="text"
                    id="trWord"
                    value={wordFormData.trWord}
                    onChange={(e) => handleFormInputChange('trWord', e.target.value)}
                    className={wordFormErrors.trWord ? 'error' : ''}
                  />
                  {wordFormErrors.trWord && (
                    <span className="error-message">{wordFormErrors.trWord}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="enExample">Örnek Cümle (İngilizce)</label>
                  <textarea
                    id="enExample"
                    value={wordFormData.enExample}
                    onChange={(e) => handleFormInputChange('enExample', e.target.value)}
                    className={wordFormErrors.enExample ? 'error' : ''}
                  />
                  {wordFormErrors.enExample && (
                    <span className="error-message">{wordFormErrors.enExample}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="trExample">Örnek Cümle (Türkçe)</label>
                  <textarea
                    id="trExample"
                    value={wordFormData.trExample}
                    onChange={(e) => handleFormInputChange('trExample', e.target.value)}
                    className={wordFormErrors.trExample ? 'error' : ''}
                  />
                  {wordFormErrors.trExample && (
                    <span className="error-message">{wordFormErrors.trExample}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={closeWordForm}
                    disabled={wordFormLoading}
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={wordFormLoading}
                  >
                    {wordFormLoading ? (
                      <>
                        <div className="spinner-small"></div>
                        {wordFormMode === 'add' ? 'Ekleniyor...' : 'Güncelleniyor...'}
                      </>
                    ) : (
                      wordFormMode === 'add' ? 'Ekle' : 'Güncelle'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feedback message */}
        {feedbackMessage.text && (
          <div className={`feedback-message ${feedbackMessage.type}`}>
            {feedbackMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}