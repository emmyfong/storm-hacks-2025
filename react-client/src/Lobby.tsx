

interface Player {
  id: string;
  name: string;
}

interface LobbyProps {
  lobbyCode: string;
  setLobbyCode: (value: string) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  players: Player[];
  handleJoinLobby: () => void;
}

export default function Lobby({
  lobbyCode,
  setLobbyCode,
  playerName,
  setPlayerName,
  players,
  handleJoinLobby
}: LobbyProps) {
  return (
    <div>
      <h1>Join a Game</h1>

      {playerName && (
        <div className="current-player">
          <h2>Current Player: <span className="player-name">{playerName}</span></h2>
        </div>
      )}

      <input
        type="text"
        placeholder="Your Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lobby Code"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
      />
      <button onClick={handleJoinLobby}>Join Lobby</button>

      <div>
        <h2>Players in Lobby:</h2>
        <ul>
          {players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}