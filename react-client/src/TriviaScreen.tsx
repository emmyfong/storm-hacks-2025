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
    const { gameState, triviaData, rewardData, submitAnswer, players, playerName } = useSocketContext();
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResultText, setShowResultText] = useState(false);
    const images = [buttonA, buttonB, buttonC, buttonD];

    const me = players.find(p => p.name === playerName);
    const isAlive = me && me.health > 0;

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

const renderTriviaContent = () => {
        if (!triviaData) return null;

        // --- if someone's dead ---
        if (!isAlive && gameState === 'TRIVIA') {
            return (
                <div className="trivia-layout">
                    <div className="question-container">
                        <h2 className="trivia-question">{triviaData.question}</h2>
                        <p className="spectator-text">You've been eliminated! Spectating...</p>
                    </div>
                    <div className="answers-container">
                        <div className="trivia-buttons">
                            {triviaData.options.map((option, index) => (
                                <button
                                    key={index}
                                    className="trivia-button disabled"
                                    style={{ backgroundImage: `url(${images[index]})` }}
                                    disabled={true}
                                >
                                    <span>{option}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // --- alive player ---
        if (isAlive && gameState === 'TRIVIA') {
            return (
                <div className="trivia-layout">
                    <div className="question-container">
                        <h2 className="trivia-question">{triviaData.question}</h2>
                    </div>
                    <div className="answers-container">
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
                </div>
            );
        }

        return null;
    };

    // --- main ---
    if (gameState === 'TRIVIA') {
        return (
            <div className="main-screen trivia-background">
                {renderTriviaContent()}
            </div>
        );
    }
    
    if (gameState === 'REWARD' && rewardData && triviaData) {
      const myResult = rewardData.results.find(r => r.playerName === playerName);
      const resultText = myResult?.isCorrect ? "Correct!" : "Incorrect!";
      return (
          <div className="result-screen">
              <h2 className="trivia-question">{triviaData.question}</h2>
              <h1 className={`result-text ${showResultText ? 'visible' : ''}`}>{resultText}</h1>
              <p>The correct answer was: {triviaData.options[rewardData.solutionIndex]}</p>
          </div>
      ); 
    }

    return (
        <div className="main-screen trivia-background">
            {isAlive ? <h2>Waiting for the next round...</h2> : <h2>You've been eliminated! Spectating...</h2>}
        </div>
    );
}
