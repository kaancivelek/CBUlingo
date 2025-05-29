import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLearnedWordsByUserId, getAllEnWords } from '../services/wordService';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [learnedWords, setLearnedWords] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedCount: 0,
    progressPercentage: 0,
    stageStats: {}
  });

  useEffect(() => {
    const initializeProfile = async () => {
      // Check if user is logged in
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/logon');
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch data
        const [learnedWordsData, allWordsData] = await Promise.all([
          getLearnedWordsByUserId(parsedUser.id),
          getAllEnWords()
        ]);

        setLearnedWords(learnedWordsData || []);
        setAllWords(allWordsData || []);

        // Calculate statistics
        calculateStats(learnedWordsData || [], allWordsData || []);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [navigate]);

  const calculateStats = (learned, total) => {
    const learnedCount = learned.length;
    const totalWords = total.length;
    const progressPercentage = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;

    // Calculate stage statistics
    const stageStats = {
      1: { count: 0, name: "1 Gün", color: "#ffeb3b" },
      2: { count: 0, name: "1 Hafta", color: "#ff9800" },
      3: { count: 0, name: "1 Ay", color: "#f44336" },
      4: { count: 0, name: "3 Ay", color: "#9c27b0" },
      5: { count: 0, name: "6 Ay", color: "#3f51b5" },
      6: { count: 0, name: "1 Yıl", color: "#4caf50" },
      7: { count: 0, name: "Öğrenildi", color: "#2e7d32" }
    };

    learned.forEach(word => {
      if (stageStats[word.stageId]) {
        stageStats[word.stageId].count++;
      }
    });

    setStats({
      totalWords,
      learnedCount,
      progressPercentage,
      stageStats
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/logon');
  };

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

  const totalStageWords = Object.values(stats.stageStats).reduce((sum, stage) => sum + stage.count, 0);

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
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="16"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#3F37A5"
                strokeWidth="16"
                strokeDasharray={`${stats.progressPercentage * 5.03} 502`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="progress-stroke"
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
          {Object.entries(stats.stageStats).map(([stageId, stage]) => {
            const percentage = totalStageWords > 0 ? (stage.count / totalStageWords) * 100 : 0;
            return (
              <div key={stageId} className="stage-item">
                <div className="stage-info">
                  <div 
                    className="stage-color" 
                    style={{ backgroundColor: stage.color }}
                  ></div>
                  <span className="stage-name">{stage.name}</span>
                  <span className="stage-count">{stage.count}</span>
                </div>
                <div className="stage-bar">
                  <div 
                    className="stage-fill" 
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: stage.color 
                    }}
                  ></div>
                </div>
                <span className="stage-percentage">{Math.round(percentage)}%</span>
              </div>
            );
          })}
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
            onClick={() => navigate('/dashboard')}
          >
            <span className="action-icon">📊</span>
            <div className="action-content">
              <h4>Dashboard</h4>
              <p>Genel durumu görüntüle</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
} 