import React, { useState, useEffect, useRef } from "react";
import { getLearnedWordsByUserId, getAllEnWords } from "../services/wordService";
import "./WordleGame.css";

// Game configuration constants
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

/**
 * Determines the status of each letter in the guess compared to the answer
 * Implements NYT Wordle algorithm: check correct positions first, then present letters
 * @param {string} guess - The user's guess
 * @param {string} answer - The target word
 * @returns {string[]} Array of letter statuses: 'correct', 'present', or 'absent'
 */
function getLetterStatuses(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  // 1. Check for correct letters in correct positions (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
      answerArr[i] = null; // Mark as used
    }
  }

  // 2. Check for correct letters in wrong positions (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1 && !used[idx]) {
      result[i] = "present";
      answerArr[idx] = null; // Mark as used
    }
  }
  return result;
}

/**
 * Wordle game component that uses learned words as target words
 * Implements the classic Wordle game mechanics with a custom word pool
 */
export default function WordleGame() {
  // Game state
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]); // [{ guess: 'apple', status: ['correct', ...] }]
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Load learned words and select a random target word
  useEffect(() => {
    async function fetchLearnedWords() {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setMessage("Giriş yapmalısınız.");
          setLoading(false);
          return;
        }

        // Fetch learned words and filter for 5-letter words
        const learnedWordsData = await getLearnedWordsByUserId(user.userId);
        const allWordsData = await getAllEnWords();
        const learnedWords = (learnedWordsData || []).map(lw => {
          const enWordObj = (allWordsData || []).find(w => w.enId === lw.enId);
          return enWordObj?.enWord?.toLowerCase() || "";
        }).filter(w => w.length === WORD_LENGTH);

        if (learnedWords.length === 0) {
          setMessage("Öğrenilmiş 5 harfli kelimeniz yok!");
          setLoading(false);
          return;
        }

        // Select random word from learned words
        const randomWord = learnedWords[Math.floor(Math.random() * learnedWords.length)];
        setTargetWord(randomWord);
      } catch (err) {
        setMessage("Kelime verisi alınamadı.");
      }
      setLoading(false);
    }
    fetchLearnedWords();
  }, []);

  // Focus input on game start/end
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [gameOver, loading]);

  // Input handlers
  const handleInput = (e) => {
    if (gameOver || loading) return;
    const val = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, WORD_LENGTH).toLowerCase();
    setCurrentGuess(val);
  };

  const handleKeyDown = (e) => {
    if (gameOver || loading) return;
    if (e.key === "Enter" && currentGuess.length === WORD_LENGTH) {
      submitGuess();
    }
  };

  // Submit guess and check game state
  const submitGuess = () => {
    if (gameOver || loading) return;
    if (currentGuess.length !== WORD_LENGTH) return;

    const status = getLetterStatuses(currentGuess, targetWord);
    const newGuesses = [...guesses, { guess: currentGuess, status }];
    setGuesses(newGuesses);

    // Check win/lose conditions
    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage("Tebrikler! Doğru kelimeyi buldunuz 🎉");
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`Oyun bitti! Doğru kelime: ${targetWord.toUpperCase()}`);
    }
    setCurrentGuess("");
  };

  // Reset game state
  const resetGame = () => {
    window.location.reload();
  };

  // Render game interface
  return (
    <div className="wordle-dashboard-card">
      <h2 className="wordle-title">Wordle - Öğrendiğin Kelimeler</h2>
      {loading ? (
        <div className="wordle-message">Yükleniyor...</div>
      ) : (
        <>
          {/* Game board */}
          <div className="wordle-board">
            {[...Array(MAX_ATTEMPTS)].map((_, rowIdx) => (
              <div className="wordle-guess-row" key={rowIdx}>
                {[...Array(WORD_LENGTH)].map((_, colIdx) => {
                  const guessObj = guesses[rowIdx];
                  let letter = "";
                  let status = "";
                  if (guessObj) {
                    letter = guessObj.guess[colIdx] || "";
                    status = guessObj.status[colIdx];
                  } else if (rowIdx === guesses.length) {
                    letter = currentGuess[colIdx] || "";
                  }
                  return (
                    <div
                      className={`wordle-letter-box${status ? ` ${status}` : ""}`}
                      key={colIdx}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Input area */}
          {!gameOver && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <input
                ref={inputRef}
                type="text"
                maxLength={WORD_LENGTH}
                value={currentGuess}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="wordle-input"
                disabled={gameOver || loading}
                autoFocus
                style={{
                  fontSize: "1.3rem",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "2px solid var(--primary-color)",
                  outline: "none",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "8px",
                  width: "80%",
                  maxWidth: "300px",
                  textAlign: "center",
                }}
                placeholder="Tahmininizi yazın"
              />
              <br />
              <button
                className="wordle-message-button"
                onClick={submitGuess}
                disabled={currentGuess.length !== WORD_LENGTH}
              >
                Tahmin Et
              </button>
            </div>
          )}

          {/* Game messages and reset button */}
          {message && (
            <div className="wordle-message">
              {message}
              <br />
              <button onClick={resetGame} className="wordle-message-button">
                Yeni Oyun
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}