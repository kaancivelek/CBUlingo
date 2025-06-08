import { dbData } from '../utils/dbData';
import { englishWords } from '../utils/englishWords';
import { turkishWords } from '../utils/turkishWords';
import { translations, learnedWords } from '../utils/translations';

// LocalStorage anahtarları
const STORAGE_KEYS = {
  USERS: 'cbulingo_users',
  ENGLISH_WORDS: 'cbulingo_english_words',
  TURKISH_WORDS: 'cbulingo_turkish_words',
  TRANSLATIONS: 'cbulingo_translations',
  LEARNED_WORDS: 'cbulingo_learned_words',
  LEARNING_STAGES: 'cbulingo_learning_stages'
};

// LocalStorage'dan veri yükleme
const loadFromStorage = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// LocalStorage'a veri kaydetme
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// İlk yükleme
let users = loadFromStorage(STORAGE_KEYS.USERS, dbData.tblUsers);
let englishWordsList = loadFromStorage(STORAGE_KEYS.ENGLISH_WORDS, englishWords);
let turkishWordsList = loadFromStorage(STORAGE_KEYS.TURKISH_WORDS, turkishWords);
let translationsList = loadFromStorage(STORAGE_KEYS.TRANSLATIONS, translations);
let learnedWordsList = loadFromStorage(STORAGE_KEYS.LEARNED_WORDS, learnedWords);
let learningStages = loadFromStorage(STORAGE_KEYS.LEARNING_STAGES, dbData.tblLearningStages);

export const dataService = {
  // Kullanıcı işlemleri
  getUsers: () => users,
  getUserById: (userId) => users.find(user => user.userId === userId),
  getUserByEmail: (email) => {
    const userList = users.filter(user => user.userEmail === email);
    return userList.length > 0 ? userList[0] : null;
  },
  
  // Öğrenme aşamaları
  getLearningStages: () => learningStages,
  getStageById: (stageId) => learningStages.find(stage => stage.stageId === stageId),
  
  // Kelime işlemleri
  getEnglishWords: () => englishWordsList,
  getEnglishWordById: (enId) => englishWordsList.find(word => word.enId === enId),
  getEnglishWordByName: (name) => englishWordsList.find(word => word.enWord.toLowerCase() === name.toLowerCase()),
  
  getTurkishWords: () => turkishWordsList,
  getTurkishWordById: (trId) => turkishWordsList.find(word => word.trId === trId),
  
  // Çeviri işlemleri
  getTranslations: () => translationsList,
  getTranslationById: (id) => translationsList.find(trans => trans.id === id),
  getTranslationByEnId: (enId) => translationsList.find(trans => trans.enId === enId),
  
  // Öğrenilen kelimeler
  getLearnedWords: () => learnedWordsList,
  getLearnedWordsByUserId: (userId) => learnedWordsList.filter(word => word.userId === userId),
  getLearnedWordById: (id) => learnedWordsList.find(word => word.id === id),

  // Veri ekleme işlemleri
  addUser: (userData) => {
    const newUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 4),
      userId: users.length + 1
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  addEnglishWord: (wordData) => {
    const newWord = {
      ...wordData,
      id: Math.random().toString(36).substr(2, 4),
      enId: englishWordsList.length + 1
    };
    englishWordsList.push(newWord);
    saveToStorage(STORAGE_KEYS.ENGLISH_WORDS, englishWordsList);
    return newWord;
  },

  addTurkishWord: (wordData) => {
    const newWord = {
      ...wordData,
      id: Math.random().toString(36).substr(2, 4),
      trId: turkishWordsList.length + 1
    };
    turkishWordsList.push(newWord);
    saveToStorage(STORAGE_KEYS.TURKISH_WORDS, turkishWordsList);
    return newWord;
  },

  addTranslation: (translationData) => {
    const newTranslation = {
      ...translationData,
      id: Math.random().toString(36).substr(2, 4)
    };
    translationsList.push(newTranslation);
    saveToStorage(STORAGE_KEYS.TRANSLATIONS, translationsList);
    return newTranslation;
  },

  addLearnedWord: (learnedWordData) => {
    const newLearnedWord = {
      ...learnedWordData,
      id: Math.random().toString(36).substr(2, 4)
    };
    learnedWordsList.push(newLearnedWord);
    saveToStorage(STORAGE_KEYS.LEARNED_WORDS, learnedWordsList);
    return newLearnedWord;
  },

  // Veri güncelleme işlemleri
  updateUser: (email, userData) => {
    const userIndex = users.findIndex(user => user.userEmail === email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      saveToStorage(STORAGE_KEYS.USERS, users);
      return users[userIndex];
    }
    return null;
  },

  updateEnglishWord: (id, wordData) => {
    const wordIndex = englishWordsList.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
      englishWordsList[wordIndex] = { ...englishWordsList[wordIndex], ...wordData };
      saveToStorage(STORAGE_KEYS.ENGLISH_WORDS, englishWordsList);
      return englishWordsList[wordIndex];
    }
    return null;
  },

  updateTurkishWord: (id, wordData) => {
    const wordIndex = turkishWordsList.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
      turkishWordsList[wordIndex] = { ...turkishWordsList[wordIndex], ...wordData };
      saveToStorage(STORAGE_KEYS.TURKISH_WORDS, turkishWordsList);
      return turkishWordsList[wordIndex];
    }
    return null;
  },

  updateTranslation: (id, translationData) => {
    const translationIndex = translationsList.findIndex(trans => trans.id === id);
    if (translationIndex !== -1) {
      translationsList[translationIndex] = { ...translationsList[translationIndex], ...translationData };
      saveToStorage(STORAGE_KEYS.TRANSLATIONS, translationsList);
      return translationsList[translationIndex];
    }
    return null;
  },

  // Veri silme işlemleri
  deleteUser: (email) => {
    const userIndex = users.findIndex(user => user.userEmail === email);
    if (userIndex !== -1) {
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      saveToStorage(STORAGE_KEYS.USERS, users);
      return deletedUser;
    }
    return null;
  },

  deleteEnglishWord: (id) => {
    const wordIndex = englishWordsList.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
      const deletedWord = englishWordsList[wordIndex];
      englishWordsList.splice(wordIndex, 1);
      saveToStorage(STORAGE_KEYS.ENGLISH_WORDS, englishWordsList);
      return deletedWord;
    }
    return null;
  },

  deleteTurkishWord: (id) => {
    const wordIndex = turkishWordsList.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
      const deletedWord = turkishWordsList[wordIndex];
      turkishWordsList.splice(wordIndex, 1);
      saveToStorage(STORAGE_KEYS.TURKISH_WORDS, turkishWordsList);
      return deletedWord;
    }
    return null;
  },

  deleteTranslation: (id) => {
    const translationIndex = translationsList.findIndex(trans => trans.id === id);
    if (translationIndex !== -1) {
      const deletedTranslation = translationsList[translationIndex];
      translationsList.splice(translationIndex, 1);
      saveToStorage(STORAGE_KEYS.TRANSLATIONS, translationsList);
      return deletedTranslation;
    }
    return null;
  },

  deleteLearnedWord: (id) => {
    const learnedWordIndex = learnedWordsList.findIndex(word => word.id === id);
    if (learnedWordIndex !== -1) {
      const deletedLearnedWord = learnedWordsList[learnedWordIndex];
      learnedWordsList.splice(learnedWordIndex, 1);
      saveToStorage(STORAGE_KEYS.LEARNED_WORDS, learnedWordsList);
      return deletedLearnedWord;
    }
    return null;
  },

  // Verileri sıfırlama (test amaçlı)
  resetData: () => {
    users = [...dbData.tblUsers];
    englishWordsList = [...englishWords];
    turkishWordsList = [...turkishWords];
    translationsList = [...translations];
    learnedWordsList = [...learnedWords];
    learningStages = [...dbData.tblLearningStages];

    saveToStorage(STORAGE_KEYS.USERS, users);
    saveToStorage(STORAGE_KEYS.ENGLISH_WORDS, englishWordsList);
    saveToStorage(STORAGE_KEYS.TURKISH_WORDS, turkishWordsList);
    saveToStorage(STORAGE_KEYS.TRANSLATIONS, translationsList);
    saveToStorage(STORAGE_KEYS.LEARNED_WORDS, learnedWordsList);
    saveToStorage(STORAGE_KEYS.LEARNING_STAGES, learningStages);
  }
}; 