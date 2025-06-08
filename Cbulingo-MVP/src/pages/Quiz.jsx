import React, { useState } from 'react';
import { getQuizWord, updateWordProgress } from '../../utils/WordController';
import {
  QUIZ_PHASES,
  QUESTION_LIMITS,
  createInitialGameState,
  updateGameStats,
  validateAnswer,
  isGameFinished,
  getStageClass,
  handleQuizError,
  createSpeechUtterance
} from '../utils/quizHelpers';
import '../styles/Quiz.css';

export default function Quiz({ user }) {
  const [gameState, setGameState] = useState(createInitialGameState());
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      showMessage('Tarayıcınız ses özelliğini desteklemiyor', 'error');
      return;
    }

    speechSynthesis.cancel();
    const utterance = createSpeechUtterance(text);
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      showMessage('Ses hatası', 'error');
    };

    speechSynthesis.speak(utterance);
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, phase: QUIZ_PHASES.PLAYING }));
    loadNewWord();
  };

  const loadNewWord = async () => {
    setLoading(true);
    try {
      const result = await getQuizWord(user.userId);
      if (result.error) throw new Error(result.error);
      
      setGameState(prev => ({
        ...prev,
        currentWord: result,
        userAnswer: '',
        showResult: false
      }));
    } catch (error) {
      showMessage(handleQuizError(error, 'Kelime yüklenemedi'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!gameState.userAnswer.trim()) {
      showMessage('Lütfen bir cevap girin', 'warning');
      return;
    }

    setLoading(true);
    const isCorrect = validateAnswer(gameState.userAnswer, gameState.currentWord.trWord.trName);
    
    try {
      await updateWordProgress(user.userId, gameState.currentWord.enWord.enId, isCorrect);
      
      const updatedState = updateGameStats(gameState, isCorrect);
      setGameState(updatedState);

      if (isGameFinished(updatedState.currentQuestion, updatedState.maxQuestions)) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, phase: QUIZ_PHASES.FINISHED }));
        }, 2000);
      }

      showMessage(isCorrect ? 'Doğru!' : 'Yanlış', isCorrect ? 'success' : 'error');
    } catch (error) {
      showMessage(handleQuizError(error, 'Cevap kaydedilemedi'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => loadNewWord();

  const resetQuiz = () => {
    setGameState(createInitialGameState(gameState.maxQuestions));
    speechSynthesis.cancel();
    setSpeaking(false);
    setMessage('');
  };

  const MessageBar = () => {
    if (!message) return null;
    
    return (
      <div className={`message-bar message-${message.type}`}>
        {message.text}
      </div>
    );
  };

  const SetupScreen = () => (
    <div className="quiz-welcome">
      <div className="welcome-content">
        <h1 className="welcome-title">🎯 Kelime Quizi</h1>
        <p className="welcome-subtitle">Soru sayısını seç ve quiz'e başla!</p>

        <div className="question-range">
          <label>
            Soru Sayısı: <span className="range-value">{gameState.maxQuestions}</span>
          </label>
          <input
            type="range"
            min={QUESTION_LIMITS.MIN}
            max={QUESTION_LIMITS.MAX}
            value={gameState.maxQuestions}
            onChange={(e) => setGameState(prev => ({
              ...prev,
              maxQuestions: Number(e.target.value)
            }))}
          />
          <div className="range-labels">
            <span>{QUESTION_LIMITS.MIN}</span>
            <span>{QUESTION_LIMITS.MAX}</span>
          </div>
        </div>

        <button className="start-button" onClick={startGame}>
          Quiz'i Başlat
        </button>
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Kelime yükleniyor...</p>
    </div>
  );

  const ErrorMessage = () => (
    <div className="error-message">
      <h2>Kelime bulunamadı</h2>
      <button className="retry-button" onClick={loadNewWord}>
        Tekrar Dene
      </button>
    </div>
  );

  const QuizHeader = () => (
    <div className="quiz-header">
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{gameState.currentQuestion}/{gameState.maxQuestions}</span>
          <span className="stat-label">📊 Soru</span>
        </div>
        <div className="stat">
          <span className="stat-value">{gameState.stats.accuracy}%</span>
          <span className="stat-label">🎯 Başarı</span>
        </div>
        <div className="stat">
          <span className="stat-value">{gameState.stats.streak}</span>
          <span className="stat-label">🔥 Streak</span>
        </div>
      </div>
      <button className="reset-button" onClick={resetQuiz}>
        Sıfırla
      </button>
    </div>
  );

  const WordDisplay = ({ word }) => (
    <div className="word-display">
      <div className="english-word-container">
        <span className="english-word">{word.enWord.enWord}</span>
        <button 
          className={`speak-button ${speaking ? 'speaking' : ''}`}
          onClick={() => speak(word.enWord.enWord)}
          disabled={speaking}
          title="Kelimeyi sesli okut"
        >
          {speaking ? '🔊' : '🔈'}
        </button>
      </div>

      {word.translation.enExample && (
        <div className="example-sentence">
          <span className="example-label">Örnek kullanım:</span>
          <div className="example-content">
            <p className="example-text">"{word.translation.enExample}"</p>
            <button 
              className={`speak-button speak-button-small ${speaking ? 'speaking' : ''}`}
              onClick={() => speak(word.translation.enExample)}
              disabled={speaking}
              title="Örnek cümleyi sesli okut"
            >
              {speaking ? '🔊' : '🔈'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AnswerForm = () => (
    <div className="answer-form">
      <input
        type="text"
        value={gameState.userAnswer}
        onChange={(e) => setGameState(prev => ({
          ...prev,
          userAnswer: e.target.value
        }))}
        placeholder="Türkçe karşılığını yazın..."
        className="answer-input"
        autoFocus
        disabled={loading}
        onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
      />
      <button 
        onClick={submitAnswer}
        className="submit-button"
        disabled={loading || !gameState.userAnswer.trim()}
      >
        {loading ? 'Kontrol Ediliyor...' : 'Cevapla'}
      </button>
    </div>
  );

  const ResultSection = () => {
    const isCorrect = validateAnswer(gameState.userAnswer, gameState.currentWord.trWord.trName);
    
    return (
      <div className={`result-section ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="result-content">
          <div className="result-icon">
            {isCorrect ? '🎉' : '❌'}
          </div>
          <div className="result-text">
            <h3>{isCorrect ? 'Tebrikler!' : 'Yanlış'}</h3>
            <p>Doğru cevap: "{gameState.currentWord.trWord.trName}"</p>
          </div>
        </div>
        <button className="next-button" onClick={nextQuestion}>
          Sonraki Soru →
        </button>
      </div>
    );
  };

  const GameScreen = () => {
    if (loading && !gameState.currentWord) return <LoadingSpinner />;
    if (!gameState.currentWord) return <ErrorMessage />;

    return (
      <>
        <QuizHeader />
        <div className="quiz-card">
          <div className="stage-indicator">
            <div className={`stage-badge ${getStageClass(gameState.currentWord.currentStage)}`}>
              Seviye {gameState.currentWord.currentStage}
            </div>
          </div>

          <div className="question-section">
            <h2 className="question-title">Bu kelimenin Türkçe karşılığı nedir?</h2>
            <WordDisplay word={gameState.currentWord} />
          </div>

          {gameState.showResult ? <ResultSection /> : <AnswerForm />}
        </div>
      </>
    );
  };

  const FinishedScreen = () => (
    <div className="quiz-welcome">
      <div className="welcome-content">
        <h1 className="welcome-title">🎉 Quiz Tamamlandı!</h1>
        <div className="final-stats">
          <div className="final-stat">
            <span className="final-stat-value">{gameState.stats.correct}/{gameState.stats.total}</span>
            <span className="final-stat-label">Doğru Cevap</span>
          </div>
          <div className="final-stat">
            <span className="final-stat-value">{gameState.stats.accuracy}%</span>
            <span className="final-stat-label">Başarı Oranı</span>
          </div>
        </div>
        <button className="start-button" onClick={resetQuiz}>
          Yeni Quiz Başlat
        </button>
      </div>
    </div>
  );

  return (
    <div className="quiz-container">
      <MessageBar />
      {gameState.phase === QUIZ_PHASES.SETUP && <SetupScreen />}
      {gameState.phase === QUIZ_PHASES.PLAYING && <GameScreen />}
      {gameState.phase === QUIZ_PHASES.FINISHED && <FinishedScreen />}
    </div>
  );
}