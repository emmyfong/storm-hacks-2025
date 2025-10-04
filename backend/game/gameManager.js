//Handle all the lobbies

const lobbies = new Map()

function generateLobbyCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export function createLobby(hostSocketId) {
    const lobbyCode = generateLobbyCode();
    const newLobby = {
        lobbyCode: lobbyCode,
        hostSocketId: hostSocketId,
        players: [],
    };

    // Add the new lobby to our master list
    lobbies.set(lobbyCode, newLobby);
    console.log(`[GameManager] Lobby created: ${lobbyCode}`);
    return newLobby;
}

export function joinLobby(lobbyCode, playerId, playerName) {
    // Check if the lobby exists
    if (!lobbies.has(lobbyCode)) {
        console.log(`[GameManager] Attempted to join non-existent lobby: ${lobbyCode}`);
        return { error: 'Lobby not found.' };
    }

    const lobby = lobbies.get(lobbyCode);
    const newPlayer = { id: playerId, name: playerName };
    lobby.players.push(newPlayer);

    console.log(`[GameManager] Player ${playerName} joined lobby ${lobbyCode}`);
    return { lobby: lobby };
}