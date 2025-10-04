//Handles all socket communication with clients

import * as gameManager from './gameManager.js';

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

            //When a unity instance connects and createLobby, different lobbies are generated
            //io.to(lobbyCode).emit makes sure we are only sending to lobby code
            io.to(lobbyCode).emit('lobbyUpdate', {
                lobbyCode: lobbyCode,
                players: result.lobby.players
            });
        });
        //---------------------------

        //-------Game----------


        //------------Disconnect-------------
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
        });
    });
}