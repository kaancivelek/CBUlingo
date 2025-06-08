import React, { useState, useEffect, useRef } from "react";
import { getLearnedWordsByUserId, getAllEnWords } from "../services/wordService";
import "./WordleGame.css";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getLetterStatuses(guess, answer) {
  // NYT Wordle algoritması: önce yeşilleri, sonra sarıları, kalanlar gri
  const result = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  // 1. Yeşil (doğru harf, doğru yer)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
      answerArr[i] = null; // Bu harfi bir daha kullanma
    }
  }
  // 2. Sarı (doğru harf, yanlış yer)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1 && !used[idx]) {
      result[i] = "present";
      answerArr[idx] = null; // Bu harfi bir daha kullanma
    }
  }
  return result;
}

export default function WordleGame() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]); // [{ guess: 'apple', status: ['correct', ...] }]
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  // Öğrenilmiş kelimeleri Dashboard'daki gibi çek
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
        // Dashboard'daki gibi kelime çek
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
        const randomWord = learnedWords[Math.floor(Math.random() * learnedWords.length)];
        setTargetWord(randomWord);
      } catch (err) {
        setMessage("Kelime verisi alınamadı.");
      }
      setLoading(false);
    }
    fetchLearnedWords();
  }, []);

  // Oyun bittiğinde veya başında input'a odaklan
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [gameOver, loading]);

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

  const submitGuess = () => {
    if (gameOver || loading) return;
    if (currentGuess.length !== WORD_LENGTH) return;
    const status = getLetterStatuses(currentGuess, targetWord);
    const newGuesses = [...guesses, { guess: currentGuess, status }];
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameOver(true);
      setMessage("Tebrikler! Doğru kelimeyi buldunuz 🎉");
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setGameOver(true);
      setMessage(`Oyun bitti! Doğru kelime: ${targetWord.toUpperCase()}`);
    }
    setCurrentGuess("");
  };

  const resetGame = () => {
    window.location.reload(); // Basitçe sayfayı yenile, yeni kelime gelsin
  };

  // Modern Dashboard kartı ve renkleriyle arayüz
  return (
    <div className="wordle-dashboard-card">
      <h2 className="wordle-title">Wordle - Öğrendiğin Kelimeler</h2>
      {loading ? (
        <div className="wordle-message">Yükleniyor...</div>
      ) : (
        <>
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