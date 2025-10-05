import { useSocketContext } from './SocketContext.tsx';
import './css/main.css';
import './css/Lobby.css';

/*export interface Player {
    id: string;
    name: string;
}*/

export default function EndScreen() {
    const { players } = useSocketContext();
    /*const {setCurrentScreen } = useSocketContext();
    const lobbyCode: string = '1234';
    const playerName: string = 'Keira';
    const players: Player[] = [
        { id: '2', name: 'Keira' },
        { id: '1', name: 'Emmy' },
        { id: '4', name: 'Sophia' },
        { id: '3', name: 'Evan' },
      ];*/

      // Sort players and find the winner
      const sortedPlayers = [...players].sort((a, b) => Number(a.id) - Number(b.id))
      const winner = sortedPlayers[0];
      const otherPlayers = sortedPlayers.slice(1);

    return (
        <div className="main-screen">
            <div className="lobby-container">
                {winner ? (
                    <h1>Winner! {winner.name}</h1>
                ): (
                    <p>No winner...</p>
                  )}

                <div className="lobby-info">
                    <h2>Leaderboard</h2>
                    {players.length > 0 ? (
                        <ul className="players-list">
                            {otherPlayers.map((player, index) => (
                                <li key={player.id} className="player-item">
                                    <span className="player-name-display"> {index + 2}. {player.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-players">No players</p>
                    )}
                </div>
            </div>
        </div>
    );
}