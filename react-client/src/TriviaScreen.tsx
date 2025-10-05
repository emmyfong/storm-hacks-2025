// TriviaScreen.tsx
import { useState, useEffect } from 'react';
import { useSocketContext } from './SocketContext';
import './css/TriviaScreen.css';
import './css/main.css';

// Import your button images
import buttonA from './assets/buttonA.png';
import buttonB from './assets/buttonB.png';
import buttonC from './assets/buttonC.png';
import buttonD from './assets/buttonD.png';

export default function TriviaScreen() {
    const { gameState, triviaData, rewardData, submitAnswer, playerName } = useSocketContext();
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResultText, setShowResultText] = useState(false);
    const images = [buttonA, buttonB, buttonC, buttonD];

    //resets component for next round
    useEffect(() => {
        if (gameState === 'TRIVIA') {
            setSelectedAnswer(null);
            setShowResultText(false);
        }
    }, [gameState, triviaData]);

    //effect to handle reward phase animations
    useEffect(() => {
        if (gameState === 'REWARD') {
            // Show correct/incorrect text
            setShowResultText(true);
            
        }
    }, [gameState]);

  // const { submitAnswer, haveAllPlayersSubmitted } = useSocketContext(); // commented out

  if (gameState === 'TRIVIA' && triviaData) {
    return (
        <div className="main-screen">
            <h2 className="trivia-question">{triviaData.question}</h2>
            <div className="trivia-buttons">
                {triviaData.options.map((option, index) => (
                    <button
                        key={index}
                        className="trivia-button"
                        style={{ backgroundImage: `url(${images[index]})` }}
                        onClick={() => {
                            setSelectedAnswer(index);
                            submitAnswer(index);
                        }}
                        disabled={selectedAnswer !== null}
                    >
                        <span>{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
  }

  if (gameState === 'REWARD' && rewardData && triviaData) {
    const myResult = rewardData.results.find(r => r.playerName === playerName);
    const resultText = myResult?.isCorrect ? "Correct!" : "Incorrect!";
    return (
        <div className="main-screen">
            <h2 className="trivia-question">{triviaData.question}</h2>
            <h1 className={`result-text ${showResultText ? 'visible' : ''}`}>{resultText}</h1>
            <p>The correct answer was: {triviaData.options[rewardData.solutionIndex]}</p>
        </div>
    );    
  }

  return <div>Waiting for next round...</div>
}
