import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';
import { getLearnedWordsByUserId } from '../services/wordService';
import { calculateUserRankings } from '../utils/leaderboardUtils';
import '../styles/Leaderboard.css';

export default function Leaderboard() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    initializeLeaderboard();
  }, []);

  const initializeLeaderboard = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }

      const userRankings = await calculateUserRankings();
      setRankings(userRankings);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrophyIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getUserPosition = () => {
    if (!currentUser) return null;
    const userRank = rankings.findIndex(user => user.id === currentUser.id);
    return userRank !== -1 ? userRank + 1 : null;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-leaderboard">
          <div className="spinner-large"></div>
          <p>Sıralama yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="header-content">
          <h1 className="leaderboard-title">
            🏆 Liderlik Tablosu
          </h1>
          <p className="leaderboard-subtitle">
            Tamamen öğrenilen kelimelere göre sıralama
          </p>
        </div>
      </div>

      {/* Current User Position */}
      {currentUser && getUserPosition() && (
        <div className="current-user-card">
          <div className="current-user-info">
            <div className="user-avatar current">
              {currentUser.userFullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h3>Senin Sıran</h3>
              <p className="user-rank">#{getUserPosition()}</p>
            </div>
          </div>
          <div className="user-stats">
            <span className="completed-words">
              {rankings.find(u => u.id === currentUser.id)?.completedWords || 0} kelime
            </span>
          </div>
        </div>
      )}

      {/* Rankings List */}
      <div className="rankings-section">
        <div className="rankings-list">
          {rankings.map((user, index) => (
            <div 
              key={user.id} 
              className={`ranking-item ${currentUser?.id === user.id ? 'current-user' : ''}`}
            >
              <div className="rank-info">
                <div className="rank-number">
                  <span className="trophy">{getTrophyIcon(index + 1)}</span>
                  <span className="rank">#{index + 1}</span>
                </div>
                <div className="user-avatar">
                  {user.userFullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              
              <div className="user-info">
                <h3 className="user-name">{user.userFullName}</h3>
                <p className="user-email">{user.userEmail}</p>
              </div>
              
              <div className="user-stats">
                <div className="completed-count">
                  <span className="number">{user.completedWords}</span>
                  <span className="label">Kelime</span>
                </div>
                <div className="completion-rate">
                  <span className="percentage">{user.completionRate}%</span>
                  <span className="label">Tamamlama</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rankings.length === 0 && (
          <div className="empty-leaderboard">
            <div className="empty-icon">📈</div>
            <h3>Henüz sıralama yok</h3>
            <p>İlk lider olmak için kelime öğrenmeye başla!</p>
          </div>
        )}
      </div>
    </div>
  );
} 