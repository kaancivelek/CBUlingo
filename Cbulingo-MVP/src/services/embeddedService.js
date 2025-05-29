// Embedded Database Service - Mobile için localStorage tabanlı veri yönetimi
import { database, generateId } from '../data/database.js';

// LocalStorage key'leri
const STORAGE_KEYS = {
  USERS: 'cbu_users',
  LEARNED_WORDS: 'cbu_learned_words',
  LEARNING_STAGES: 'cbu_learning_stages'
};

// İnitial data'yı localStorage'a yükle (ilk çalıştırmada)
const initializeDatabase = () => {
  // Sadece veriler yoksa initialize et
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(database.tblUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS)) {
    localStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(database.tblLearnedWords));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEARNING_STAGES)) {
    localStorage.setItem(STORAGE_KEYS.LEARNING_STAGES, JSON.stringify(database.tblLearningStages));
  }
};

// Database helper fonksiyonları
const getTable = (tableName) => {
  const storageKey = STORAGE_KEYS[tableName.toUpperCase()];
  if (storageKey) {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  }
  
  // Statik tablolar için (tblEnglish, tblTurkish, tblTranslation)
  switch (tableName) {
    case 'tblEnglish':
      return database.tblEnglish;
    case 'tblTurkish':
      return database.tblTurkish;
    case 'tblTranslation':
      return database.tblTranslation;
    default:
      return [];
  }
};

const saveTable = (tableName, data) => {
  const storageKey = STORAGE_KEYS[tableName.toUpperCase()];
  if (storageKey) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
};

// User Service Functions
export const getUserByEmail = async (email) => {
  initializeDatabase();
  const users = getTable('users');
  const user = users.filter(u => u.userEmail === email);
  return user.length > 0 ? user : null;
};

export const createUser = async (userData) => {
  initializeDatabase();
  const users = getTable('users');
  const newUser = {
    ...userData,
    id: generateId()
  };
  users.push(newUser);
  saveTable('users', users);
  return newUser;
};

export const updateUserPasswordById = async (userId, updateData) => {
  initializeDatabase();
  const users = getTable('users');
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updateData };
    saveTable('users', users);
    return users[userIndex];
  }
  return null;
};

// Word Service Functions
export const getAllEnWords = async () => {
  return getTable('tblEnglish');
};

export const getEnWordByEnId = async (enId) => {
  const words = getTable('tblEnglish');
  return words.filter(w => w.enId === parseInt(enId));
};

export const getTrWordByTrId = async (trId) => {
  const words = getTable('tblTurkish');
  return words.filter(w => w.trId === parseInt(trId));
};

export const getTranslationByEnId = async (enId) => {
  const translations = getTable('tblTranslation');
  return translations.filter(t => t.enId === parseInt(enId));
};

export const getLearnedWordsByUserId = async (userId) => {
  initializeDatabase();
  const learnedWords = getTable('learned_words');
  return learnedWords.filter(w => w.userId === parseInt(userId) || w.userID === parseInt(userId));
};

export const createLearnedWord = async (wordData) => {
  initializeDatabase();
  const learnedWords = getTable('learned_words');
  const newWord = {
    ...wordData,
    id: generateId()
  };
  learnedWords.push(newWord);
  saveTable('learned_words', learnedWords);
  return newWord;
};

export const updateLearnedWord = async (wordId, updateData) => {
  initializeDatabase();
  const learnedWords = getTable('learned_words');
  const wordIndex = learnedWords.findIndex(w => w.id === wordId);
  if (wordIndex !== -1) {
    learnedWords[wordIndex] = { ...learnedWords[wordIndex], ...updateData };
    saveTable('learned_words', learnedWords);
    return learnedWords[wordIndex];
  }
  return null;
};

// Initialize database on import
initializeDatabase(); 