import React, { useState, useRef } from "react";
import "./GuessNumber.sass";
import bgImage from "./Number.jpg"; // Place Number.jpg in src/

const MAX_CHANCES = 10;
const MIN = 1;
const MAX = 99;

function getRandomNumber() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

export default function GuessNumber() {
  const [randomNumber, setRandomNumber] = useState(getRandomNumber());
  const [chances, setChances] = useState(MAX_CHANCES);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Good luck!");
  const [messageColor, setMessageColor] = useState("#fff");
  const inputRef = useRef(null);

  // Progress state for bar animation
  const progress = (MAX_CHANCES - chances) / MAX_CHANCES;

  const disableInput = chances === 0 || message.startsWith("Congratulations");

  const checkGuess = () => {
    const userGuess = parseInt(guess);
    if (isNaN(userGuess) || userGuess < MIN || userGuess > MAX) {
      setMessage("Please enter a number between 1 and 99.");
      setMessageColor("#ffd700");
      return;
    }

    const newChances = chances - 1;
    setChances(newChances);

    if (userGuess === randomNumber) {
      setMessage("Congratulations! You guessed it right!");
      setMessageColor("#4CAF50");
    } else if (newChances === 0) {
      setMessage(`Game over! The correct number was ${randomNumber}`);
      setMessageColor("#f44336");
    } else if (userGuess < randomNumber) {
      setMessage("Too low! Try again.");
      setMessageColor("#ffd700");
    } else {
      setMessage("Too high! Try again.");
      setMessageColor("#ffd700");
    }
  };

  const handleInputChange = (e) => {
    setGuess(e.target.value.replace(/^0+/, "")); // Remove leading zeros
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !disableInput) {
      checkGuess();
    }
  };

  const handleRestart = () => {
    setRandomNumber(getRandomNumber());
    setChances(MAX_CHANCES);
    setGuess("");
    setMessage("Good luck!");
    setMessageColor("#fff");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div
      className="guessnumber-body"
      style={{
        background: `url(${bgImage}) no-repeat center center fixed`,
        backgroundSize: "cover",
      }}
    >
      <div className="guessnumber-overlay"></div>
      <div className="game-container">
        <h1>Guess the Number</h1>
        <p>Try to guess the number between 1 and 99</p>
        <input
          type="number"
          id="guess-input"
          min={MIN}
          max={MAX}
          placeholder="Enter your guess"
          value={guess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disableInput}
          ref={inputRef}
        />
        <button
          className="check-btn"
          onClick={checkGuess}
          disabled={disableInput}
        >
          Check
        </button>
        <button className="restart-btn" onClick={handleRestart}>
          Restart
        </button>
        <p className="message" style={{ color: messageColor }}>
          {message}
        </p>
        <p className="chances">
          Chances left: <span id="chances">{chances}</span>
        </p>
        <div
          className="progress"
          style={{ transform: `scaleX(${progress})` }}
        ></div>
      </div>
    </div>
  );
}