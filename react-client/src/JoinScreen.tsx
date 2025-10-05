import { useSocketContext } from './SocketContext.tsx';

export default function JoinScreen() {
    const { socket, lobbyCode, setLobbyCode, playerName, setPlayerName, joinLobby } = useSocketContext();

    return (
        <div className="join-screen">
            <div className="join-container">
                <h1>Join a Game</h1>
                <p className="join-subtitle">Enter your details to join a lobby</p>

                <div className="input-group">
                    <label htmlFor="playerName">Your Name</label>
                    <input
                        id="playerName"
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="join-input"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="lobbyCode">Lobby Code</label>
                    <input
                        id="lobbyCode"
                        type="text"
                        placeholder="Enter lobby code"
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                        className="join-input"
                    />
                </div>

                <button 
                    onClick={joinLobby} 
                    disabled={!socket || !playerName || !lobbyCode}
                    className="join-button"
                >
                    Join Lobby
                </button>

                {!socket && (
                    <p className="connection-status">Connecting to server...</p>
                )}
            </div>
        </div>
    );
}
