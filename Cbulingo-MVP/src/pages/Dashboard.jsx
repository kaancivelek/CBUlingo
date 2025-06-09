import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLearnedWordsByUserId,
  getAllEnWords,
} from "../services/wordService";
import { getAllUsers } from "../services/userService";
import {
  calculateCompleteStats,
  calculateStagePercentages,
} from "../utils/statsCalculation";
import { exportProgressToPDF } from "../utils/pdfGenerator";

import "../styles/Dashboard.css";

/**
 * SVG configuration for circular progress chart
 */
const SVG_CONFIG = {
  CENTER: 100,
  RADIUS: 80,
  CIRCUMFERENCE: 502.4, // 2 * π * radius
};

/**
 * Dashboard component that displays user's learning progress and statistics
 * Includes leaderboard rankings and PDF export functionality
 */
export default function Dashboard() {
  // State management
  const [learnedWords, setLearnedWords] = useState([]);
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

  /**
   * Initialize dashboard data on component mount
   */
  useEffect(() => {
    initializeDashboard();
  }, [navigate]);

  /**
   * Load and initialize all dashboard data
   * Fetches user data, learned words, and calculates statistics
   */
  const initializeDashboard = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/logon");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch all required data in parallel
      const [learnedWordsData, allWordsData, allUsersData] = await Promise.all([
        getLearnedWordsByUserId(parsedUser.userId),
        getAllEnWords(),
        getAllUsers()
      ]);

      // Enrich learned words with English and Turkish translations
      const enrichedLearnedWords = (learnedWordsData || []).map(lw => {
        const enWordObj = (allWordsData || []).find(w => w.enId === lw.enId);
        return {
          ...lw,
          enWord: enWordObj?.enWord || '',
          trWord: enWordObj?.trWord || '',
        };
      });

      setLearnedWords(enrichedLearnedWords);

      // Calculate user statistics
      const calculatedStats = calculateCompleteStats(
        learnedWordsData || [],
        allWordsData || []
      );

      // Calculate top users rankings
      const topUsersData = await calculateTopUsers(allUsersData.data || allUsersData || []);

      setStats(calculatedStats);
      setTopUsers(topUsersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate rankings for all users based on their learning progress
   * @param {Array} users - Array of user objects
   * @returns {Array} Sorted array of users with their scores
   */
  const calculateTopUsers = async (users) => {
    try {
      const userRankings = await Promise.all(
        users.map(async (userData) => {
          try {
            const learnedWordsResponse = await getLearnedWordsByUserId(
              userData.userId
            );
            const learnedWords =
              learnedWordsResponse.data || learnedWordsResponse || [];

            // Calculate total score (0.5 points per stage)
            const totalScore = learnedWords.reduce((total, word) => {
              return total + word.stageId * 0.5;
            }, 0);

            // Word count
            const wordCount = learnedWords.length;

            return {
              userId: userData.userId,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: totalScore,
              wordCount: wordCount,
              learnedWords: learnedWords,
            };
          } catch (error) {
            console.error(
              `Error fetching words for user ${userData.userFullName}:`,
              error
            );
            return {
              userId: userData.userId,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: 0,
              wordCount: 0,
              learnedWords: [],
            };
          }
        })
      );

      // Sort by score (highest to lowest)
      const sortedRankings = userRankings.sort(
        (a, b) => b.totalScore - a.totalScore
      );

      return sortedRankings;
    } catch (error) {
      console.error("Error calculating top users:", error);
      return [];
    }
  };

  /**
   * Handle PDF export of user's progress
   */
  const handleExportPDF = async () => {
    if (!user || !stats) {
      alert("Veri yüklenirken PDF oluşturulamaz. Lütfen bekleyin.");
      return;
    }

    setExportingPDF(true);

    try {
      // Find user's rank from topUsers
      const userRank = topUsers.findIndex((u) => u.userId === user.userId) + 1;
      const finalRank = userRank > 0 ? userRank : null;

      await exportProgressToPDF(user, stats, finalRank, learnedWords);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setExportingPDF(false);
    }
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

  // Loading state
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

  // No user state
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

  // Calculate stage percentages for progress visualization
  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats);

  return (
    <div className="dashboard-container">
      {/* Welcome header section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1 className="welcome-title">Hoş geldin, {user.userFullName}! 👋</h1>
          <p className="welcome-subtitle">
            Bugün yeni kelimeler öğrenmeye hazır mısın?
          </p>
        </div>

        {/* PDF export section */}
        <div className="export-section">
          <button
            className={`export-pdf-btn ${exportingPDF ? "loading" : ""}`}
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

      {/* Quick statistics overview */}
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
            <h3 className="stat-number">{stats.totalWords}</h3>
            <p className="stat-label">Toplam Kelime</p>
          </div>
        </div>
      </div>

      {/* Progress visualization section */}
      <div className="progress-section">
        <div className="progress-chart">
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

        {/* Stage progress information */}
        <div className="stage-progress">
          <h3>Öğrenme Seviyeleri</h3>
          {Object.entries(stageStatsWithPercentages).map(([stage, data]) => (
            <div key={stage} className="stage-item">
              <div className="stage-info">
                <span className="stage-label">Seviye {stage}</span>
                <span className="stage-count">({data.count} kelime)</span>
              </div>
              <div className="stage-bar">
                <div 
                  className="stage-progress-fill"
                  style={{ width: `${data.percentage}%` }}
                />
              </div>
              <span className="stage-percentage">{data.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard section */}
      <div className="leaderboard-section">
        <h2>🏆 Liderlik Tablosu</h2>
        <div className="leaderboard">
          {topUsers.slice(0, 5).map((user, index) => (
            <div 
              key={user.userId} 
              className={`leaderboard-item ${user.userId === user.userId ? 'current-user' : ''}`}
            >
              <div className="rank">{index + 1}</div>
              <div className="user-info">
                <span className="user-name">{user.userFullName}</span>
                <span className="user-score">{user.totalScore.toFixed(1)} puan</span>
              </div>
              <div className="user-stats">
                <span className="word-count">{user.wordCount} kelime</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
