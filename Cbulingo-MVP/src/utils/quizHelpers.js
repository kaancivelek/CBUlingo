// Quiz Constants
export const QUIZ_PHASES = {
  SETUP: 'setup',
  PLAYING: 'playing',
  RESULT: 'result',
  FINISHED: 'finished'
};

export const QUESTION_LIMITS = {
  MIN: 5,
  MAX: 50,
  DEFAULT: 10
};

export const SPEECH_CONFIG = {
  RATE: 0.8,
  PITCH: 1,
  VOLUME: 1,
  LANGUAGE: 'en-US'
};

// Stage Configuration for CSS classes
export const STAGE_CLASSES = {
  0: 'stage-new',
  1: 'stage-1-day',
  2: 'stage-1-week', 
  3: 'stage-1-month',
  4: 'stage-3-months',
  5: 'stage-6-months',
  6: 'stage-1-year',
  7: 'stage-learned'
};

// Helper Functions
export const validateAnswer = (userAnswer, correctAnswer) => {
  if (!userAnswer || !correctAnswer) return false;
  return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
};

export const calculateAccuracy = (correct, total) => {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
};

export const calculateStreak = (isCorrect, currentStreak) => {
  return isCorrect ? currentStreak + 1 : 0;
};

export const isGameFinished = (current, max) => {
  return current >= max;
};

export const getStageClass = (stageId) => {
  return STAGE_CLASSES[stageId] || STAGE_CLASSES[0];
};

// Game State Helpers
export const createInitialGameState = (maxQuestions = QUESTION_LIMITS.DEFAULT) => ({
  phase: QUIZ_PHASES.SETUP,
  maxQuestions,
  currentQuestion: 0,
  currentWord: null,
  userAnswer: '',
  showResult: false,
  stats: {
    correct: 0,
    total: 0,
    streak: 0,
    accuracy: 0
  }
});

export const updateGameStats = (gameState, isCorrect) => {
  const newStats = {
    ...gameState.stats,
    total: gameState.stats.total + 1,
    correct: isCorrect ? gameState.stats.correct + 1 : gameState.stats.correct,
    streak: calculateStreak(isCorrect, gameState.stats.streak)
  };
  
  newStats.accuracy = calculateAccuracy(newStats.correct, newStats.total);
  
  return {
    ...gameState,
    stats: newStats,
    currentQuestion: gameState.currentQuestion + 1,
    showResult: true
  };
};

// Error Handler
export const handleQuizError = (error, defaultMessage = 'Bir hata oluştu') => {
  console.error('Quiz Error:', error);
  return error?.message || defaultMessage;
};

// TTS Helper  
export const createSpeechUtterance = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_CONFIG.LANGUAGE;
  utterance.rate = SPEECH_CONFIG.RATE;
  utterance.pitch = SPEECH_CONFIG.PITCH;
  utterance.volume = SPEECH_CONFIG.VOLUME;
  return utterance;
}; 