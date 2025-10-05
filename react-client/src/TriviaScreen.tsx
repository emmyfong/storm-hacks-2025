// TriviaScreen.tsx
import React, { useState } from 'react';
// import { useSocketContext } from './SocketContext.tsx'; // commented out for now
import './css/TriviaScreen.css';

// Import your button images
import buttonA from './assets/buttonA.png';
import buttonB from './assets/buttonB.png';
import buttonC from './assets/buttonC.png';
import buttonD from './assets/buttonD.png';

export default function TriviaScreen() {
  const question = "What is the capital of France?";
  const choices = ["Paris", "London", "Berlin", "Rome"];
  const images = [buttonA, buttonB, buttonC, buttonD];

  const [selected, setSelected] = useState<string | null>(null);

  // const { submitAnswer, haveAllPlayersSubmitted } = useSocketContext(); // commented out

  const handleChoice = (choice: string) => {
    if (selected) return; // prevent multiple selections
    setSelected(choice);
    console.log("You selected:", choice);
    // submitAnswer(choice); // commented out
  };

  return (
    <div className="trivia-container">
      <h2 className="trivia-question">{question}</h2>

      <div className="trivia-buttons">
        {choices.map((choice, idx) => (
          <button
            key={idx}
            className="trivia-button"
            style={{ backgroundImage: `url(${images[idx]})` }}
            onClick={() => handleChoice(choice)}
            disabled={!!selected}
          >
            <span>{choice}</span>
          </button>
        ))}
      </div>

      {/* Socket-related code commented out for now */}
      {/* 
      {haveAllPlayersSubmitted() && (
        <p style={{ marginTop: '1rem', color: 'orange' }}>
          All players have submitted!
        </p>
      )}
      */}
    </div>
  );
}
