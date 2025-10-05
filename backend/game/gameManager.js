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
    let lobbyCode;
    //Check to see if the lobby code exists in the lobbies map
    do {
        lobbyCode = generateLobbyCode();
    } while (lobbies.has(lobbyCode))
    const newLobby = {
        lobbyCode: lobbyCode,
        hostSocketId: hostSocketId,
        players: [],
        gameType: null, // 'TRIVIA' or 'SPEED'
        gameState: { 
            currentState: GAME_STATES.JOINING,
            promptSubmissions: [], // will store {playerId, promptText}
            timerId: null, //stores the round timer
        }   
    };

    // Add the new lobby to our master list
    lobbies.set(lobbyCode, newLobby);
    console.log(`[GameManager] Lobby created: ${lobbyCode}`);
    return newLobby;
}

export function joinLobby(lobbyCode, playerId, playerName) {
    // Check if the lobby exists
    if (!lobbies.has(lobbyCode)) {
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

export function getLobby(lobbyCode) {
    return lobbies.get(lobbyCode);
}

export function setLobbyTimer(lobbyCode, timerId) {
    const lobby = lobbies.get(lobbyCode);
    if (lobby) {
        lobby.gameState.timerId = timerId;
    }
}

export function getAllPrompts(lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (lobby && lobby.gameState.promptSubmissions) {
        return { prompts: lobby.gameState.promptSubmissions.map(p => p.promptText) };
    }
    return { prompts: [] };
}

//////////Game Flow Functions//////////
//start a specific game type in the lobby
export function startGame(lobbyCode, gameType = 'TRIVIA') {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return { error: 'Lobby not found.' };

    lobby.gameType = gameType
    //set state to prompt
    lobby.gameState.currentState = GAME_STATES.PROMPT;
    console.log(`[GameManager] Game started in lobby ${lobbyCode}. State: ${lobby.gameState.currentState}`);
    return { lobby };
}

//get the player prompt submission for category
export function recordPrompt(lobbyCode, playerId, promptText) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby || lobby.gameState.currentState !== GAME_STATES.PROMPT) return;

    const player = lobby.players.find(p => p.id === playerId);
    // Ensure a player can only submit once
    if (player && !player.submitted) {
        player.submitted = true;
        lobby.gameState.promptSubmissions.push({
            playerId: playerId,
            promptText: promptText
        });
        console.log(`[GameManager] Lobby ${lobbyCode}: Player ${player.name} submitted prompt.`);
    }
    return { lobby };
}

//takes all the generated questions and randomizes them
// stores the questions in a questionBank
export function createQuestionBank(lobbyCode, allGeneratedQuestions) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return;

    // Shuffle the entire bank of questions for variety
    lobby.gameState.questionBank = [...allGeneratedQuestions].sort(() => Math.random() - 0.5);
    
    console.log(`[GameManager] Lobby ${lobbyCode}: Created a question bank with ${lobby.gameState.questionBank.length} questions.`);
    return { lobby };
}

//prepare the lobby for a new prompt phase when the question bank is empty

function prepareNextPromptPhase(lobby) {
    lobby.gameState.currentState = GAME_STATES.PROMPT;
    lobby.gameState.promptSubmissions = []; // Clear old prompts
    // Only reset the 'submitted' flag for players who are still alive
    lobby.players.forEach(p => {
        if (p.health > 0) {
            p.submitted = false;
        } else {
            p.submitted = true; // Dead players are considered "submitted"
        }
    });
    console.log(`[GameManager] Lobby ${lobby.lobbyCode}: Question bank empty. Starting new PROMPT phase.`);
}

//make the trivia question bank and set state to TRIVIA
export function startNextTriviaRound(lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return;

    const alivePlayers = lobby.players.filter(p => p.health > 0);
    if (alivePlayers.length <= 1) {
        lobby.gameState.currentState = GAME_STATES.ENDGAME;
        lobby.winner = alivePlayers.length > 0 ? alivePlayers[0].name : "No one";
        return { lobby };
    }

    // Check if there are any questions left
    if (!lobby.gameState.questionBank || lobby.gameState.questionBank.length === 0) {
        // Bank is empty, but game is not over Re-prompt
        prepareNextPromptPhase(lobby);
        return { lobby };
    }

    // Pull the next question from the front of the array
    const triviaData = lobby.gameState.questionBank.shift();
    const [question, ...options] = triviaData;
    const solution = options[options.length - 1]; 
    const answers = options.slice(0, 4); 

    // Shuffle answers for this specific question
    let shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
    const newSolutionIndex = shuffledAnswers.findIndex(answer => answer === solution);

    lobby.gameState.currentState = GAME_STATES.TRIVIA;
    lobby.gameState.question = question;
    lobby.gameState.options = shuffledAnswers;
    lobby.gameState.solutionIndex = newSolutionIndex;

    // Reset player submission status for the round
    lobby.players.forEach(p => {
        p.submitted = false;
        delete p.lastAnswer;
    });

    console.log(`[GameManager] Lobby ${lobbyCode}: Starting new TRIVIA round. ${lobby.gameState.questionBank.length} questions remaining.`);
    return { lobby };
}

//record player answers
export function recordPlayerAnswer(lobbyCode, playerId, answerIndex) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby || lobby.gameState.currentState !== GAME_STATES.TRIVIA) return;

    const player = lobby.players.find(p => p.id === playerId);
    if (player && !player.submitted) {
        player.submitted = true;
        player.lastAnswer = answerIndex;
        console.log(`[GameManager] Lobby ${lobbyCode}: Player ${player.name} answered.`);
    }
    return { lobby };
}

//Check if all players have submitted
export function haveAllPlayersSubmitted(lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return false;

    const alivePlayers = lobby.players.filter(p => p.health > 0);
    if (alivePlayers.length === 0) return true; 

    // Check if every alive player has the 'submitted' flag set to true
    return alivePlayers.every(p => p.submitted);
}

//end trivia round
export function endTriviaRound(lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return { error: 'Lobby not found.' };

    lobby.gameState.currentState = GAME_STATES.REWARD;
    const solutionIndex = lobby.gameState.solutionIndex;
    const results = [];

    lobby.players.forEach(player => {
        const isCorrect = player.submitted && player.lastAnswer === solutionIndex;
        if (!isCorrect) {
            player.health -= 1;
        }
        results.push({
            playerId: player.id,
            playerName: player.name,
            isCorrect: isCorrect
        });
    });

    // Check for a single winner
    const alivePlayers = lobby.players.filter(p => p.health > 0);
    if (alivePlayers.length <= 1) {
        lobby.gameState.currentState = GAME_STATES.ENDGAME;
        lobby.winner = alivePlayers.length > 0 ? alivePlayers[0].name : "No one";
    }

    console.log(`[GameManager] Lobby ${lobbyCode}: Round ended. New state: ${lobby.gameState.currentState}`);
    return { lobby, results };
}
