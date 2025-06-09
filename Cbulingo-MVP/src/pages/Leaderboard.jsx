import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/userService';
import { getLearnedWordsByUserId } from '../services/wordService';
import '../styles/Leaderboard.css';

/**
 * Leaderboard component that displays user rankings based on learning progress
 * Shows current user's position and overall rankings with scores
 * @param {Object} user - Current user object
 */
export default function Leaderboard({ user }) {
  // State management
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  /**
   * Initialize leaderboard data on component mount
   */
  useEffect(() => {
    initializeLeaderboard();
  }, []);

  /**
   * Load and calculate rankings for all users
   * Fetches user data and their learned words to calculate scores
   */
  const initializeLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await getAllUsers();
      const users = usersResponse.data || usersResponse;

      // Calculate scores for each user
      const userRankings = await Promise.all(
        users.map(async (userData) => {
          try {
            const learnedWordsResponse = await getLearnedWordsByUserId(userData.userId);
            const learnedWords = learnedWordsResponse.data || learnedWordsResponse || [];
            
            // Calculate total score (0.5 points per stage)
            const totalScore = learnedWords.reduce((total, word) => {
              return total + (word.stageId * 0.5);
            }, 0);

            // Word count
            const wordCount = learnedWords.length;

            return {
              id: userData.userId,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: totalScore,
              wordCount: wordCount,
              learnedWords: learnedWords
            };
          } catch (error) {
            console.error(`Error fetching words for user ${userData.userFullName}:`, error);
            return {
              id: userData.userId || userData.id,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              totalScore: 0,
              wordCount: 0,
              learnedWords: []
            };
          }
        })
      );

      // Sort by score (highest to lowest)
      const sortedRankings = userRankings.sort((a, b) => b.totalScore - a.totalScore);
      
      setRankings(sortedRankings);
      
      // Find current user's data
      if (user) {
        const currentUserData = sortedRankings.find(u => 
          u.id === user.userId || u.id === user.id || u.userEmail === user.userEmail
        );
        setCurrentUser(currentUserData);
      }

    } catch (error) {
      console.error('Error initializing leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get trophy emoji based on rank
   * @param {number} rank - User's rank
   * @returns {string} Trophy emoji
   */
  const getTrophyIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  /**
   * Get current user's position in rankings
   * @returns {number|null} User's rank or null if not found
   */
  const getUserPosition = () => {
    if (!currentUser) return null;
    const userRank = rankings.findIndex(u => u.id === currentUser.id);
    return userRank !== -1 ? userRank + 1 : null;
  };

  // Loading state
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
      {/* Header section */}
      <div className="leaderboard-header">
        <div className="header-content">
          <h1 className="leaderboard-title">
            🏆 Liderlik Tablosu
          </h1>
          <p className="leaderboard-subtitle">
            Öğrenme seviyelerine göre puan sıralaması (Her seviye = 0.5 puan)
          </p>
        </div>
      </div>

      {/* Current user's position card */}
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
            <span className="score-display">
              {currentUser.totalScore.toFixed(1)} puan
            </span>
            <span className="word-count">
              {currentUser.wordCount} kelime
            </span>
          </div>
        </div>
      )}

      {/* Rankings list section */}
      <div className="rankings-section">
        <div className="rankings-list">
          {rankings.map((userData, index) => (
            <div 
              key={userData.id} 
              className={`ranking-item ${currentUser?.id === userData.id ? 'current-user' : ''}`}
            >
              <div className="rank-info">
                <div className="rank-number">
                  <span className="trophy">{getTrophyIcon(index + 1)}</span>
                  <span className="rank">#{index + 1}</span>
                </div>
                <div className="user-avatar">
                  {userData.userFullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              
              <div className="user-info">
                <h3 className="user-name">{userData.userFullName}</h3>
                <p className="user-email">{userData.userEmail}</p>
              </div>
              
              <div className="user-stats">
                <div className="score-display">
                  <span className="number">{userData.totalScore.toFixed(1)}</span>
                  <span className="label">Puan</span>
                </div>
                <div className="word-count">
                  <span className="number">{userData.wordCount}</span>
                  <span className="label">Kelime</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
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