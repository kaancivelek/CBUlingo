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

// Constants
const SVG_CONFIG = {
  CENTER: 100,
  RADIUS: 80,
  CIRCUMFERENCE: 502.4 // 2 * π * radius
};

// Constants
const SVG_CONFIG = {
  CENTER: 100,
  RADIUS: 80,
  CIRCUMFERENCE: 502.4 // 2 * π * radius
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedCount: 0,
    progressPercentage: 0,
    stageStats: {}
  });
  const [loading, setLoading] = useState(true);
  
  // Word Management States
  const [showWordForm, setShowWordForm] = useState(false);
  const [wordFormMode, setWordFormMode] = useState('add'); // 'add' or 'edit'
  const [wordFormData, setWordFormData] = useState(resetWordForm());
  const [wordFormErrors, setWordFormErrors] = useState({});
  const [wordFormLoading, setWordFormLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  
  // Word Management States
  const [showWordForm, setShowWordForm] = useState(false);
  const [wordFormMode, setWordFormMode] = useState('add'); // 'add' or 'edit'
  const [wordFormData, setWordFormData] = useState(resetWordForm());
  const [wordFormErrors, setWordFormErrors] = useState({});
  const [wordFormLoading, setWordFormLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    initializeProfile();
  }, [navigate]);

  const initializeProfile = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/logon');
      return;
    }
    initializeProfile();
  }, [navigate]);

  const initializeProfile = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/logon');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const [learnedWordsData, allWordsData] = await Promise.all([
        getLearnedWordsByUserId(parsedUser.userId),
        getAllEnWords()
      ]);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/logon');
  };

  const getProgressDashArray = (percentage) => {
    const progressLength = (percentage / 100) * SVG_CONFIG.CIRCUMFERENCE;
    return `${progressLength} ${SVG_CONFIG.CIRCUMFERENCE}`;
  };

  // Word Management Functions
  const openAddWordForm = () => {
    setWordFormMode('add');
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setShowWordForm(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const closeWordForm = () => {
    setShowWordForm(false);
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setFeedbackMessage({ type: '', text: '' });
  };

  const handleFormInputChange = (field, value) => {
    setWordFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (wordFormErrors[field]) {
      setWordFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  // Early return for loading state
  const getProgressDashArray = (percentage) => {
    const progressLength = (percentage / 100) * SVG_CONFIG.CIRCUMFERENCE;
    return `${progressLength} ${SVG_CONFIG.CIRCUMFERENCE}`;
  };

  // Word Management Functions
  const openAddWordForm = () => {
    setWordFormMode('add');
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setShowWordForm(true);
    setFeedbackMessage({ type: '', text: '' });
  };

  const closeWordForm = () => {
    setShowWordForm(false);
    setWordFormData(resetWordForm());
    setWordFormErrors({});
    setFeedbackMessage({ type: '', text: '' });
  };

  const handleFormInputChange = (field, value) => {
    setWordFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (wordFormErrors[field]) {
      setWordFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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

  // Early return for loading state
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

  // Early return for no user
  // Early return for no user
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

  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats);
  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats);

  return (
    <div className="profile-container">
      {/* Header */}
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

      {/* Statistics Cards */}
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

      {/* Progress Chart */}
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
            <h3>Kelime Dağarcığın</h3>
            <p>
              <strong>{stats.learnedCount}</strong> kelime öğrendin, 
              <strong> {stats.totalWords - stats.learnedCount}</strong> kelime daha var!
            </p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Distribution */}
      <div className="chart-section">
        <h2 className="section-title">🎓 Öğrenme Seviyesi Dağılımı</h2>
        <div className="stage-chart">
          {Object.entries(stageStatsWithPercentages).map(([stageId, stage]) => (
            <div key={stageId} className="stage-item">
              <div className="stage-info">
                <div className={`stage-color ${stage.cssClass}`}></div>
                <span className="stage-name">{stage.name}</span>
                <span className="stage-count">{stage.count}</span>
              </div>
              <div className="stage-bar">
                <div 
                  className={`stage-fill ${stage.cssClass}`}
                  style={{ width: `${stage.percentage}%` }}
                ></div>
          {Object.entries(stageStatsWithPercentages).map(([stageId, stage]) => (
            <div key={stageId} className="stage-item">
              <div className="stage-info">
                <div className={`stage-color ${stage.cssClass}`}></div>
                <span className="stage-name">{stage.name}</span>
                <span className="stage-count">{stage.count}</span>
              </div>
              <div className="stage-bar">
                <div 
                  className={`stage-fill ${stage.cssClass}`}
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              </div>
              <span className="stage-percentage">{stage.percentage}%</span>
            </div>
          ))}
              <span className="stage-percentage">{stage.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="actions-section">
        <h2 className="section-title">🚀 Hızlı İşlemler</h2>
        <div className="action-buttons">
          <button 
            className="action-btn quiz-btn" 
            onClick={() => navigate('/quiz')}
          >
            <span className="action-icon">🎯</span>
            <div className="action-content">
              <h4>Quiz Çöz</h4>
              <p>Kelime bilgini test et</p>
            </div>
          </button>
          
          <button 
            className="action-btn dashboard-btn" 
            onClick={() => navigate('/')}
          >
            <span className="action-icon">📊</span>
            <div className="action-content">
              <h4>Dashboard</h4>
              <p>Genel durumu görüntüle</p>
            </div>
          </button>
        </div>
      </div>

      {/* Word Management Section */}
      <div className="word-management-section">
        <h2 className="section-title">📝 Kelime Yönetimi</h2>
        <div className="word-management-actions">
          <button 
            className="management-btn add-word-btn"
            onClick={openAddWordForm}
          >
            <span className="management-icon">➕</span>
            <div className="management-content">
              <h4>Yeni Kelime Ekle</h4>
              <p>Sözlüğe yeni kelime ekle</p>
            </div>
          </button>
        </div>
      </div>

      {/* Word Form Modal */}
      {showWordForm && (
        <div className="word-form-overlay">
          <div className="word-form-modal">
            <div className="word-form-header">
              <h3>
                {wordFormMode === 'add' ? '➕ Yeni Kelime Ekle' : '✏️ Kelimeyi Düzenle'}
              </h3>
              <button 
                className="close-form-btn"
                onClick={closeWordForm}
                disabled={wordFormLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWordFormSubmit} className="word-form">
              <div className="form-group">
                <label htmlFor="enWord">İngilizce Kelime *</label>
                <input
                  type="text"
                  id="enWord"
                  value={wordFormData.enWord}
                  onChange={(e) => handleFormInputChange('enWord', e.target.value)}
                  className={wordFormErrors.enWord ? 'error' : ''}
                  placeholder="Örn: beautiful"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.enWord && (
                  <span className="error-message">{wordFormErrors.enWord}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="trWord">Türkçe Anlamı *</label>
                <input
                  type="text"
                  id="trWord"
                  value={wordFormData.trWord}
                  onChange={(e) => handleFormInputChange('trWord', e.target.value)}
                  className={wordFormErrors.trWord ? 'error' : ''}
                  placeholder="Örn: güzel"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.trWord && (
                  <span className="error-message">{wordFormErrors.trWord}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="picUrl">Resim URL'si</label>
                <input
                  type="url"
                  id="picUrl"
                  value={wordFormData.picUrl}
                  onChange={(e) => handleFormInputChange('picUrl', e.target.value)}
                  className={wordFormErrors.picUrl ? 'error' : ''}
                  placeholder="https://example.com/image.jpg"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.picUrl && (
                  <span className="error-message">{wordFormErrors.picUrl}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="enExample">Örnek Cümle</label>
                <textarea
                  id="enExample"
                  value={wordFormData.enExample}
                  onChange={(e) => handleFormInputChange('enExample', e.target.value)}
                  className={wordFormErrors.enExample ? 'error' : ''}
                  placeholder="She is a beautiful woman."
                  rows="3"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.enExample && (
                  <span className="error-message">{wordFormErrors.enExample}</span>
                )}
              </div>

              {feedbackMessage.text && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                  {feedbackMessage.text}
                </div>
              )}

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
                      <span className="spinner"></span>
                      {wordFormMode === 'add' ? 'Ekleniyor...' : 'Güncelleniyor...'}
                    </>
                  ) : (
                    wordFormMode === 'add' ? 'Kelimeyi Ekle' : 'Güncelle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Word Management Section */}
      <div className="word-management-section">
        <h2 className="section-title">📝 Kelime Yönetimi</h2>
        <div className="word-management-actions">
          <button 
            className="management-btn add-word-btn"
            onClick={openAddWordForm}
          >
            <span className="management-icon">➕</span>
            <div className="management-content">
              <h4>Yeni Kelime Ekle</h4>
              <p>Sözlüğe yeni kelime ekle</p>
            </div>
          </button>
        </div>
      </div>

      {/* Word Form Modal */}
      {showWordForm && (
        <div className="word-form-overlay">
          <div className="word-form-modal">
            <div className="word-form-header">
              <h3>
                {wordFormMode === 'add' ? '➕ Yeni Kelime Ekle' : '✏️ Kelimeyi Düzenle'}
              </h3>
              <button 
                className="close-form-btn"
                onClick={closeWordForm}
                disabled={wordFormLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWordFormSubmit} className="word-form">
              <div className="form-group">
                <label htmlFor="enWord">İngilizce Kelime *</label>
                <input
                  type="text"
                  id="enWord"
                  value={wordFormData.enWord}
                  onChange={(e) => handleFormInputChange('enWord', e.target.value)}
                  className={wordFormErrors.enWord ? 'error' : ''}
                  placeholder="Örn: beautiful"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.enWord && (
                  <span className="error-message">{wordFormErrors.enWord}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="trWord">Türkçe Anlamı *</label>
                <input
                  type="text"
                  id="trWord"
                  value={wordFormData.trWord}
                  onChange={(e) => handleFormInputChange('trWord', e.target.value)}
                  className={wordFormErrors.trWord ? 'error' : ''}
                  placeholder="Örn: güzel"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.trWord && (
                  <span className="error-message">{wordFormErrors.trWord}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="picUrl">Resim URL'si</label>
                <input
                  type="url"
                  id="picUrl"
                  value={wordFormData.picUrl}
                  onChange={(e) => handleFormInputChange('picUrl', e.target.value)}
                  className={wordFormErrors.picUrl ? 'error' : ''}
                  placeholder="https://example.com/image.jpg"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.picUrl && (
                  <span className="error-message">{wordFormErrors.picUrl}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="enExample">Örnek Cümle</label>
                <textarea
                  id="enExample"
                  value={wordFormData.enExample}
                  onChange={(e) => handleFormInputChange('enExample', e.target.value)}
                  className={wordFormErrors.enExample ? 'error' : ''}
                  placeholder="She is a beautiful woman."
                  rows="3"
                  disabled={wordFormLoading}
                />
                {wordFormErrors.enExample && (
                  <span className="error-message">{wordFormErrors.enExample}</span>
                )}
              </div>

              {feedbackMessage.text && (
                <div className={`feedback-message ${feedbackMessage.type}`}>
                  {feedbackMessage.text}
                </div>
              )}

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
                      <span className="spinner"></span>
                      {wordFormMode === 'add' ? 'Ekleniyor...' : 'Güncelleniyor...'}
                    </>
                  ) : (
                    wordFormMode === 'add' ? 'Kelimeyi Ekle' : 'Güncelle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 