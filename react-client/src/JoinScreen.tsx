import { useState } from 'react';
import { useSocketContext } from './SocketContext.tsx';
import './css/JoinScreen.css'
import './css/main.css'

export default function JoinScreen() {
    const { socket, playerName, setPlayerName, joinLobby } = useSocketContext();
    const [inputCode, setInputCode] = useState('');

    // Function to re-center the screen
    const handleFocusBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.blur(); // Dismiss keyboard
        window.scrollTo(0, 0); // Reset scroll position instantly
    };

    const handleJoin = () => {
        joinLobby(inputCode);
        window.scrollTo(0, 0);
    };

    return (
        <div className="main-screen">
            <div className="input-container">
                <h1>Join a Game</h1>
                <div className="input-group">
                    <label htmlFor="playerName" className="input-label">Player Name</label>
                    <input
                        id="playerName"
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        onBlur={handleFocusBlur}
                        className="text-input"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="lobbyCode" className="input-label">Lobby Code</label>
                    <input
                        id="lobbyCode"
                        type="text"
                        placeholder="Enter lobby code"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        onBlur={handleFocusBlur}
                        className="text-input"
                    />
                </div>

                <button 
                    onClick={handleJoin} 
                    disabled={!socket || !playerName || !inputCode}
                >
                    Join Lobby
                </button>
            </div>
        </div>
    );
}