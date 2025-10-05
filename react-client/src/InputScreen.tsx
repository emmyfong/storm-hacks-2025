import { useState } from 'react';
import { useSocketContext } from './SocketContext.tsx';
import './css/InputScreen.css';

export default function InputScreen() {
    const { socket } = useSocketContext();
    const [userInput, setUserInput] = useState<string>('');

    const handleSubmit = () => {
        if (socket && userInput.trim()) {
            socket.emit('submitPrompt', { input: userInput.trim() });
            setUserInput(''); // Clear input after sending
        }
    };

    return (
        <div className="input-screen">
            <div className="input-container">
                
                <div className="input-group">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter A Category"
                        maxLength={30}
                        className="text-input"
                        autoFocus
                    />
                    <button 
                        onClick={handleSubmit}
                        disabled={!userInput.trim()}
                        className="join-button"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
