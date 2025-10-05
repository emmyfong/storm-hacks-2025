import { useSocketContext } from './SocketContext.tsx';
import './css/main.css'

export default function JoinScreen() {
    const { socket, lobbyCode, setLobbyCode, playerName, setPlayerName, joinLobby } = useSocketContext();

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
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                        className="text-input"
                    />
                </div>

                <button 
                    onClick={joinLobby} 
                    disabled={!socket || !playerName || !lobbyCode}
                >
                    Join Lobby
                </button>
            </div>
        </div>
    );
}
