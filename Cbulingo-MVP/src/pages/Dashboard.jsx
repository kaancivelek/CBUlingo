import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLearnedWordsByUserId,
  getAllEnWords,
} from "../services/wordService";
import { getAllUsers } from "../services/userService"; // Bu import'u ekledik
import {
  calculateCompleteStats,
  calculateStagePercentages,
} from "../utils/statsCalculation";
import { exportProgressToPDF } from "../utils/pdfGenerator";

import "../styles/Dashboard.css";

// Constants
const SVG_CONFIG = {
  CENTER: 100,
  RADIUS: 80,
  CIRCUMFERENCE: 502.4, // 2 * π * radius
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalWords: 0,
    learnedCount: 0,
    progressPercentage: 0,
    stageStats: {},
  });
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, [navigate]);

  const initializeDashboard = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/logon");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Paralel olarak tüm verileri al
      const [learnedWordsData, allWordsData, allUsersData] = await Promise.all([
        getLearnedWordsByUserId(parsedUser.userId),
        getAllEnWords(),
        getAllUsers()
      ]);

      // Kullanıcının istatistiklerini hesapla
      const calculatedStats = calculateCompleteStats(
        learnedWordsData || [],
        allWordsData || []
      );

      // Top users verilerini hesapla
      const users = allUsersData.data || allUsersData || [];
      const topUsersData = await calculateTopUsers(users);

      setStats(calculatedStats);
      setTopUsers(topUsersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Top users hesaplama fonksiyonu (Leaderboard'dan esinlenerek)
  const calculateTopUsers = async (users) => {
    try {
      const userRankings = await Promise.all(
        users.map(async (userData) => {
          try {
            const learnedWordsResponse = await getLearnedWordsByUserId(userData.userId);
            const learnedWords = learnedWordsResponse.data || learnedWordsResponse || [];
            
            // Toplam puanı hesapla (her stage için 0.5 puan)
            const totalScore = learnedWords.reduce((total, word) => {
              return total + (word.stageId * 0.5);
            }, 0);

            // Kelime sayısı
            const wordCount = learnedWords.length;

            return {
              userId: userData.userId,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: totalScore,
              wordCount: wordCount,
              learnedWords: learnedWords
            };
          } catch (error) {
            console.error(`Error fetching words for user ${userData.userFullName}:`, error);
            return {
              userId: userData.userId,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: 0,
              wordCount: 0,
              learnedWords: []
            };
          }
        })
      );

      // Puana göre sırala (yüksekten düşüğe)
      const sortedRankings = userRankings.sort((a, b) => b.totalScore - a.totalScore);
      
      return sortedRankings;
    } catch (error) {
      console.error("Error calculating top users:", error);
      return [];
    }
  };

  // PDF Export fonksiyonu
  const handleExportPDF = async () => {
    if (!user || !stats) {
      alert("Veri yüklenirken PDF oluşturulamaz. Lütfen bekleyin.");
      return;
    }

    setExportingPDF(true);
    
    try {
      // Kullanıcının sıralama bilgisini bul (topUsers'dan)
      const userRank = topUsers.findIndex(u => u.userId === user.userId) + 1;
      const finalRank = userRank > 0 ? userRank : null;
      
      await exportProgressToPDF(user, stats, finalRank);
      
      // Başarılı mesajı (opsiyonel)
      // alert("PDF başarıyla oluşturuldu ve indirildi!");
      
    } catch (error) {
      console.error("PDF export error:", error);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setExportingPDF(false);
    }
  };

  const getProgressDashArray = (percentage) => {
    const progressLength = (percentage / 100) * SVG_CONFIG.CIRCUMFERENCE;
    return `${progressLength} ${SVG_CONFIG.CIRCUMFERENCE}`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">
          <div className="spinner-large"></div>
          <p>Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="error-dashboard">
          <h2>Kullanıcı bulunamadı</h2>
          <button className="btn-primary" onClick={() => navigate("/logon")}>
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Hoş geldin, {user.userFullName}! 👋</h1>
          <p className="welcome-subtitle">
            Bugün yeni kelimeler öğrenmeye hazır mısın?
          </p>
        </div>
        
        {/* PDF Export Button */}
        <div className="export-section">
          <button 
            className={`export-pdf-btn ${exportingPDF ? 'loading' : ''}`}
            onClick={handleExportPDF}
            disabled={exportingPDF}
          >
            {exportingPDF ? (
              <>
                <span className="export-spinner"></span>
                <span>PDF Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <span className="export-icon">📄</span>
                <span>İlerlemeni PDF Olarak Kaydet</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.learnedCount}</h3>
            <p className="stat-label">Öğrenilen Kelime</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.stageStats[7]?.count || 0}</h3>
            <p className="stat-label">Tamamlanan</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.progressPercentage}%</h3>
            <p className="stat-label">İlerleme</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3 className="stat-number">
              {stats.totalWords - stats.learnedCount}
            </h3>
            <p className="stat-label">Kalan Kelime</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Progress Section */}
        <div className="dashboard-card progress-section">
          <h2 className="card-title">📈 Öğrenme İlerlemen</h2>
          <div className="progress-content">
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
                  strokeDasharray={getProgressDashArray(
                    stats.progressPercentage
                  )}
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">
                  {stats.progressPercentage}%
                </span>
                <span className="progress-label">Tamamlandı</span>
              </div>
            </div>
            <div className="progress-details">
              <div className="progress-item">
                <span className="label">Toplam Kelime:</span>
                <span className="value">{stats.totalWords}</span>
              </div>
              <div className="progress-item">
                <span className="label">Öğrenilen:</span>
                <span className="value">{stats.learnedCount}</span>
              </div>
              <div className="progress-item">
                <span className="label">Kalan:</span>
                <span className="value">
                  {stats.totalWords - stats.learnedCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Distribution */}
        <div className="dashboard-card stages-section">
          <h2 className="card-title">🎓 Seviye Dağılımı</h2>
          <div className="stages-content">
            {Object.entries(stageStatsWithPercentages).map(
              ([stageId, stage]) => (
                <div key={stageId} className="stage-row">
                  <div className="stage-info">
                    <div className={`stage-indicator ${stage.cssClass}`}></div>
                    <span className="stage-name">{stage.name}</span>
                  </div>
                  <div className="stage-stats">
                    <span className="stage-count">{stage.count}</span>
                    <div className="stage-bar">
                      <div
                        className={`stage-fill ${stage.cssClass}`}
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    <span className="stage-percentage">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card actions-section">
          <h2 className="card-title">🚀 Hızlı İşlemler</h2>
          <div className="action-grid">
            <button
              className="action-btn quiz"
              onClick={() => navigate("/quiz")}
            >
              <span className="action-icon">🎯</span>
              <span className="action-text">Quiz Çöz</span>
            </button>

            <button
              className="action-btn profile"
              onClick={() => navigate("/profile")}
            >
              <span className="action-icon">👤</span>
              <span className="action-text">Profil</span>
            </button>

            <button
              className="action-btn leaderboard"
              onClick={() => navigate("/")}
            >
              <span className="action-icon">🏆</span>
              <span className="action-text">Sıralama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}