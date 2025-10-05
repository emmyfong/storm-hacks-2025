# Storm Hacks 2025 - Trivia Battle Game

A multiplayer trivia game that combines Unity visualization with a web-based player interface.

## Setup Instructions

### Host Setup (Unity Game)
1. Download and unzip the Unity game files from this repository
2. Open the Unity game on a device that all players can see (e.g., a shared screen or projector)
3. Run the game to host a new lobby
4. A lobby code will be displayed on screen - share this with your players

### Player Instructions
1. Go to [https://storm-hacks-2025.vercel.app/](https://storm-hacks-2025.vercel.app/)
2. Enter your name and the lobby code
3. Wait for all players to join before starting the game
4. Answer trivia questions to battle other players!

## Important Notes

**Browser Refresh Warning**:
- Refreshing the page will disconnect players from the game
- Due to current implementation, players cannot reconnect to an existing lobby
- If disconnected, all players must wait for a new game to be hosted

**Starting a New Game**:
- To start a new game, you must close and reopen the Unity game
- Generate a new lobby for players to join
- Players will need to rejoin with the new lobby code

## Technical Details
- Unity Game Host: Manages the game state and visualization
- Web Client: Handles player interactions and displays trivia questions
- Real-time multiplayer using WebSocket connections

[Unity Repository](https://github.com/EvanDongChen/StormHacks2025-PlasticSCM-Gitsync)

## Known Limitations
- No browser cache implementation for session persistence
- Refresh/reconnect functionality not currently supported
- One active lobby per Unity instance

Enjoy the game!
