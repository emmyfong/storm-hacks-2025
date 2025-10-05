import { useState } from 'react';
import { useSocketContext } from './SocketContext.tsx';
import './css/JoinScreen.css'
import './css/main.css'

export default function JoinScreen() {
    const { socket, playerName, setPlayerName, joinLobby } = useSocketContext();

    const [inputCode, setInputCode] = useState('');

    const handleJoin = () => {
        joinLobby(inputCode);
    };

    return (
        <div className="main-screen">
            <div className="input-container">
                <h1>Join a Game</h1>
                <div className="input-group">
                    <input
                        id="playerName"
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="text-input"
                    />
                </div>

                <div className="input-group">
                    <input
                        id="lobbyCode"
                        type="text"
                        placeholder="Enter lobby code"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
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