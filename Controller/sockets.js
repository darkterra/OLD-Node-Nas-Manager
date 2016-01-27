/*
 * Version 0.0.1
 * Date de modification 31/01/2015
 *
 * Socket.js
 *  Gère toute les communications dynamique
 * 
 * Conçu par l'équipe de NNM :
 *  - Jérémy Young
 */

'use strict';

let socketio			= require('socket.io');

module.exports.listen = function(server, sessionMiddleware, ServerEvent, colors) {
    let io						= socketio.listen(server);
    let test 					=	'';
    
    // Configuration de Socket.IO pour pouvoir avoir accès au sessions
		io.use(function(socket, next) {
			sessionMiddleware(socket.request, socket.request.res, next);
		});
		
		/***********************************************************************************
		*														Initialisation des variables												   *
		***********************************************************************************/
		function ReloadModule(socket) {
			ServerEvent.emit('ReloadModule');
			ServerEvent.on('DataRead', function(data) {
	    	test = data;
				socket.emit('ModulesToLoad', test);
	    });
		}
		
    ServerEvent.emit('ReloadModule');
    
    
    // Ouverture de la socket
    io.sockets.on('connection', function (socket) {
    	
    	ReloadModule(socket);
    	
    	// socket.on('ReloadModule', ReloadModule(socket));
			
			// ----------------------- Décompte uniquement des User Connecté ----------------------- //
			socket.on('disconnect', function(){
				
			});
			
    });
};

/***********************************************************************************
*												Différentes possibilité d'émissions											   *
***********************************************************************************/
/*
// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');
*/