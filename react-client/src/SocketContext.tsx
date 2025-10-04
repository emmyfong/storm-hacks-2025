import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// Define a type for our player object
interface Player {
    id: string;
    name: string;
}

// Initialize the socket connection to your server

function SocketContext() {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobbyCode, setLobbyCode] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]);
    
    useEffect(() => {
        // **Create the connection only once when the component mounts**
        const newSocket = io(serverUrl, {
            transports: ["websocket"]
        });
        setSocket(newSocket);

        // --- Event Listeners ---
        newSocket.on('connect', () => {
            console.log('Connected to server!');
            newSocket.emit('registerPlayer');
        });

        newSocket.on('lobbyUpdate', (data: { players: Player[] }) => {
            setPlayers(data.players);
        });

        newSocket.on('joinError', (data: { message: string }) => {
            alert(`Error: ${data.message}`);
        });

        // **Clean up the connection when the component unmounts**
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleJoinLobby = () => {
        if (socket && playerName && lobbyCode) {
            socket.emit('joinLobby', { lobbyCode: lobbyCode.toUpperCase(), playerName });
        }
    };

    return (
        <div>
            <h1>Join a Game</h1>
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
                    {players.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default SocketContext;