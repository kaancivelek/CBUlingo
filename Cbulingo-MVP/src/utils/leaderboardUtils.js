import { getAllUsers } from '../services/userService';
import { getLearnedWordsByUserId, getAllEnWords } from '../services/wordService';

/**
 * Kullanıcıları tamamen öğrendikleri kelime sayısına göre sıralar
 */
export const calculateUserRankings = async () => {
  try {
    const users = await getAllUsers();
    const allWords = await getAllEnWords();
    const totalWordsCount = allWords.length;

    const userRankings = [];

    for (const user of users) {
      try {
        const learnedWords = await getLearnedWordsByUserId(user.id);
        
        // Stage 7'ye ulaşmış (tamamen öğrenilmiş) kelimeleri say
        const completedWords = learnedWords.filter(word => word.stageId === 7).length;
        
        // Tamamlama oranını hesapla
        const completionRate = totalWordsCount > 0 
          ? Math.round((completedWords / totalWordsCount) * 100)
          : 0;

        userRankings.push({
          id: user.id,
          userFullName: user.userFullName,
          userEmail: user.userEmail,
          completedWords: completedWords,
          totalLearned: learnedWords.length,
          completionRate: completionRate
        });
      } catch (error) {
        console.warn(`Error calculating stats for user ${user.id}:`, error);
        // Hata durumunda kullanıcıyı 0 kelime ile ekle
        userRankings.push({
          id: user.id,
          userFullName: user.userFullName,
          userEmail: user.userEmail,
          completedWords: 0,
          totalLearned: 0,
          completionRate: 0
        });
      }
    }

    // Tamamen öğrenilen kelime sayısına göre sırala (büyükten küçüğe)
    userRankings.sort((a, b) => {
      if (b.completedWords !== a.completedWords) {
        return b.completedWords - a.completedWords;
      }
      // Eşitlik durumunda toplam öğrenilen kelime sayısına göre sırala
      return b.totalLearned - a.totalLearned;
    });

    return userRankings;
  } catch (error) {
    console.error('Error calculating user rankings:', error);
    return [];
  }
};

/**
 * Belirli bir kullanıcının sıralamasını bulur
 */
export const getUserRank = async (userId) => {
  try {
    const rankings = await calculateUserRankings();
    const userIndex = rankings.findIndex(user => user.id === userId);
    return userIndex !== -1 ? userIndex + 1 : null;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return null;
  }
};

/**
 * Top N kullanıcıyı getirir
 */
export const getTopUsers = async (limit = 10) => {
  try {
    const rankings = await calculateUserRankings();
    return rankings.slice(0, limit);
  } catch (error) {
    console.error('Error getting top users:', error);
    return [];
  }
}; 