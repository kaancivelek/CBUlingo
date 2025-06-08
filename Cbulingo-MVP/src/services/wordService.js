//Kaan Civelek

import request from "./api";
export const getAllEnWords = async () => request('/tblEnglish', 'GET');
export const getEnWordByName = async (name) => request(`/tblEnglish?enName=${name}`, 'GET');
export const getEnWordById = async (id) => request(`/tblEnglish/${id}`, 'GET');
export const getEnWordByEnId = async (enId) => request(`/tblEnglish?enId=${enId}`, 'GET');
export const getTrWordById = async (id) => request(`/tblTurkish/${id}`, 'GET');
export const getTrWordByTrId = async (trId) => request(`/tblTurkish?trId=${trId}`, 'GET');
export const getLearningStages = async () => request('/tblLearningStages', 'GET');
export const getTranslationByEnId = async (id) => request(`/tblTranslation?enId=${id}`, 'GET');
export const getLearnedWordsByUserId = async (userId) => request(`/tblLearnedWords?userId=${userId}`, 'GET');

export const deleteEnWord = async (id) => request(`/tblEnglish/${id}`, 'DELETE');
export const deleteTrWord = async (id) => request(`/tblTurkish/${id}`, 'DELETE');
export const deleteTranslation = async (id) => request(`/tblTranslation/${id}`, 'DELETE');
export const deleteLearnedWord = async (id) => request(`/tblLearnedWords/${id}`, 'DELETE');

export const updateEnWord = async (id, data) => request(`/tblEnglish/${id}`, 'PUT', data);
export const updateTrWord = async (id, data) => request(`/tblTurkish/${id}`, 'PUT', data);
export const updateTranslation = async (id, data) => request(`/tblTranslation/${id}`, 'PUT', data);
export const updateLearningStage = async (id, data) => request(`/tblLearningStages/${id}`, 'PUT', data);

export const createEnWord = async (data) => request('/tblEnglish', 'POST', data);
export const createTrWord = async (data) => request('/tblTurkish', 'POST', data);
export const createTranslation = async (data) => request('/tblTranslation', 'POST', data);
export const createLearnedWord = async (data) => request('/tblLearnedWords', 'POST', data);


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