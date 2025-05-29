import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getQuizWord, updateWordProgress } from '../../utils/WordController';
import '../styles/Quiz.css';

export default function Quiz({ user }) {
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const loadNewWord = async () => {
    setLoading(true);
    setAnimationClass('fade-out');
    
    setTimeout(async () => {
      try {
        const result = await getQuizWord(user.userId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        
        setCurrentWord(result);
        setUserAnswer('');
        setShowResult(false);
        setAnimationClass('fade-in');
      } catch (error) {
        toast.error('Kelime yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.warning('Lütfen bir cevap girin');
      return;
    }

    setLoading(true);
    const correct = userAnswer.toLowerCase().trim() === currentWord.trWord.trName.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    setTotalQuestions(prev => prev + 1);

    // Update progress in database
    const result = await updateWordProgress(user.userId, currentWord.enWord.enId, correct);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      setAnimationClass('correct-bounce');
      
      if (result.success) {
        toast.success(result.success);
      }
    } else {
      setStreak(0);
      setAnimationClass('wrong-shake');
      toast.error('Yanlış cevap!');
    }

    setLoading(false);
  };

  const handleNextWord = () => {
    setAnimationClass('slide-out');
    setTimeout(() => {
      loadNewWord();
    }, 300);
  };

  const startGame = () => {
    setGameStarted(true);
    setStreak(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    loadNewWord();
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentWord(null);
    setUserAnswer('');
    setShowResult(false);
    setStreak(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setAnimationClass('');
  };

  const getStageInfo = (stage) => {
    const stages = [
      { name: "Yeni", color: "#e0e0e0", next: "1 gün" },
      { name: "1 Gün", color: "#ffeb3b", next: "1 hafta" },
      { name: "1 Hafta", color: "#ff9800", next: "1 ay" },
      { name: "1 Ay", color: "#f44336", next: "3 ay" },
      { name: "3 Ay", color: "#9c27b0", next: "6 ay" },
      { name: "6 Ay", color: "#3f51b5", next: "1 yıl" },
      { name: "1 Yıl", color: "#4caf50", next: "tamamlandı" },
      { name: "Öğrenildi", color: "#2e7d32", next: "bitmiş" }
    ];
    return stages[stage] || stages[0];
  };

  if (!gameStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-welcome">
          <div className="welcome-content">
            <h1 className="welcome-title">🎯 Kelime Quizi</h1>
            <p className="welcome-subtitle">
              İngilizce kelimelerin Türkçe karşılıklarını bularak öğrenmeye devam et!
            </p>
            <div className="welcome-features">
              <div className="feature">
                <span className="feature-icon">📚</span>
                <span>Spaced Repetition ile öğren</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔥</span>
                <span>Streak'ini koruyarak devam et</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <span>7 seviyeyi tamamla</span>
              </div>
            </div>
            <button className="start-button" onClick={startGame}>
              Quiz'i Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !currentWord) {
    return (
      <div className="quiz-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Kelime yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="quiz-container">
        <div className="error-message">
          <h2>Kelime bulunamadı</h2>
          <button className="retry-button" onClick={loadNewWord}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const stageInfo = getStageInfo(currentWord.currentStage);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="quiz-container">
      {/* Header Stats */}
      <div className="quiz-header">
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">🔥 Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">📊 Başarı</span>
          </div>
          <div className="stat">
            <span className="stat-value">{correctAnswers}/{totalQuestions}</span>
            <span className="stat-label">✅ Doğru</span>
          </div>
        </div>
        <button className="reset-button" onClick={resetGame}>
          Sıfırla
        </button>
      </div>

      {/* Main Quiz Area */}
      <div className={`quiz-card ${animationClass}`}>
        {/* Word Stage Indicator */}
        <div className="stage-indicator">
          <div 
            className="stage-badge" 
            style={{ backgroundColor: stageInfo.color }}
          >
            {stageInfo.name}
          </div>
          {currentWord.currentStage < 7 && (
            <span className="next-review">
              Sonraki tekrar: {stageInfo.next}
            </span>
          )}
        </div>

        {/* Question */}
        <div className="question-section">
          <h2 className="question-title">Bu kelimenin Türkçe karşılığı nedir?</h2>
          
          <div className="word-display">
            <span className="english-word">{currentWord.enWord.enWord}</span>
            {currentWord.translation.enExample && (
              <div className="example-sentence">
                <span className="example-label">Örnek kullanım:</span>
                <p className="example-text">"{currentWord.translation.enExample}"</p>
              </div>
            )}
          </div>

          {currentWord.translation.picUrl && (
            <div className="word-image">
              <img 
                src={currentWord.translation.picUrl} 
                alt={currentWord.enWord.enWord}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Answer Section */}
        {!showResult ? (
          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Türkçe karşılığını yazın..."
              className="answer-input"
              autoFocus
              disabled={loading}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !userAnswer.trim()}
            >
              {loading ? 'Kontrol Ediliyor...' : 'Cevapla'}
            </button>
          </form>
        ) : (
          <div className={`result-section ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-content">
              <div className="result-icon">
                {isCorrect ? '🎉' : '❌'}
              </div>
              <div className="result-text">
                <h3>{isCorrect ? 'Tebrikler!' : 'Yanlış'}</h3>
                <p>
                  {isCorrect 
                    ? `"${currentWord.trWord.trName}" doğru cevap!` 
                    : `Doğru cevap: "${currentWord.trWord.trName}"`
                  }
                </p>
                {isCorrect && currentWord.isNew && (
                  <p className="new-word-message">✨ Yeni kelime öğrendin!</p>
                )}
              </div>
            </div>
            <button 
              className="next-button"
              onClick={handleNextWord}
            >
              Sonraki Kelime →
            </button>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="quiz-footer">
        <div className="progress-info">
          <span>Bu quiz ile kelime dağarcığını geliştiriyorsun! 🚀</span>
        </div>
      </div>
    </div>
  );
}
