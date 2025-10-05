import { useSocketContext } from './SocketContext.tsx';
import './css/Lobby.css';
import './css/main.css';

export interface Player {
    id: string;
    name: string;
    health: number;
}

export default function Lobby() {
    const { lobbyCode, playerName, players, setCurrentScreen } = useSocketContext();
    /*const {setCurrentScreen } = useSocketContext();
    const lobbyCode: string = '1234';
    const playerName: string = 'Keira';
    const players: Player[] = [
        { id: '1', name: 'Keira', health: 4},
        { id: '2', name: 'Emmy', health: 4 },
        { id: '3', name: 'Sophia', health:  4 },
        { id: '4', name: 'Evan', health: 4 },
      ];*/

    return (
        <div className="main-screen">
            <div className="lobby-container">
                <h1>Lobby: {lobbyCode}</h1>
                
                {playerName && (
                    <div className="current-player">
                        <h2>Welcome, {playerName}</h2>
                    </div>
                )}

                <div className="lobby-info">
                    <h2>Players in Lobby ({players.length}):</h2>
                    {players.length > 0 ? (
                        <ul className="players-list">
                            {players.map((player) => (
                                <li key={player.id} className="player-item">
                                    <span className="player-name-display">{player.name} - HP: {player.health}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-players">No players in lobby yet</p>
                    )}
                </div>

                <button 
                    onClick={() => setCurrentScreen('join')} 
                >
                    Back to Join
                </button>
            </div>
        </div>
    );
}