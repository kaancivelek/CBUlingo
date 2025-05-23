import {
  getEnWordById,
  getTrWordById,
  getLearnedWordsByUserId,
  getTranslationByEnId,
  getAllWords,
  createEnWord,
  createTrWord,
  getEnWordByName,
  createTranslation,
  updateEnWord,
  updateTrWord,
  updateTranslation,
} from "../src/services/wordService";

// Pratik zamanı gelmiş mi kontrolü
function isPracticeTime(word, now) {
  const learningDate = new Date(word.learningDate);
  switch (word.stageId) {
    case 1:
      return now - learningDate >= 24 * 60 * 60 * 1000;
    case 2:
      return now - learningDate >= 7 * 24 * 60 * 60 * 1000;
    case 3:
      return now - learningDate >= 30 * 24 * 60 * 60 * 1000;
    case 4:
      return now - learningDate >= 90 * 24 * 60 * 60 * 1000;
    case 5:
      return now - learningDate >= 180 * 24 * 60 * 60 * 1000;
    case 6:
      return now - learningDate >= 365 * 24 * 60 * 60 * 1000;
    default:
      return false;
  }
}

export const createMixedWordPool = async (userId, count) => {
  try {
    const now = new Date();
    const learnedWords = await getLearnedWordsByUserId(userId);
    const allWords = await getAllWords();

    // Pratik zamanı gelmiş kelimeler
    const practiceWords = learnedWords.filter((word) =>
      isPracticeTime(word, now)
    );

    // Hiç öğrenilmemiş kelimeler (learnedWords'de olmayanlar)
    const learnedEnIds = new Set(learnedWords.map((w) => w.enId));
    const newWords = allWords.filter((word) => !learnedEnIds.has(word.enId));

    // İki havuzu birleştir
    const combined = [...practiceWords, ...newWords];

    // Rastgele shuffle
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    // İstenilen sayıda kelime seç
    const selected = combined.slice(0, count);

    // Detayları getir
    const wordPool = [];
    for (const word of selected) {
      const enWord = await getEnWordById(word.enId);
      const trWord = await getTrWordById(word.trId);
      const translation = await getTranslationByEnId(word.enId);

      wordPool.push({ enWord, trWord, translation });
    }

    return wordPool;
  } catch (error) {
    console.error("Error creating mixed word pool:", error);
    return { error: "Error creating mixed word pool" };
  }
};

export const addNewWord = async (enName, trName, picUrl,enExample) => {
  try {
    // Tüm İngilizce kelimeleri çek
    const allWords = await getAllWords();
    // En yüksek id'yi bul
    const maxEnId =
      allWords.length > 0
        ? Math.max(...allWords.map((w) => w.enId || w.id))
        : 0;
    const newId = maxEnId + 1;

    // Aynı kelime var mı kontrolü
    const enWord = await getEnWordByName(enName);
    const trWord = await getTrWordById(trName);
    if (enWord || trWord) {
      return { error: "Bu kelime zaten mevcut" };
    }

    // Yeni kelimeyi ekle
    const newEnWord = await createEnWord({ enId: newId, enWord: enName });
    const newTrWord = await createTrWord({ trId: newId, trName });
    const newTranslation = await createTranslation({
      trId: newId,
      enId: newId,
      picUrl,
      enExample,
    });
    if (newEnWord && newTrWord && newTranslation) {
      return { success: "Kelime başarıyla eklendi" };
    } else {
      return { error: "Kelime eklenirken hata oluştu" };
    }
  } catch (error) {
    console.error("Error adding new word:", error);
    return { error: "Error adding new word" };
  }
};

export const updateWord = async (enName, newEnName, newTrName, picUrl, enExample) => {
  try {
    const response = await getEnWordByName(enName);
    if (response && response.length > 0) {
      const wordId = response[0].enId;
      const updatedEnWord = { ...response[0], enWord: newEnName };
      const updatedTrWord = { trId: wordId, trName: newTrName };
      const updatedTranslation = { enId: wordId, trId: wordId, picUrl: picUrl, enExample: enExample };

      await updateEnWord(wordId, updatedEnWord);
      await updateTrWord(wordId, updatedTrWord);
      await updateTranslation(wordId, updatedTranslation);
      return { success: "Kelime güncellendi" };
    } else {
      return { error: "Kelime bulunamadı" };
    }
  } catch (error) {
    console.error("Kelime güncellenemedi:", error);
    return { error: "Kelime güncellenemedi" };
  }
};
