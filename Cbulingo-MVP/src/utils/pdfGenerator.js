import jsPDF from 'jspdf';

// Türkçe karakter desteği için font ayarları
const FONTS = {
  regular: 'helvetica',
  bold: 'helvetica-bold'
};

// Renkler
const COLORS = {
  primary: [63, 55, 165],
  secondary: [255, 246, 233],
  text: [51, 51, 51],
  textLight: [102, 102, 102],
  success: [76, 175, 80],
  warning: [255, 152, 0],
  info: [33, 150, 243],
  background: [248, 249, 250],
  // Seviye renkleri
  stage1: [255, 235, 59],
  stage2: [255, 152, 0],
  stage3: [244, 67, 54],
  stage4: [156, 39, 176],
  stage5: [63, 81, 181],
  stage6: [76, 175, 80],
  stage7: [46, 125, 50]
};

// Seviye isimleri
const STAGE_NAMES = {
  1: 'Yeni',
  2: 'Tanidik',
  3: 'Ogreniyor',
  4: 'Pekistiriliyor',
  5: 'Biliniyor',
  6: 'Hatirlaniyor',
  7: 'Tamamlandi'
};

// Gelişmiş Türkçe karakter dönüştürme fonksiyonu
const convertTurkishChars = (text) => {
  if (typeof text !== 'string') return text;
  
  const turkishChars = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U',
    // Ek karakterler
    'â': 'a', 'Â': 'A',
    'î': 'i', 'Î': 'I',
    'û': 'u', 'Û': 'U'
  };
  
  return text.replace(/[çÇğĞıIİiöÖşŞüÜâÂîÎûÛ]/g, char => turkishChars[char] || char);
};

export const exportProgressToPDF = async (user, stats, userRank = null, learnedWords = []) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Başlık ve kullanıcı bilgileri
    addHeader(pdf, user, pageWidth);
    
    // Ana içerik alanları
    let currentY = 75; // Header'dan sonra daha fazla boşluk
    
    // Sol taraf - Öğrenilen kelimeler listesi
    currentY = addWordsListSection(pdf, learnedWords, 15, currentY);
    
    // Sağ taraf - İstatistikler ve grafikler
    addStatsSection(pdf, stats, userRank, 115, 75);
    
    // Alt kısım - İlerleme çubuğu (Y pozisyonunu dinamik olarak ayarla)
    const progressY = Math.max(currentY + 20, 200); // En az 200mm'de olsun
    addProgressBar(pdf, stats, 15, progressY, pageWidth - 30);
    
    // Tarih bilgisi
    addFooter(pdf, pageWidth, pageHeight);
    
    // PDF'i indir
    const fileName = `${convertTurkishChars(user.userFullName)}_Ogrenme_Raporu_${new Date().toLocaleDateString('tr-TR').replace(/\./g, '_')}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    throw new Error('PDF oluşturulamadı. Lütfen tekrar deneyin.');
  }
};

// Başlık bölümü
const addHeader = (pdf, user, pageWidth) => {
  // Arka plan rengi
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 0, pageWidth, 55, 'F'); // Header yüksekliğini artırdık
  
  // Kullanıcı adı
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(FONTS.regular, 'bold');
  
  const userName = convertTurkishChars(user.userFullName || 'Kullanici');
  const userNameWidth = pdf.getTextWidth(userName);
  pdf.text(userName, (pageWidth - userNameWidth) / 2, 25);
  
  // Email - daha belirgin ve doğru konumlandırma
  if (user.email || user.userEmail) {
    pdf.setFontSize(12);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.setTextColor(220, 220, 220); // Daha açık gri ton
    const email = user.email || user.userEmail;
    const emailWidth = pdf.getTextWidth(email);
    pdf.text(email, (pageWidth - emailWidth) / 2, 38);
  }
  
  // Başlık
  pdf.setTextColor(...COLORS.text);
  pdf.setFontSize(18);
  pdf.setFont(FONTS.regular, 'bold');
  const title = convertTurkishChars('Ogrenme Ilerleme Raporu');
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, 65);
};

// Öğrenilen kelimeler listesi (sol taraf)
const addWordsListSection = (pdf, learnedWords, x, y) => {
  if (!Array.isArray(learnedWords) || learnedWords.length === 0) {
    pdf.setTextColor(...COLORS.textLight);
    pdf.setFontSize(10);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.text(convertTurkishChars('Henuz ogrenilen kelime yok'), x + 3, y + 15);
    return y + 25;
  }

  // Stage'e göre grupla
  const groupedWords = learnedWords.reduce((acc, word) => {
    const stageId = word.stageId || 1;
    if (!acc[stageId]) acc[stageId] = [];
    acc[stageId].push(word);
    return acc;
  }, {});

  // Grid ayarları
  const columnCount = 3;
  const columnWidth = 27; // 3 sütun için 85mm alanı böldük
  const rowHeight = 6;   // Her kelime satırı yüksekliği
  const sectionWidth = columnCount * columnWidth;
  const maxRowsPerStage = 30; // Her stage için maksimum satır (isteğe göre ayarlanabilir)

  let currentY = y;

  // Stage'leri sırayla işle (1-7 arası)
  Object.keys(STAGE_NAMES).forEach((stageId) => {
    const words = groupedWords[stageId];
    if (!words || words.length === 0) return;

    // Stage başlığı ve renkli kutu
    pdf.setFillColor(...getStageColor(parseInt(stageId)));
    pdf.rect(x, currentY, 4, 4, 'F');
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(9);
    pdf.setFont(FONTS.regular, 'bold');
    pdf.text(convertTurkishChars(STAGE_NAMES[stageId]), x + 7, currentY + 3.2);
    currentY += 7;

    // Grid başlangıcı (satır satır, soldan sağa)
    pdf.setFontSize(7);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.setTextColor(...COLORS.text);
    const rowCount = Math.ceil(words.length / columnCount);
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < columnCount; col++) {
        const idx = row * columnCount + col;
        if (idx >= words.length) break;
        const word = words[idx];
        const wordText = convertTurkishChars(word.enWord || word.word || 'Kelime');
        let display = wordText;
        if (word.trWord) {
          const trText = convertTurkishChars(word.trWord);
          display += ` (${trText})`;
        }
        const cellX = x + col * columnWidth;
        const cellY = currentY + row * rowHeight;
        pdf.text(display, cellX, cellY);
      }
    }
    currentY += rowCount * rowHeight + 5;
  });

  return currentY;
};

// İstatistikler bölümü (sağ taraf)
const addStatsSection = (pdf, stats, userRank, x, y) => {
  // Bölüm başlığı
  pdf.setFillColor(...COLORS.secondary);
  pdf.rect(x, y, 85, 8, 'F');
  
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(14);
  pdf.setFont(FONTS.regular, 'bold');
  pdf.text(convertTurkishChars('Genel Istatistikler'), x + 3, y + 6);
  
  let currentY = y + 20;
  
  // Seviye dağılımı
  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats, stats.learnedCount);
  
  Object.entries(stageStatsWithPercentages).forEach(([stageId, stage]) => {
    if (stage.count === 0) return; // Boş seviyeleri atla
    
    const stageColor = getStageColor(parseInt(stageId));
    
    // Renk kutusu
    pdf.setFillColor(...stageColor);
    pdf.rect(x + 2, currentY - 3, 4, 4, 'F');
    
    // Seviye adı
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(9);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.text(convertTurkishChars(stage.name), x + 8, currentY);
    
    // Sayı
    pdf.setFont(FONTS.regular, 'bold');
    pdf.text(stage.count.toString(), x + 35, currentY);
    
    // Yüzde
    pdf.setTextColor(...COLORS.textLight);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.text(`(${stage.percentage}%)`, x + 45, currentY);
    
    // Mini progress bar
    const barWidth = 25;
    const barHeight = 2;
    pdf.setFillColor(240, 240, 240);
    pdf.rect(x + 60, currentY - 1.5, barWidth, barHeight, 'F');
    
    const fillWidth = (stage.percentage / 100) * barWidth;
    pdf.setFillColor(...stageColor);
    pdf.rect(x + 60, currentY - 1.5, fillWidth, barHeight, 'F');
    
    currentY += 8;
  });
  
  currentY += 10;
  
  // Genel istatistikler
  const statItems = [
    {
      label: convertTurkishChars('Toplam Ogrenilen'),
      value: stats.learnedCount,
      color: COLORS.primary
    },
    {
      label: 'Tamamlanan',
      value: stats.stageStats[7]?.count || 0,
      color: COLORS.success
    },
    {
      label: convertTurkishChars('Ilerleme Orani'),
      value: `${stats.progressPercentage}%`,
      color: COLORS.info
    }
  ];
  
  if (userRank) {
    statItems.push({
      label: convertTurkishChars('Siralama'),
      value: `${userRank}. sira`,
      color: COLORS.warning
    });
  }
  
  statItems.forEach((item) => {
    // Kutu
    pdf.setFillColor(250, 250, 250);
    pdf.rect(x, currentY, 80, 12, 'F');
    
    // Kenar rengi
    pdf.setFillColor(...item.color);
    pdf.rect(x, currentY, 2, 12, 'F');
    
    // Label
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(8);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.text(item.label, x + 5, currentY + 5);
    
    // Değer
    pdf.setFontSize(10);
    pdf.setFont(FONTS.regular, 'bold');
    pdf.text(item.value.toString(), x + 5, currentY + 9);
    
    currentY += 15;
  });
};

// İlerleme çubuğu - Düzeltilmiş versiyon
const addProgressBar = (pdf, stats, x, y, width) => {
  // Başlık
  pdf.setTextColor(...COLORS.text);
  pdf.setFontSize(12);
  pdf.setFont(FONTS.regular, 'bold');
  pdf.text(convertTurkishChars('Genel Ilerleme'), x, y);
  
  // Çubuk arka planı
  const barHeight = 12;
  const barY = y + 10;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(x, barY, width, barHeight, 'F');
  
  // İlerleme çubuğu
  const progressWidth = (stats.progressPercentage / 100) * width;
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(x, barY, progressWidth, barHeight, 'F');
  
  // Progress bar üstündeki metin - düzeltilmiş pozisyon
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont(FONTS.regular, 'bold');
  const progressText = `${stats.progressPercentage}%`;
  const progressTextWidth = pdf.getTextWidth(progressText);
  
  // Metin konumunu çubuk içinde ortala
  if (progressWidth > progressTextWidth + 5) {
    // Çubuk içinde yeterli yer varsa beyaz renkte
    pdf.setTextColor(255, 255, 255);
    pdf.text(progressText, x + (progressWidth - progressTextWidth) / 2, barY + 7.5);
  } else {
    // Çubuk dışında koyu renkte
    pdf.setTextColor(...COLORS.text);
    pdf.text(progressText, x + progressWidth + 5, barY + 7.5);
  }
  
  // Alt açıklama metni - çubuk altında, çakışmayacak şekilde
  const detailY = barY + barHeight + 8;
  pdf.setTextColor(...COLORS.textLight);
  pdf.setFontSize(9);
  pdf.setFont(FONTS.regular, 'normal');
  const detailText = convertTurkishChars(`${stats.learnedCount} / ${stats.totalWords} kelime ogrenildi`);
  const detailWidth = pdf.getTextWidth(detailText);
  pdf.text(detailText, x + (width - detailWidth) / 2, detailY);
};

// Alt bilgi
const addFooter = (pdf, pageWidth, pageHeight) => {
  const footerY = pageHeight - 20;
  
  pdf.setTextColor(...COLORS.textLight);
  pdf.setFontSize(8);
  pdf.setFont(FONTS.regular, 'normal');
  
  const dateText = convertTurkishChars(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  
  const dateWidth = pdf.getTextWidth(dateText);
  pdf.text(dateText, (pageWidth - dateWidth) / 2, footerY);
  
  // Çizgi
  pdf.setDrawColor(...COLORS.textLight);
  pdf.setLineWidth(0.5);
  pdf.line(20, footerY - 5, pageWidth - 20, footerY - 5);
};

// Yardımcı fonksiyonlar
const getStageColor = (stageId) => {
  const colorMap = {
    1: COLORS.stage1,
    2: COLORS.stage2,
    3: COLORS.stage3,
    4: COLORS.stage4,
    5: COLORS.stage5,
    6: COLORS.stage6,
    7: COLORS.stage7
  };
  return colorMap[stageId] || COLORS.textLight;
};

const calculateStagePercentages = (stageStats, totalLearned) => {
  const result = {};
  
  for (let i = 1; i <= 7; i++) {
    const count = stageStats[i]?.count || 0;
    const percentage = totalLearned > 0 ? Math.round((count / totalLearned) * 100) : 0;
    
    result[i] = {
      name: STAGE_NAMES[i],
      count,
      percentage,
      cssClass: `stage-${i}`
    };
  }
  
  return result;
};