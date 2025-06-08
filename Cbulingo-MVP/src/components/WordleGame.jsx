import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordleGame.css';

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [learnedWords, setLearnedWords] = useState([]);

  useEffect(() => {
    fetchLearnedWords();
  }, []);

  const fetchLearnedWords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tblLearnedWords');
      const userLearnedWords = response.data.filter(word => word.userId === 1); // Kullanıcı ID'si dinamik olmalı
      
      // Öğrenilen kelimelerin detaylarını al
      const wordDetails = await Promise.all(
        userLearnedWords.map(async (word) => {
          const wordResponse = await axios.get(`http://localhost:3000/tblEnglish/${word.enId}`);
          return wordResponse.data;
        })
      );
      
      setLearnedWords(wordDetails);
      if (wordDetails.length > 0) {
        const randomWord = wordDetails[Math.floor(Math.random() * wordDetails.length)].enWord;
        setTargetWord(randomWord.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching learned words:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (gameOver) return;

    if (e.key === 'Enter' && currentGuess.length === 5) {
      checkGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + e.key.toLowerCase());
    }
  };

  const checkGuess = () => {
    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage('Tebrikler! Kelimeyi buldunuz!');
    } else if (guesses.length === 5) {
      setGameOver(true);
      setMessage(`Oyun bitti! Doğru kelime: ${targetWord}`);
    }

    const newGuess = currentGuess.split('').map((letter, index) => ({
      letter,
      status: letter === targetWord[index] ? 'correct' : 
              targetWord.includes(letter) ? 'present' : 'absent'
    }));

    setGuesses([...guesses, newGuess]);
    setCurrentGuess('');
  };

  const resetGame = () => {
    if (learnedWords.length > 0) {
      const randomWord = learnedWords[Math.floor(Math.random() * learnedWords.length)].enWord;
      setTargetWord(randomWord.toLowerCase());
    }
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
  };

  return (
    <div className="wordle-container" onKeyDown={handleKeyPress} tabIndex="0">
      <h2>Wordle - Öğrendiğin Kelimeler</h2>
      
      <div className="game-board">
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="guess-row">
            {[...Array(5)].map((_, colIndex) => {
              const guess = guesses[rowIndex];
              const letter = guess ? guess[colIndex].letter : '';
              const status = guess ? guess[colIndex].status : '';
              
              return (
                <div key={colIndex} className={`letter-box ${status}`}>
                  {rowIndex === guesses.length ? 
                    currentGuess[colIndex] || '' : 
                    letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && (
        <div className="message">
          {message}
          <button onClick={resetGame}>Yeni Oyun</button>
        </div>
      )}
    </div>
  );
};

export default WordleGame; 