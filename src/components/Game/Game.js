import React, { useState } from "react";

import { sample, range } from "../../utils";
import { WORDS } from "../../data";

// Pick a random word on every pageload.
const answer = sample(WORDS);
// To make debugging easier, we'll log the solution in the console.
console.info({ answer });

function Game() {
  const [activeGuess, setActiveGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameState, setGameState] = useState({
    isOver: false,
    status: "lost",
  });

  const isValidWord = () => {
    return /^[a-zA-Z]+$/.test(activeGuess) && activeGuess.length === 5;
  };

  const checkGuess = () => {
    // status will either be: incorrect, misplaced, or correct
    const guessStatus = [...activeGuess].map((letter, index) => {
      if (letter === answer[index]) {
        return {
          letter,
          status: "correct",
        };
      } else if ([...answer].find((ansLetter) => letter === ansLetter)) {
        return {
          letter,
          status: "misplaced",
        };
      } else {
        return {
          letter,
          status: "incorrect",
        };
      }
    });

    return guessStatus;
  };

  const handleSubmitGuess = (e) => {
    e.preventDefault();

    const isValid = isValidWord();

    if (!isValid) {
      console.log(`${activeGuess} is not a valid word, try again`);
      return;
    }

    const filteredGuess = checkGuess();

    const nextGuesses = [...guesses, filteredGuess];

    setGuesses(nextGuesses);
    setActiveGuess("");

    const isCorrect = filteredGuess.every(({ letter, status }) => {
      return status === "correct";
    });

    console.log(isCorrect);

    if (isCorrect) {
      setGameState({
        isOver: true,
        status: "won",
      });
      return;
    }

    if (nextGuesses.length === 6) {
      setGameState({
        isOver: true,
        status: "lost",
      });
    }
  };

  return (
    <>
      <div className="guess-results">
        {range(6).map((rowNum) => (
          <p key={`row-${rowNum}`} className="guess">
            {guesses[rowNum]
              ? guesses[rowNum].map(({ letter, status }, index) => (
                  <span
                    key={`row-${rowNum}-col-${index}`}
                    className={`cell ${status}`}
                  >
                    {letter}
                  </span>
                ))
              : range(5).map((colNum) => (
                  <span
                    className="cell"
                    key={`row-${rowNum}-column-${colNum}`}
                  ></span>
                ))}
          </p>
        ))}
      </div>
      {gameState.isOver ? (
        <div className={`${gameState.status} banner`}>
          {gameState.status === "won" ? (
            <p>
              <strong>Congratulations!</strong> Got it in
              <strong> {guesses.length} guesses</strong>.
            </p>
          ) : (
            <p>
              Sorry, the correct answer is <strong>{answer}</strong>.
            </p>
          )}
        </div>
      ) : (
        <form className="guess-input-wrapper" onSubmit={handleSubmitGuess}>
          <label forhtml="guess-input">Enter guess:</label>
          <input
            value={activeGuess}
            onChange={(e) => {
              if (e.target.value.length > 5) return; // max 5 characters
              const upperCaseGuess = e.target.value.toUpperCase();
              setActiveGuess(upperCaseGuess);
            }}
            id="guess-input"
            type="text"
          />
        </form>
      )}
    </>
  );
}

export default Game;
