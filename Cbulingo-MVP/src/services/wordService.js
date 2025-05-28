//Kaan Civelek

import request from "./api";
export const getAllEnWords = async () => request('/tblEnglish', 'GET');
export const getEnWordByName = async (name) => request(`/tblEnglish?enName=${name}`, 'GET');
export const getEnWordById = async (id) => request(`/tblEnglish?enId=${id}`, 'GET');
export const getTrWordById = async (id) => request(`/tblTurkish?trId=${id}`, 'GET');
export const getLearningStages = async () => request('/tblLearningStages', 'GET');
export const getTranslationByEnId = async (id) => request(`/tblTranslation?enId=${id}`, 'GET');
export const getLearnedWordsByUserId = async (userId) => request(`/tblLearnedWords?userId=${userId}`, 'GET');

export const deleteEnWord = async (id) => request(`/tblEnglish?enId=${id}`, 'DELETE');
export const deleteTrWord = async (id) => request(`/tblTurkish?trId=${id}`, 'DELETE');
export const deleteTranslation = async (id) => request(`/tblTranslation?trId=${id}`, 'DELETE');
export const deleteLearnedWord = async (enId) => request(`/tblLearnedWords?enId=${enId}`, 'DELETE');

export const updateEnWord = async (id, data) => request(`/tblEnglish?enId=${id}`, 'PUT', data);
export const updateTrWord = async (id, data) => request(`/tblTurkish?trId=${id}`, 'PUT', data);
export const updateTranslation = async (id, data) => request(`/tblTranslation?trId=${id}`, 'PUT', data);
export const updateLearningStage = async (enId, data) => request(`/tblLearningStages?stageId=${enId}`, 'PUT', data);

export const createEnWord = async (data) => request('/tblEnglish', 'POST', data);
export const createTrWord = async (data) => request('/tblTurkish', 'POST', data);
export const createTranslation = async (data) => request('/tblTranslation', 'POST', data);


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