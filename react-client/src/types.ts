export interface Player {
    id: string;
    name: string;
    health: number;
    submitted: boolean;
}

export interface TriviaData {
    question: string;
    options: string[];
}

// NEW: Define the structure for the reward/results data
export interface RoundResult {
    playerId: string;
    playerName: string;
    isCorrect: boolean;
}

export interface RewardData {
    results: RoundResult[];
    solutionIndex: number;
}

type PromptStatePayload = { state: 'PROMPT'; timer: number; players: Player[] };
type TriviaStatePayload = { state: 'TRIVIA'; question: string; options: string[]; timer: number; players: Player[] };
type RewardStatePayload = { state: 'REWARD'; results: RoundResult[]; solutionIndex: number; timer: number; players: Player[] };
type EndgameStatePayload = { state: 'ENDGAME'; winner: string; players: Player[] };
type LoadingStatePayload = { state: 'GENERATING' };

export type GameStateChangeData =
    | PromptStatePayload
    | TriviaStatePayload
    | RewardStatePayload
    | EndgameStatePayload
    | LoadingStatePayload;