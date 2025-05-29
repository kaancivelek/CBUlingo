// Embedded Database - Mobile uygulamalar için gömülü veri
// JSON Server yerine kullanılacak

import { tblEnglish } from './englishWords.js';
import { tblTurkish } from './turkishWords.js';
import { tblTranslation } from './translations.js';

// ID generator fonksiyonu
const generateId = () => {
  return Math.random().toString(36).substr(2, 4);
};

// İnitial data
let database = {
  tblUsers: [
    {
      "userId": 1,
      "userFullName": "Kaan Civelek",
      "userEmail": "kaancivelek17@gmail.com",
      "userHashedPassword": "a320480f534776bddb5cdb54b1e93d210a3c7d199e80a23c1b2178497b184c76",
      "id": "c59e"
    },
    {
      "id": "b9ad",
      "userEmail": "nciftkaldiran@gmail.com",
      "userFullName": "Nebi Çiftkaldıran",
      "userHashedPassword": "a320480f534776bddb5cdb54b1e93d210a3c7d199e80a23c1b2178497b184c76"
    }
  ],
  
  tblLearnedWords: [
    {
      "userID": 1,
      "enId": 1,
      "learningStage": 1,
      "learningDate": "2025-05-16",
      "id": "0da7"
    },
    {
      "id": "0b8f",
      "enId": 37,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "0b52",
      "enId": 39,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "e836",
      "enId": 32,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "ca4e",
      "enId": 55,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "8757",
      "enId": 93,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "dd1f",
      "enId": 3,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "a5a6",
      "userId": 1,
      "enId": 33,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "c3e5",
      "userId": 1,
      "enId": 80,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "0438",
      "userId": 1,
      "enId": 20,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "811d",
      "userId": 1,
      "enId": 77,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "c91e",
      "userId": 1,
      "enId": 38,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "5337",
      "userId": 1,
      "enId": 34,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "24ba",
      "userId": 1,
      "enId": 35,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "821f",
      "userId": 1,
      "enId": 22,
      "stageId": 1,
      "learningDate": "2025-05-29"
    },
    {
      "id": "3cf0",
      "userId": 1,
      "enId": 71,
      "stageId": 1,
      "learningDate": "2025-05-29"
    }
  ],

  tblLearningStages: [
    {
      "stageId": 1,
      "stageName": "Next Day",
      "id": "572f"
    },
    {
      "stageId": 2,
      "stageName": "Next Week",
      "id": "0104"
    },
    {
      "stageId": 3,
      "stageName": "Next Month",
      "id": "c2b7"
    },
    {
      "stageId": 4,
      "stageName": "Next Three Months",
      "id": "7435"
    },
    {
      "stageId": 5,
      "stageName": "Next Six Months",
      "id": "17ac"
    },
    {
      "stageId": 6,
      "stageName": "Next Year",
      "id": "c11e"
    },
    {
      "stageId": 7,
      "stageName": "Learned",
      "id": "7124"
    }
  ],

  // Import edilen veriler
  tblEnglish: tblEnglish,
  tblTurkish: tblTurkish,
  tblTranslation: tblTranslation
};

export { database, generateId }; 