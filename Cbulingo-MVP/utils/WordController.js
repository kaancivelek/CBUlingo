import {
  getEnWordByEnId,
  getTrWordByTrId,
  getLearnedWordsByUserId,
  getTranslationByEnId,
  getAllEnWords,
  createEnWord,
  createTrWord,
  createTranslation,
  createLearnedWord,
  updateEnWord,
  updateTrWord,
  updateTranslation,
} from "../src/services/wordService";

// Determines if a word is due for practice based on its learning stage
function isPracticeTime(word, now) {
  const learningDate = new Date(word.learningDate);
  // Different stages have different review intervals (in milliseconds)
  switch (word.stageId) {
    case 1: return now - learningDate >= 24 * 60 * 60 * 1000;      // 1 day
    case 2: return now - learningDate >= 7 * 24 * 60 * 60 * 1000;  // 1 week
    case 3: return now - learningDate >= 30 * 24 * 60 * 60 * 1000; // 1 month
    case 4: return now - learningDate >= 90 * 24 * 60 * 60 * 1000; // 3 months
    case 5: return now - learningDate >= 180 * 24 * 60 * 60 * 1000;// 6 months
    case 6: return now - learningDate >= 365 * 24 * 60 * 60 * 1000;// 1 year
    default: return false;
  }
}

// Creates a mixed pool of words for practice and learning
export const createMixedWordPool = async (userId, count) => {
  try {
    const now = new Date();
    const learnedWords = await getLearnedWordsByUserId(userId);
    const allWords = await getAllEnWords();

    // Get words that are due for practice
    const practiceWords = learnedWords.filter((word) =>
      isPracticeTime(word, now)
    );

    // Get words that haven't been learned yet
    const learnedEnIds = new Set(learnedWords.map((w) => w.enId));
    const newWords = allWords.filter((word) => !learnedEnIds.has(word.enId));

    // Build word pool with both practice and new words
    const wordPool = [];

    // Add practice words with their details
    for (const learnedWord of practiceWords) {
      try {
        const enWordArray = await getEnWordByEnId(learnedWord.enId);
        const enWord = enWordArray && enWordArray[0] ? enWordArray[0] : null;
        
        const translation = await getTranslationByEnId(learnedWord.enId);
        let trWord = null;
        
        if (translation && translation[0]) {
          const trWordArray = await getTrWordByTrId(translation[0].trId);
          trWord = trWordArray && trWordArray[0] ? trWordArray[0] : null;
        }

        if (enWord && trWord && translation) {
          wordPool.push({ 
            enWord, 
            trWord, 
            translation,
            source: 'practice',
            stageId: learnedWord.stageId 
          });
        }
      } catch (error) {
        console.warn(`Practice word with enId ${learnedWord.enId} could not be loaded:`, error.message);
      }
    }

    // Add new words with their details
    for (const newWord of newWords) {
      try {
        const translation = await getTranslationByEnId(newWord.enId);
        let trWord = null;
        
        if (translation && translation[0]) {
          const trWordArray = await getTrWordByTrId(translation[0].trId);
          trWord = trWordArray && trWordArray[0] ? trWordArray[0] : null;
        }

        if (trWord && translation) {
          wordPool.push({ 
            enWord: newWord, 
            trWord, 
            translation,
            source: 'new',
            stageId: null 
          });
        }
      } catch (error) {
        console.warn(`New word with enId ${newWord.enId} could not be loaded:`, error.message);
      }
    }

    // Shuffle word pool using cryptographically secure random numbers
    for (let i = wordPool.length - 1; i > 0; i--) {
      const j = Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * (i + 1));
      [wordPool[i], wordPool[j]] = [wordPool[j], wordPool[i]];
    }

    return wordPool.slice(0, count);
  } catch (error) {
    console.error("Error creating mixed word pool:", error);
    return { error: "Error creating mixed word pool" };
  }
};

// Adds a new word pair to the system
export const addNewWord = async (enName, trName, picUrl, enExample) => {
  try {
    // Get next available ID
    const allWords = await getAllEnWords();
    const maxEnId = allWords.length > 0 ? Math.max(...allWords.map((w) => w.enId || w.id)) : 0;
    const newId = maxEnId + 1;

    // Check for duplicate words
    const existingWords = await getAllEnWords();
    const isWordExists = existingWords.some(word => word.enWord.toLowerCase() === enName.toLowerCase());
    if (isWordExists) {
      return { error: "Bu İngilizce kelime zaten mevcut" };
    }

    // Create new word entries
    const newEnWord = await createEnWord({ enId: newId, enWord: enName });
    const newTrWord = await createTrWord({ trId: newId, trName });
    const newTranslation = await createTranslation({
      trId: newId,
      enId: newId,
      picUrl,
      enExample,
    });

    return newEnWord && newTrWord && newTranslation
      ? { success: "Kelime başarıyla eklendi" }
      : { error: "Kelime eklenirken hata oluştu" };
  } catch (error) {
    console.error("Error adding new word:", error);
    return { error: "Error adding new word" };
  }
};

// Updates an existing word pair
export const updateWord = async (enName, newEnWord, newTrWord, newPicUrl, newEnExampleUsage) => {
  try {
    // Find existing word
    const existingWords = await getAllEnWords();
    const existingWord = existingWords.find(word => word.enWord.toLowerCase() === enName.toLowerCase());
    
    if (!existingWord) {
      return { error: "Güncellenecek kelime bulunamadı" };
    }

    const enId = existingWord.enId || existingWord.id;

    // Check for duplicate new English word
    if (newEnWord && newEnWord.toLowerCase() !== enName.toLowerCase()) {
      const duplicateCheck = existingWords.find(word => word.enWord.toLowerCase() === newEnWord.toLowerCase());
      if (duplicateCheck) {
        return { error: "Bu İngilizce kelime zaten mevcut" };
      }
    }

    // Update English word
    if (newEnWord) {
      const updateEnResult = await updateEnWord(existingWord.id, { 
        enId: existingWord.enId, 
        enWord: newEnWord 
      });
      if (!updateEnResult) {
        return { error: "İngilizce kelime güncellenirken hata oluştu" };
      }
    }

    // Update Turkish word
    if (newTrWord) {
      const translation = await getTranslationByEnId(enId);
      if (translation && translation[0]) {
        const trWordArray = await getTrWordByTrId(translation[0].trId);
        const trWord = trWordArray && trWordArray[0] ? trWordArray[0] : null;
        if (trWord) {
          const updateTrResult = await updateTrWord(trWord.id, { 
            trId: trWord.trId, 
            trName: newTrWord 
          });
          if (!updateTrResult) {
            return { error: "Türkçe kelime güncellenirken hata oluştu" };
          }
        }
      }
    }

    // Update translation details
    if (newPicUrl || newEnExampleUsage) {
      const translation = await getTranslationByEnId(enId);
      if (translation && translation[0]) {
        const updateData = {
          enId: translation[0].enId,
          trId: translation[0].trId
        };
        if (newPicUrl) updateData.picUrl = newPicUrl;
        if (newEnExampleUsage) updateData.enExample = newEnExampleUsage;
        
        const updateTranslationResult = await updateTranslation(translation[0].id, updateData);
        if (!updateTranslationResult) {
          return { error: "Çeviri bilgileri güncellenirken hata oluştu" };
        }
      }
    }

    return { success: "Kelime başarıyla güncellendi" };
  } catch (error) {
    console.error("Error updating word:", error);
    return { error: "Kelime güncellenirken hata oluştu" };
  }
};

// Gets a word for quiz based on learning progress
export const getQuizWord = async (userId) => {
  try {
    const learnedWords = await getLearnedWordsByUserId(userId);
    const allWords = await getAllEnWords();
    
    // Prioritize words that need review
    const now = new Date();
    const practiceWords = learnedWords.filter((word) => 
      word.stageId < 7 && isPracticeTime(word, now)
    );
    
    let selectedWord = null;
    
    if (practiceWords.length > 0) {
      // Select random practice word
      selectedWord = practiceWords[Math.floor(Math.random() * practiceWords.length)];
    } else {
      // Select random new word
      const learnedEnIds = new Set(learnedWords.map((w) => w.enId));
      const newWords = allWords.filter((word) => !learnedEnIds.has(word.enId));
      
      if (newWords.length > 0) {
        const randomNewWord = newWords[Math.floor(Math.random() * newWords.length)];
        selectedWord = { enId: randomNewWord.enId, isNew: true };
      } else {
        return { error: "No words available for quiz" };
      }
    }
    
    if (!selectedWord) {
      return { error: "No words available for quiz" };
    }
    
    // Get word details
    const enWordArray = await getEnWordByEnId(selectedWord.enId);
    const enWord = enWordArray && enWordArray[0] ? enWordArray[0] : null;
    
    const translation = await getTranslationByEnId(selectedWord.enId);
    let trWord = null;
    
    if (translation && translation[0]) {
      const trWordArray = await getTrWordByTrId(translation[0].trId);
      trWord = trWordArray && trWordArray[0] ? trWordArray[0] : null;
    }
    
    if (!enWord || !trWord || !translation) {
      return { error: "Word details could not be loaded" };
    }
    
    return {
      enWord,
      trWord,
      translation: translation[0],
      currentStage: selectedWord.stageId || 0,
      isNew: selectedWord.isNew || false
    };
    
  } catch (error) {
    console.error("Error getting quiz word:", error);
    return { error: "Error getting quiz word" };
  }
};

// Updates word learning progress based on quiz results
export const updateWordProgress = async (userId, enId, isCorrect) => {
  try {
    const learnedWords = await getLearnedWordsByUserId(userId);
    const existingWord = learnedWords.find(word => word.enId === enId);
    
    if (!existingWord) {
      // Handle new word
      if (isCorrect) {
        const newLearnedWord = {
          userId: userId,
          enId: enId,
          stageId: 1,
          learningDate: new Date().toISOString().split('T')[0]
        };
        
        try {
          const created = await createLearnedWord(newLearnedWord);
          return created
            ? { success: "Word added to learned words", newStage: 1 }
            : { error: "Failed to add word to learned words" };
        } catch (error) {
          console.error("Error creating learned word:", error);
          return { error: "Failed to add word to learned words" };
        }
      } else {
        return { message: "Incorrect answer - try again later", newStage: 0 };
      }
    } else {
      // Update existing word progress
      if (isCorrect && existingWord.stageId < 7) {
        const newStage = existingWord.stageId + 1;
        const updatedWord = {
          ...existingWord,
          userId: userId,
          stageId: newStage,
          learningDate: new Date().toISOString().split('T')[0]
        };
        
        const response = await fetch(`http://localhost:3000/tblLearnedWords/${existingWord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedWord)
        });
        
        if (response.ok) {
          return { 
            success: `Word progressed to stage ${newStage}`, 
            newStage: newStage,
            isCompleted: newStage === 7
          };
        } else {
          return { error: "Failed to update word progress" };
        }
      } else if (!isCorrect) {
        return { message: "Incorrect answer - no progress made", newStage: existingWord.stageId };
      } else {
        return { message: "Word already completed!", newStage: existingWord.stageId };
      }
    }
    
  } catch (error) {
    console.error("Error updating word progress:", error);
    return { error: "Error updating word progress" };
  }
};