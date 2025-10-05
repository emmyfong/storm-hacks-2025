import { useState } from 'react';
import { useSocketContext } from './SocketContext.tsx';
import './css/InputScreen.css';
import './css/main.css';

export default function InputScreen() {
    const { submitPrompt } = useSocketContext();
    const [userInput, setUserInput] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = () => {
        if (userInput.trim() && !submitted) {
            submitPrompt(userInput.trim());
            setSubmitted(true); // Clear input after sending
        }
    };

    if (submitted){
        return (
            <div className="main-screen">
                <h2>Thanks! Waiting for other players...</h2>
            </div>
        )
    }

    return (
        <div className="main-screen">
            <div className="input-container">
                
                <div className="input-group">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter A Category"
                        maxLength={30}
                        className="input-field"
                        autoFocus
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={!userInput.trim()}
                        className="submit-button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
