//Kaan Civelek

// Mobile için embedded database kullanan service
import { 
  getAllEnWords as embeddedGetAllEnWords,
  getEnWordByEnId as embeddedGetEnWordByEnId,
  getTrWordByTrId as embeddedGetTrWordByTrId,
  getTranslationByEnId as embeddedGetTranslationByEnId,
  getLearnedWordsByUserId as embeddedGetLearnedWordsByUserId,
  createLearnedWord as embeddedCreateLearnedWord,
  updateLearnedWord as embeddedUpdateLearnedWord
} from './embeddedService.js';

// Read operations (çoğunlukla statik veriler)
export const getAllEnWords = async () => {
  return await embeddedGetAllEnWords();
};

export const getEnWordByName = async (name) => {
  // Bu fonksiyon şu an kullanılmıyor, gerekirse implement edilebilir
  console.warn('getEnWordByName not implemented for embedded service');
  return null;
};

export const getEnWordById = async (id) => {
  // Bu fonksiyon şu an kullanılmıyor, gerekirse implement edilebilir
  console.warn('getEnWordById not implemented for embedded service');
  return null;
};

export const getEnWordByEnId = async (enId) => {
  return await embeddedGetEnWordByEnId(enId);
};

export const getTrWordById = async (id) => {
  // Bu fonksiyon şu an kullanılmıyor, gerekirse implement edilebilir
  console.warn('getTrWordById not implemented for embedded service');
  return null;
};

export const getTrWordByTrId = async (trId) => {
  return await embeddedGetTrWordByTrId(trId);
};

export const getLearningStages = async () => {
  // Learning stages statik veri olarak döndürülür
  return [
    { "stageId": 1, "stageName": "Next Day", "id": "572f" },
    { "stageId": 2, "stageName": "Next Week", "id": "0104" },
    { "stageId": 3, "stageName": "Next Month", "id": "c2b7" },
    { "stageId": 4, "stageName": "Next Three Months", "id": "7435" },
    { "stageId": 5, "stageName": "Next Six Months", "id": "17ac" },
    { "stageId": 6, "stageName": "Next Year", "id": "c11e" },
    { "stageId": 7, "stageName": "Learned", "id": "7124" }
  ];
};

export const getTranslationByEnId = async (id) => {
  return await embeddedGetTranslationByEnId(id);
};

export const getLearnedWordsByUserId = async (userId) => {
  return await embeddedGetLearnedWordsByUserId(userId);
};

// Delete operations (şu an implement edilmemiş, gerekirse eklenebilir)
export const deleteEnWord = async (id) => {
  console.warn('deleteEnWord not implemented for embedded service');
  return null;
};

export const deleteTrWord = async (id) => {
  console.warn('deleteTrWord not implemented for embedded service');
  return null;
};

export const deleteTranslation = async (id) => {
  console.warn('deleteTranslation not implemented for embedded service');
  return null;
};

export const deleteLearnedWord = async (id) => {
  console.warn('deleteLearnedWord not implemented for embedded service');
  return null;
};

// Update operations (şu an sadece learned words için implement edilmiş)
export const updateEnWord = async (id, data) => {
  console.warn('updateEnWord not implemented for embedded service');
  return null;
};

export const updateTrWord = async (id, data) => {
  console.warn('updateTrWord not implemented for embedded service');
  return null;
};

export const updateTranslation = async (id, data) => {
  console.warn('updateTranslation not implemented for embedded service');
  return null;
};

export const updateLearningStage = async (id, data) => {
  console.warn('updateLearningStage not implemented for embedded service');
  return null;
};

// Create operations (şu an sadece learned words için implement edilmiş)
export const createEnWord = async (data) => {
  console.warn('createEnWord not implemented for embedded service');
  return null;
};

export const createTrWord = async (data) => {
  console.warn('createTrWord not implemented for embedded service');
  return null;
};

export const createTranslation = async (data) => {
  console.warn('createTranslation not implemented for embedded service');
  return null;
};

export const createLearnedWord = async (data) => {
  return await embeddedCreateLearnedWord(data);
};


// [
//   {
//     "stageId": 1,
//     "stageName": "Next Day"
//   },
//   {
//     "stageId": 2,
//     "stageName": "Next Week"
//   },
//   {
//     "stageId": 3,
//     "stageName": "Next Month"
//   },
//   {
//     "stageId": 4,
//     "stageName": "Next Three Months"
//   },
//   {
//     "stageId": 5,
//     "stageName": "Next Six Months"
//   },
//   {
//     "stageId": 6,
//     "stageName": "Next Year"
//   },
//   {
//     "stageId": 7,
//     "stageName": "Learned"
//   }
// ]