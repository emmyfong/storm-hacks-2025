//Handles all socket communication with clients
import * as gameManager from './gameManager.js';

const ROUND_TIMER_SECONDS = 20;
const REWARD_PHASE_SECONDS = 10;

export function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        //-------Connection----------
        socket.on('registerHost', () => {
            console.log(`Host registered: ${socket.id} (Unity)`);
        });
        socket.on('registerPlayer', () => {
            console.log(`Player registered: ${socket.id} (React)`);
        });
        //---------------------------

        //-------Lobby Event----------
        socket.on('createLobby', () => {
            const newLobby = gameManager.createLobby(socket.id);
            socket.join(newLobby.lobbyCode);
            socket.emit('lobbyCreated', { lobbyCode: newLobby.lobbyCode });
        });

        socket.on('joinLobby', ({ lobbyCode, playerName }) => {
            const result = gameManager.joinLobby(lobbyCode, socket.id, playerName);
            if (result.error) {
                socket.emit('joinError', { message: result.error });
                return;
            }
            socket.join(lobbyCode);

            io.to(lobbyCode).emit('lobbyUpdate', {
                lobbyCode: lobbyCode,
                players: result.lobby.players
            });
        });
        //---------------------------

        //-------Game----------
        socket.on('startGame', ({ lobbyCode }) => {
            const { lobby } = gameManager.startGame(lobbyCode);
            io.to(lobbyCode).emit('gameStateChange', { state: 'PROMPT', lobbyState: lobby.gameState });

            const timerId = setTimeout(() => handlePromptPhaseEnd(lobbyCode), ROUND_TIMER_SECONDS * 1000);
            gameManager.setLobbyTimer(lobbyCode, timerId); 
        });
        socket.on('submitPrompt', ({ lobbyCode, promptText }) => {
            const { lobby } = gameManager.recordPrompt(lobbyCode, socket.id, promptText);
            //emit update to show who submitted
            io.to(lobbyCode).emit('playerSubmittedUpdate', { players: lobby.players });

            //Check if the prompts are done earlier than timer
            if (gameManager.haveAllPlayersSubmitted(lobbyCode)) {
                clearLobbyTimer(lobbyCode);
                handlePromptPhaseEnd(lobbyCode);
            }
        });

        socket.on('submitAnswer', ({ lobbyCode, answerIndex }) => {
            gameManager.recordPlayerAnswer(lobbyCode, socket.id, answerIndex);
            io.to(lobbyCode).emit('playerSubmittedUpdate', { players: gameManager.getLobby(lobbyCode).players });

            // end round early if everyone has answered
            if (gameManager.haveAllPlayersSubmitted(lobbyCode)) {
                clearLobbyTimer(lobbyCode);
                handleTriviaPhaseEnd(lobbyCode);
            }
        });
        //---------------------------

        //-------Game Flow----------

        async function handlePromptPhaseEnd(lobbyCode) {
            console.log(`Lobby ${lobbyCode}: Prompt phase ended. Generating questions...`);
            io.to(lobbyCode).emit('gameStateChange', { state: 'GENERATING' }); 

            const { prompts } = gameManager.getAllPrompts(lobbyCode);
            
            // Using placeholder data
            const placeholderQuestions = [
                ["What is the capital of Canada?", "Toronto", "Vancouver", "Ottawa", "Montreal", "Ottawa"],
                ["Which planet is known as the Red Planet?", "Venus", "Mars", "Jupiter", "Saturn", "Mars"],
                ["What is 2 + 2?", "3", "4", "5", "6", "4"]
            ];
            
            gameManager.createQuestionBank(lobbyCode, placeholderQuestions);
            startNextRound(lobbyCode);
        }

        function startNextRound(lobbyCode) {
            const { lobby } = gameManager.startNextTriviaRound(lobbyCode);

            if (lobby.gameState.currentState === 'ENDGAME') {
                io.to(lobbyCode).emit('gameStateChange', { state: 'ENDGAME', winner: lobby.winner, players: lobby.players });
                return;
            }
            
            io.to(lobbyCode).emit('gameStateChange', {
                state: 'TRIVIA',
                question: lobby.gameState.question,
                options: lobby.gameState.options,
                players: lobby.players
            });

            const timerId = setTimeout(() => handleTriviaPhaseEnd(lobbyCode), ROUND_TIMER_SECONDS * 1000);
            gameManager.setLobbyTimer(lobbyCode, timerId);
        }

        function handleTriviaPhaseEnd(lobbyCode) {
            const { lobby, results } = gameManager.endTriviaRound(lobbyCode);
            
            // REWARD phase trigger
            io.to(lobbyCode).emit('gameStateChange', {
                state: 'REWARD',
                results: results,
                solutionIndex: lobby.gameState.solutionIndex,
                players: lobby.players
            });
            
            if (lobby.gameState.currentState === 'ENDGAME') {
                setTimeout(() => {
                    io.to(lobbyCode).emit('gameStateChange', { state: 'ENDGAME', winner: lobby.winner, players: lobby.players });
                }, REWARD_PHASE_SECONDS * 1000);
                return;
            }

            setTimeout(() => startNextRound(lobbyCode), REWARD_PHASE_SECONDS * 1000);
        }

        //---------------------------
    

        //------------Disconnect-------------
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
}