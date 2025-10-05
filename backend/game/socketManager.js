//Handles all socket communication with clients
import * as gameManager from './gameManager.js';
import { generateTriviaQuestion } from '../services/gemini.js';

const ROUND_TIMER_SECONDS = 60;
const PROMPT_PHASE_SECONDS = 60;
const REWARD_PHASE_SECONDS = 20;

export function initializeSocket(io) {
    const clearLobbyTimer = (lobbyCode) => {
        const lobby = gameManager.getLobby(lobbyCode);
        if (lobby && lobby.gameState.timerId) {
            clearTimeout(lobby.gameState.timerId);
            gameManager.setLobbyTimer(lobbyCode, null); // Clear the ID in the state
        }
    };

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
            io.to(lobbyCode).emit('gameStateChange', { state: 'PROMPT', lobbyState: lobby.gameState, timer: PROMPT_PHASE_SECONDS });

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
            
            if (prompts.length === 0) {
                // Handle case where no one submitted a prompt
                console.log(`Lobby ${lobbyCode}: No prompts submitted, ending game.`);
                io.to(lobbyCode).emit('gameStateChange', { state: 'ENDGAME', winner: 'No one submitted prompts!' });
                return;
            }

            console.log(`Lobby ${lobbyCode}: Sending ${prompts.length} prompts to Gemini.`);

            const questionPromises = prompts.map(prompt => generateTriviaQuestion(prompt));
            
            // Wait for all API calls to complete
            const generatedQuestions = await Promise.all(questionPromises);

            // Filter out any failed API calls (which return null)
            const validQuestions = generatedQuestions.filter(q => q !== null);

            if (validQuestions.length === 0) {
                console.log(`Lobby ${lobbyCode}: Gemini failed to generate any questions.`);
                io.to(lobbyCode).emit('gameStateChange', { state: 'ENDGAME', winner: 'Failed to generate questions!' });
                return;
            }

            gameManager.createQuestionBank(lobbyCode, validQuestions);
            startNextRound(lobbyCode);
        }

        function startNextRound(lobbyCode) {
            // This function from gameManager now decides the true next state
            const { lobby } = gameManager.startNextTriviaRound(lobbyCode);
            const currentState = lobby.gameState.currentState;

            switch (currentState) {
                case 'TRIVIA':
                    io.to(lobbyCode).emit('gameStateChange', {
                        state: 'TRIVIA',
                        question: lobby.gameState.question,
                        options: lobby.gameState.options,
                        players: lobby.players,
                        timer: PROMPT_PHASE_SECONDS
                    });
                    const triviaTimerId = setTimeout(() => handleTriviaPhaseEnd(lobbyCode), ROUND_TIMER_SECONDS * 1000);
                    gameManager.setLobbyTimer(lobbyCode, triviaTimerId);
                    break;
                
                case 'PROMPT':
                    // We need to reprompt
                    io.to(lobbyCode).emit('gameStateChange', {
                        state: 'PROMPT',
                        players: lobby.players,
                        timer: ROUND_TIMER_SECONDS
                    });
                    const promptTimerId = setTimeout(() => handlePromptPhaseEnd(lobbyCode), ROUND_TIMER_SECONDS * 1000);
                    gameManager.setLobbyTimer(lobbyCode, promptTimerId);
                    break;

                case 'ENDGAME':
                    io.to(lobbyCode).emit('gameStateChange', {
                        state: 'ENDGAME',
                        winner: lobby.winner,
                        players: lobby.players
                    });
                    break;
            }
        }

        function handleTriviaPhaseEnd(lobbyCode) {
            const { lobby, results } = gameManager.endTriviaRound(lobbyCode);
            
            // REWARD phase trigger
            io.to(lobbyCode).emit('gameStateChange', {
                state: 'REWARD',
                results: results,
                solutionIndex: lobby.gameState.solutionIndex,
                players: lobby.players,
                timer: REWARD_PHASE_SECONDS
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