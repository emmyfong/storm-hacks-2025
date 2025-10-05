import { useSocketContext } from './SocketContext.tsx';
import './css/main.css';
import './css/Lobby.css';

export default function EndScreen() {
    const { gameStateData } = useSocketContext();

    if (gameStateData?.state !== 'ENDGAME') {
        return <div className="main-screen"><h1>Game Over</h1></div>;
    }

    const winnerName = gameStateData.winner;
    const sortedPlayers = [...gameStateData.players].sort((a, b) => b.health - a.health);

    return (
        <div className="main-screen">
            <div className="lobby-container">
                <h1>Winner: {winnerName}!</h1>

                <div className="lobby-info">
                    <h2>Final Leaderboard</h2>
                    <ul className="players-list">
                        {sortedPlayers.map((player, index) => (
                            <li key={player.id} className="player-item">
                                <span className="player-name-display">
                                    {index + 1}. {player.name} (HP: {player.health})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}