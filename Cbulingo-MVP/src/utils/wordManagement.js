import { addNewWord, updateWord } from '../../utils/WordController';

/**
 * Form validasyonu
 */
export const validateWordForm = (formData) => {
  const errors = {};

  if (!formData.enWord || formData.enWord.trim().length < 2) {
    errors.enWord = 'İngilizce kelime en az 2 karakter olmalı';
  }

  if (!formData.trWord || formData.trWord.trim().length < 2) {
    errors.trWord = 'Türkçe anlam en az 2 karakter olmalı';
  }

  if (formData.picUrl && !isValidUrl(formData.picUrl)) {
    errors.picUrl = 'Geçerli bir resim URL\'si girin';
  }

  if (formData.enExample && formData.enExample.trim().length < 5) {
    errors.enExample = 'Örnek cümle en az 5 karakter olmalı';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * URL validasyonu
 */
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Kelime ekleme işlemi
 */
export const handleAddWord = async (formData) => {
  try {
    const validation = validateWordForm(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const result = await addNewWord(
      formData.enWord.trim(),
      formData.trWord.trim(),
      formData.picUrl?.trim() || '',
      formData.enExample?.trim() || ''
    );

    if (result.error) {
      return { success: false, message: result.error };
    }

    return { success: true, message: result.success || 'Kelime başarıyla eklendi' };
  } catch (error) {
    console.error('Error adding word:', error);
    return { success: false, message: 'Kelime eklenirken bir hata oluştu' };
  }
};

/**
 * Kelime güncelleme işlemi
 */
export const handleUpdateWord = async (originalWord, formData) => {
  try {
    const validation = validateWordForm(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const result = await updateWord(
      originalWord,
      formData.enWord.trim(),
      formData.trWord.trim(),
      formData.picUrl?.trim() || '',
      formData.enExample?.trim() || ''
    );

    if (result.error) {
      return { success: false, message: result.error };
    }

    return { success: true, message: result.success || 'Kelime başarıyla güncellendi' };
  } catch (error) {
    console.error('Error updating word:', error);
    return { success: false, message: 'Kelime güncellenirken bir hata oluştu' };
  }
};

/**
 * Form verilerini temizle
 */
export const resetWordForm = () => ({
  enWord: '',
  trWord: '',
  picUrl: '',
  enExample: ''
});

/**
 * Form verilerini doldur (düzenleme için)
 */
export const populateWordForm = (wordData) => ({
  enWord: wordData.enWord || '',
  trWord: wordData.trWord || '',
  picUrl: wordData.picUrl || '',
  enExample: wordData.enExample || ''
}); 