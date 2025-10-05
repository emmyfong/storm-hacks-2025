import { useState, useEffect, createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Player, TriviaData, RewardData, GameStateChangeData } from './types';


// Define a type for our socket context
export interface SocketContextType {
    socket: Socket | null;
    playerName: string;
    setPlayerName: (name: string) => void;
    lobbyCode: string;
    setLobbyCode: (code: string) => void;
    players: Player[];
    joinLobby: () => void;
    currentScreen: 'join' | 'lobby' | 'input' | 'choice' | 'reward' | 'endgame';
    setCurrentScreen: (screen: 'join' | 'lobby' | 'input' | 'choice' | 'reward' | 'endgame') => void;
    gameState: string;
    submitPrompt: (promptText: string) => void;
    triviaData: TriviaData | null;
    rewardData: RewardData | null;
    submitAnswer: (answerIndex: number) => void;
}

// Create context for socket
const SocketContext = createContext<SocketContextType | null>(null);


// Initialize the socket connection to your server

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lobbyCode, setLobbyCode] = useState<string>('');
    const [playerName, setPlayerName] = useState<string>('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentScreen, setCurrentScreen] = useState<'join' | 'lobby' | 'input' | 'choice' | 'reward' | 'endgame'>('join');
    const [gameState, setGameState] = useState<string>('');
    const [triviaData, setTriviaData] = useState<TriviaData | null>(null);
    const [rewardData, setRewardData] = useState<RewardData | null>(null);
    
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
            // Switch to lobby screen when players are received
            if (data.players.length > 0) {
                setCurrentScreen('lobby');
            }
        });

        newSocket.on('joinError', (data: { message: string }) => {
            alert(`Error: ${data.message}`);
        });

        newSocket.on('gameStateChange', (data: GameStateChangeData) => {
            console.log('Game state changed to:', data);
            setGameState(data.state);
            
            // Switch to input screen when state is PROMPT
            if (data.state === 'PROMPT') {
                setCurrentScreen('input');
            } else if (data.state === 'TRIVIA') {
                setTriviaData({ question: data.question, options: data.options });
                setCurrentScreen('choice');
            } else if (data.state === 'REWARD') {
                setRewardData({ results: data.results, solutionIndex: data.solutionIndex });
                setCurrentScreen('reward');
            } else if (data.state === 'ENDGAME') {
                setCurrentScreen('endgame');
            }
        });

        // **Clean up the connection when the component unmounts**
        return () => {
            newSocket.disconnect();
        };
    }, [serverUrl]);

    const joinLobby = () => {
        if (socket && playerName && lobbyCode) {
            socket.emit('joinLobby', { lobbyCode: lobbyCode.toUpperCase(), playerName });
        }
    };

    const submitPrompt = (promptText: string) => {
        if (socket && lobbyCode) {
            socket.emit('submitPrompt', { lobbyCode, promptText });
        }
    };

    const submitAnswer = (answerIndex: number) => {
        if (socket && lobbyCode) {
            socket.emit('submitAnswer', { lobbyCode, answerIndex });
        }
    };

    return (
        <SocketContext.Provider value={{ 
            socket, 
            playerName, 
            setPlayerName, 
            lobbyCode, setLobbyCode, 
            players, 
            joinLobby, 
            currentScreen, setCurrentScreen, 
            gameState, submitPrompt,
            triviaData,
            rewardData,
            submitAnswer
        }}>
            {children}
        </SocketContext.Provider>
    );
}

/* eslint-disable react-refresh/only-export-components */
// Hook to use context
export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
}
