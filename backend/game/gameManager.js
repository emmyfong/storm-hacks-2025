//Handle all the lobbies

const lobbies = new Map()
const LOBBY_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const GAME_STATES = {
    JOINING: 'JOINING',
    PROMPT: 'PROMPT',
    TRIVIA: 'TRIVIA',
    REWARD: 'REWARD',
    ENDGAME: 'ENDGAME'
}

//////////Lobby Creation and Join//////////
function generateLobbyCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += LOBBY_CODE_CHARS.charAt(Math.floor(Math.random() * LOBBY_CODE_CHARS.length));
    }
    return code;
}

export function createLobby(hostSocketId) {
    const lobbyCode = generateLobbyCode();
    const newLobby = {
        lobbyCode: lobbyCode,
        hostSocketId: hostSocketId,
        players: [],
        gameType: null, // 'TRIVIA' or 'SPEED'
        gameState: { currentState: GAME_STATES.JOINING }   
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
    const newPlayer = { 
        id: playerId, 
        name: playerName,
        health: 4,
        submitted: false
     };
    lobby.players.push(newPlayer);

    console.log(`[GameManager] Player ${playerName} joined lobby ${lobbyCode}`);
    return { lobby: lobby };
}

//////////Game//////////