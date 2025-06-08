// Constants for stage configuration
export const STAGE_CONFIG = {
  1: { name: "1 Gün", cssClass: "stage-1" },
  2: { name: "1 Hafta", cssClass: "stage-2" },
  3: { name: "1 Ay", cssClass: "stage-3" },
  4: { name: "3 Ay", cssClass: "stage-4" },
  5: { name: "6 Ay", cssClass: "stage-5" },
  6: { name: "1 Yıl", cssClass: "stage-6" },
  7: { name: "Öğrenildi", cssClass: "stage-7" }
};

/**
 * Calculate progress percentage
 * @param {number} learnedCount - Number of learned words
 * @param {number} totalCount - Total number of words
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgressPercentage = (learnedCount, totalCount) => {
  return totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;
};

/**
 * Calculate stage statistics from learned words
 * @param {Array} learnedWords - Array of learned words with stageId
 * @returns {Object} Stage statistics object
 */
export const calculateStageStats = (learnedWords) => {
  const stageStats = Object.keys(STAGE_CONFIG).reduce((acc, stageId) => {
    acc[stageId] = {
      count: 0,
      name: STAGE_CONFIG[stageId].name,
      cssClass: STAGE_CONFIG[stageId].cssClass
    };
    return acc;
  }, {});

  learnedWords.forEach(word => {
    if (stageStats[word.stageId]) {
      stageStats[word.stageId].count++;
    }
  });

  return stageStats;
};

/**
 * Calculate complete statistics for profile
 * @param {Array} learnedWords - Array of learned words
 * @param {Array} allWords - Array of all available words
 * @returns {Object} Complete statistics object
 */
export const calculateCompleteStats = (learnedWords, allWords) => {
  const learnedCount = learnedWords.length;
  const totalWords = allWords.length;
  const progressPercentage = calculateProgressPercentage(learnedCount, totalWords);
  const stageStats = calculateStageStats(learnedWords);

  return {
    totalWords,
    learnedCount,
    progressPercentage,
    stageStats
  };
};

/**
 * Calculate stage distribution percentages
 * @param {Object} stageStats - Stage statistics object
 * @returns {Object} Stage stats with percentages
 */
export const calculateStagePercentages = (stageStats) => {
  const totalStageWords = Object.values(stageStats).reduce((sum, stage) => sum + stage.count, 0);
  
  return Object.entries(stageStats).reduce((acc, [stageId, stage]) => {
    const percentage = totalStageWords > 0 ? Math.round((stage.count / totalStageWords) * 100) : 0;
    acc[stageId] = {
      ...stage,
      percentage
    };
    return acc;
  }, {});
}; 