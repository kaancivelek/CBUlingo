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

// Türkçe karakter dönüştürme fonksiyonu
const convertTurkishChars = (text) => {
  if (typeof text !== 'string') return text;
  
  const turkishChars = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };
  
  return text.replace(/[çÇğĞıIİiöÖşŞüÜ]/g, char => turkishChars[char] || char);
};

export const exportProgressToPDF = async (user, stats, userRank = null) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    
    // Başlık ve kullanıcı bilgileri
    addHeader(pdf, user, pageWidth);
    
    // Ana içerik alanları
    let currentY = 70; // Header'dan sonra daha fazla boşluk
    
    // Sol taraf - Öğrenilen kelimeler (seviye dağılımı)
    currentY = addWordsSection(pdf, stats, 15, currentY);
    
    // Sağ taraf - İstatistikler ve grafikler
    addStatsSection(pdf, stats, userRank, 115, 70); // Y pozisyonunu sabitledik
    
    // Alt kısım - İlerleme çubuğu
    addProgressBar(pdf, stats, 15, currentY + 30, pageWidth - 30);
    
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
  pdf.rect(0, 0, pageWidth, 50, 'F'); // Header yüksekliğini artırdık
  
  // Kullanıcı adı
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(FONTS.regular, 'bold');
  
  const userName = convertTurkishChars(user.userFullName || 'Kullanici');
  const userNameWidth = pdf.getTextWidth(userName);
  pdf.text(userName, (pageWidth - userNameWidth) / 2, 25);
  
  // Email - daha belirgin hale getirdik
  if (user.email) {
    pdf.setFontSize(11);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.setTextColor(255, 255, 255); // Email için beyaz renk
    const emailWidth = pdf.getTextWidth(user.email);
    pdf.text(user.email, (pageWidth - emailWidth) / 2, 38);
  }
  
  // Başlık - Y pozisyonunu artırdık
  pdf.setTextColor(...COLORS.text);
  pdf.setFontSize(18);
  pdf.setFont(FONTS.regular, 'bold');
  const title = convertTurkishChars('Ogrenme Ilerleme Raporu');
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, 60);
};

// Kelimeler bölümü (sol taraf)
const addWordsSection = (pdf, stats, x, y) => {
  // Bölüm başlığı
  pdf.setFillColor(...COLORS.secondary);
  pdf.rect(x, y, 85, 8, 'F');
  
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(14);
  pdf.setFont(FONTS.regular, 'bold');
  pdf.text(convertTurkishChars('Seviye Dagilimi'), x + 3, y + 6);
  
  let currentY = y + 15;
  
  // Seviye istatistikleri
  const stageStatsWithPercentages = calculateStagePercentages(stats.stageStats, stats.learnedCount);
  
  Object.entries(stageStatsWithPercentages).forEach(([stageId, stage]) => {
    const stageColor = getStageColor(parseInt(stageId));
    
    // Renk kutusu
    pdf.setFillColor(...stageColor);
    pdf.rect(x + 2, currentY - 3, 4, 4, 'F');
    
    // Seviye adı
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(10);
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
  
  // İstatistik kutuları
  const statItems = [
    {
      icon: 'Kelime',
      label: convertTurkishChars('Ogrenilen Kelime'),
      value: stats.learnedCount,
      color: COLORS.primary
    },
    {
      icon: 'Tamaml.',
      label: 'Tamamlanan',
      value: stats.stageStats[7]?.count || 0,
      color: COLORS.success
    },
    {
      icon: 'Ilerleme',
      label: convertTurkishChars('Ilerleme Orani'),
      value: `${stats.progressPercentage}%`,
      color: COLORS.info
    },
    {
      icon: 'Toplam',
      label: 'Toplam Kelime',
      value: stats.totalWords,
      color: COLORS.warning
    }
  ];
  
  if (userRank) {
    statItems.push({
      icon: 'Sira',
      label: convertTurkishChars('Siralama'),
      value: `${userRank}. sira`,
      color: COLORS.primary
    });
  }
  
  statItems.forEach((item, index) => {
    // Kutu
    pdf.setFillColor(250, 250, 250);
    pdf.rect(x, currentY, 80, 15, 'F');
    
    // Kenar rengi
    pdf.setFillColor(...item.color);
    pdf.rect(x, currentY, 2, 15, 'F');
    
    // Değer
    pdf.setTextColor(...COLORS.text);
    pdf.setFontSize(16);
    pdf.setFont(FONTS.regular, 'bold');
    pdf.text(item.value.toString(), x + 45, currentY + 7);
    
    // Label
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.textLight);
    pdf.setFont(FONTS.regular, 'normal');
    pdf.text(item.label, x + 45, currentY + 12);
    
    // Icon/Label metni
    pdf.setFontSize(8);
    pdf.setTextColor(...item.color);
    pdf.setFont(FONTS.regular, 'bold');
    pdf.text(item.icon, x + 5, currentY + 8);
    
    currentY += 20;
  });
  
  // Dairesel ilerleme göstergesi
  if (stats.progressPercentage > 0) {
    addCircularProgress(pdf, stats.progressPercentage, x + 40, currentY + 15);
  }
};

// Dairesel ilerleme göstergesi
const addCircularProgress = (pdf, percentage, centerX, centerY) => {
  const radius = 20;
  
  // Arka plan çemberi
  pdf.setDrawColor(230, 230, 230);
  pdf.setLineWidth(3);
  pdf.circle(centerX, centerY, radius, 'S');
  
  // İlerleme çemberi (basitleştirilmiş)
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(3);
  
  // İlerleme yayı çizimi için basit bir yaklaşım
  const steps = Math.ceil((percentage / 100) * 20); // 20 adımda çember
  for (let i = 0; i < steps; i++) {
    const angle = (i / 20) * 2 * Math.PI - Math.PI / 2; // -90 dereceden başla
    const x1 = centerX + (radius - 1.5) * Math.cos(angle);
    const y1 = centerY + (radius - 1.5) * Math.sin(angle);
    const x2 = centerX + (radius + 1.5) * Math.cos(angle);
    const y2 = centerY + (radius + 1.5) * Math.sin(angle);
    
    pdf.line(x1, y1, x2, y2);
  }
  
  // Yüzde metni
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(12);
  pdf.setFont(FONTS.regular, 'bold');
  const percentText = `${percentage}%`;
  const textWidth = pdf.getTextWidth(percentText);
  pdf.text(percentText, centerX - textWidth/2, centerY + 2);
};

// İlerleme çubuğu - Y pozisyonlarını düzelttik
const addProgressBar = (pdf, stats, x, y, width) => {
  // Başlık
  pdf.setTextColor(...COLORS.text);
  pdf.setFontSize(12);
  pdf.setFont(FONTS.regular, 'bold');
  pdf.text(convertTurkishChars('Genel Ilerleme'), x, y);
  
  // Çubuk arka planı
  const barHeight = 15;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(x, y + 8, width, barHeight, 'F'); // Y pozisyonunu ayarladık
  
  // İlerleme çubuğu (gradient yerine tek renk)
  const progressWidth = (stats.progressPercentage / 100) * width;
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(x, y + 8, progressWidth, barHeight, 'F');
  
  // Yüzde metni - Pozisyonu düzelttik
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont(FONTS.regular, 'bold');
  const progressText = `${stats.learnedCount} / ${stats.totalWords} kelime (${stats.progressPercentage}%)`;
  const progressTextWidth = pdf.getTextWidth(progressText);
  
  // Metin konumunu ayarla
  const textX = x + (width - progressTextWidth) / 2;
  const textY = y + 17; // Y pozisyonunu ayarladık
  
  // Eğer progress width yeterince genişse beyaz, değilse koyu renk kullan
  if (progressWidth > progressTextWidth + 10) {
    pdf.setTextColor(255, 255, 255);
  } else {
    pdf.setTextColor(...COLORS.text);
  }
  
  pdf.text(progressText, textX, textY);
  
  // Alt açıklama metni - çakışmayı önlemek için
  pdf.setTextColor(...COLORS.textLight);
  pdf.setFontSize(8);
  pdf.setFont(FONTS.regular, 'normal');
  const detailText = convertTurkishChars(`Toplam ${stats.totalWords} kelimeden ${stats.learnedCount} tanesi ogrenildi`);
  const detailWidth = pdf.getTextWidth(detailText);
  pdf.text(detailText, x + (width - detailWidth) / 2, y + 30);
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