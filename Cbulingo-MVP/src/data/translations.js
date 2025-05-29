// Translation Data with images and examples
export const tblTranslation = [
  {
    "id": "1",
    "enId": 1,
    "trId": 1,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    "enExample": "I eat an apple every morning."
  },
  {
    "id": "2",
    "enId": 2,
    "trId": 2,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/Book_icon_2.png",
    "enExample": "She is reading a book."
  },
  {
    "id": "3",
    "enId": 3,
    "trId": 3,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3e/2018_Toyota_Camry_SE_front_5.26.18.jpg",
    "enExample": "My car is very fast."
  },
  {
    "id": "4",
    "enId": 4,
    "trId": 4,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6d/House_in_the_night.jpg",
    "enExample": "They live in a big house."
  },
  {
    "id": "5",
    "enId": 5,
    "trId": 5,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
    "enExample": "The dog is barking loudly."
  },
  {
    "id": "6",
    "enId": 6,
    "trId": 6,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg",
    "enExample": "The cat is sleeping on the sofa."
  },
  {
    "id": "7",
    "enId": 7,
    "trId": 7,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Tree_in_spring.jpg",
    "enExample": "There is a tall tree in the garden."
  },
  {
    "id": "8",
    "enId": 8,
    "trId": 8,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Water_drop_001.jpg",
    "enExample": "I drink water when I am thirsty."
  },
  {
    "id": "9",
    "enId": 9,
    "trId": 9,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Sun_and_clouds.jpg",
    "enExample": "The sun is shining today."
  },
  {
    "id": "10",
    "enId": 10,
    "trId": 10,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg",
    "enExample": "The moon is bright tonight."
  },
  {
    "id": "11",
    "enId": 11,
    "trId": 11,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Flower_poster_2.jpg",
    "enExample": "This flower smells nice."
  },
  {
    "id": "12",
    "enId": 12,
    "trId": 12,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_bird.jpg",
    "enExample": "A bird is singing in the tree."
  },
  {
    "id": "13",
    "enId": 13,
    "trId": 13,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/1/19/Goldfish3.jpg",
    "enExample": "I have a goldfish in my aquarium."
  },
  {
    "id": "14",
    "enId": 14,
    "trId": 14,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Bread_%28white_background%29.jpg",
    "enExample": "Would you like some bread?"
  },
  {
    "id": "15",
    "enId": 15,
    "trId": 15,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Milk_glass.jpg",
    "enExample": "Milk is good for your health."
  },
  {
    "id": "16",
    "enId": 16,
    "trId": 16,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Smartphone_icon.png",
    "enExample": "My phone is new."
  },
  {
    "id": "17",
    "enId": 17,
    "trId": 17,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/5/51/Computer-aj_aj_ashton_01.svg",
    "enExample": "I use a computer at work."
  },
  {
    "id": "18",
    "enId": 18,
    "trId": 18,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Table_icon.png",
    "enExample": "The table is made of wood."
  },
  {
    "id": "19",
    "enId": 19,
    "trId": 19,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Chair_icon.png",
    "enExample": "Please sit on the chair."
  },
  {
    "id": "20",
    "enId": 20,
    "trId": 20,
    "picUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Window_icon.png",
    "enExample": "Open the window, please."
  }
  // Diğer 80 kelime için basit format
];

// Kalan kelimeleri programatik olarak ekle
for (let i = 21; i <= 100; i++) {
  tblTranslation.push({
    "id": i.toString(),
    "enId": i,
    "trId": i,
    "picUrl": `https://upload.wikimedia.org/wikipedia/commons/2/2c/${i}_icon.png`,
    "enExample": `This is an example sentence for word ${i}.`
  });
} 