/*
 * Version 0.1.1
 * Date de modification 31/01/2015
 *
 * Socket.js
 *  Gère toute les communications dynamique
 * 
 * Conçu par l'équipe de NodeAion :
 *  - Alexandrine Gasc
 *  - Jérémy Young
 */

'use strict';


let socketio			= require('socket.io');
// let infos					= require('./infosJoueur');
// let connection		= require('../sql/requestPlayer');
let escape_html		= require('escape-html');

module.exports.listen = function(server, sessionMiddleware, ServerEvent, colors) {
    let io						= socketio.listen(server);
    let messages			= [];
    let text					= '';
    let data					= '';
    let numUser				= 0;
    
    // Configuration de Socket.IO pour pouvoir avoir accès au sessions
		io.use(function(socket, next) {
			sessionMiddleware(socket.request, socket.request.res, next);
		});
		
		/***********************************************************************************
		*														Initialisation des variables												   *
		***********************************************************************************/
		
    // Message d'initialisation
    var init = {
			name: 'Admin NodeAion',
			text: 'Raconte nous ton aventure...'
		};
		
		// Stockage du message d'initialisation
		messages.push(init);
    
    // Ajout d'un utilisateur au compteur
  //   ctrlUser.on('numUser++', function(){
		// 	++numUser;
		// 	sendMajTitre('numUser++');
  //   });
    
  //   // Suppression d'un utilisateur au compeur
  //   ctrlUser.on('numUser--', function(){
  //   	if (numUser > 0) {
		// 		--numUser;
		// 		sendMajTitre('numUser--');
		// 	}
		// 	else {
		// 		console.log('Nombre d\'utilisateur en négatif !!'.error);
		// 	}
		// });
    
    // Fonction de MAJ du titre
    function sendMajTitre(msg) {
			data = {
				numUser			: numUser,
				numMessages	: messages.length
			};
			io.sockets.emit('majTitre', data);
    }
    
		// // gestion du graph
		// var tabGraph = [];
		
		// tabGraph.push({date: getFormatDate(new Date(new Date().getTime() - 1 * 60000)),
		// 	count: 0});
			
		// setInterval(function () {
		// 	getNbPlayers(io, tabGraph);
		// }, 1000 * 60); // toutes les minutes
		
		function ReloadModule(socket) {
			ServerEvent.emit('ReloadModule');
			socket.emit('ModulesToLoad', test);
		}
		
    ServerEvent.emit('ReloadModule');
    
    var test = '';
    
    ServerEvent.on('DataRead', function(data) {
    	test = data;
    });
    
    // Ouverture de la socket
    io.sockets.on('connection', function (socket) {
    	
    	//socket.emit('ModulesToLoad', test);
    	ReloadModule(socket);
    	
    	// socket.on('ReloadModule', ReloadModule(socket));
    	/***********************************************************************************
			*															Initialisation du Site														   *
			***********************************************************************************/
			/*socket.request.session.Site = 'toto';
			
			data = {
					Bench_Time		: socket.request.session
				};*/
				//socket.emit('initSite',  data);
				//console.log(socket.request.session);
				
			/***********************************************************************************
			*																	Gestion du Chat																   *
			***********************************************************************************/
			
			// ----------------------- Init du Chat ----------------------- //
			// if (socket.request.session.User !== undefined) {
				
			// 	// ctrlUser.emit('numUser++');
			// 	data = {
			// 		Name					: socket.request.session.User.name,
			// 		Access_Level	: socket.request.session.User.access_level
			// 	};
			// 	socket.emit('initChat',  data);
			// }
			
			// ----------------------- Décompte uniquement des User Connecté ----------------------- //
			socket.on('disconnect', function(){
				// if (socket.request.session.User !== undefined) {
				// 	// ctrlUser.emit('numUser--');
				// }
			});
			
			// ----------------------- Send Histo ---------------------- //
			messages.forEach(function (data) {
				socket.emit('histo message', data);
			});
			
			data = {
				numUser			: numUser,
				numMessages	: messages.length
			};
			
			// Envoi de l'entête du Chat (ce qui cinifie que l'envoi de l'historique est terminé)
			socket.emit('histo message finish', data);
			
			// ----------------------- Add User After RAZ ----------------------- //
			socket.on('I am a real user, not a bot', function(data) {
				// ctrlUser.emit('numUser++');
			});
			
			// ----------------------- Send Chat Message ----------------------- //
			socket.on('chat message', function(msg) {
				if (msg) {
					// Suppression des Injextions
					text = escape_html(msg);
				}
				
				if (text && (socket.request.session.User !== undefined)){
					
					data = {
							name	: socket.request.session.User.name,
							text	: text
						};
					messages.push(data);
					
					data = {
							name				: socket.request.session.User.name,
							text				: text,
							numUser			: numUser,
							numMessages	: messages.length
						};
					io.sockets.emit('chat message', data);
				}
			});
			
			// ----------------------- RAZ Chat ----------------------- //
			socket.on('RAZ Chat', function() {
				if (socket.request.session.User !== undefined) {
					if (socket.request.session.User.access_level >= 10) {
						messages	= [];
						text			= '';
						data			= '';
						numUser		= 0;
						console.log('RAZ Chat'.error);
						
						// Message d'initialisation
						messages.push(init);
						
						data = {
							name				: init.name,
							text				: init.text,
							numUser			: numUser,
							numMessages	: messages.length
						};
						io.sockets.emit('chat message RAZ', data);
					}
				}
			});
			
			/***********************************************************************************
			*																Gestion des MAJ Data														   *
			***********************************************************************************/
			
			// Récupération des objets du personnage identifié par idPlayer
		// 	socket.on('list', function(idPlayer) {
		// 		infos.player(idPlayer, function (player) {
		// 			infos.stuff(idPlayer, function(listStuff) {
		// 				infos.items(idPlayer, function(listItems) {
		// 					socket.emit('list', player, listStuff, listItems);
		// 				});
		// 			});
		// 		});
		// 	});
			
			/***********************************************************************************
			*																Gestion des connexions joueurs										 *
			***********************************************************************************/
			// Récupération des connexions de joueurs
			
				
		// 	getNbPlayers(undefined, tabGraph, socket);
		// Blablabla
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

//fonction qui récupère le nombre de joueurs connectés à l'instant T
// function getNbPlayers(io, tabGraph, socket) {
// 	connection.countPlayersOnline(function(listPlayersOnline) {
// 		var today = new Date();
// 		today = getFormatDate(today);
		
// 		// 10 pour avoir les 10 dernières minutes, à changer selon l'intervalle de temps
// 		if (tabGraph.length == 10) {
// 			tabGraph.shift();
// 		}
		
// 		tabGraph.push({date: today,
// 			count: listPlayersOnline.nbPlayers});
			
// 		if (socket) {
// 			socket.emit('connexion', tabGraph);
// 		}
// 		else if(io) {
// 			io.sockets.emit('connexion', tabGraph);
// 		}
// 	}, function() {
// 		//TODO gérer l'erreur (page d'erreur)
// 		console.log('Erreur de récupération des joueurs connectés');
// 	});
// }

//fonction qui retourne la date en paramètre sous le format dd/mm/yyyy hh:min
function getFormatDate(date) {
	var dd = date.getDate();
	var mm = date.getMonth()+1;
	var yyyy = date.getFullYear();
	var hh = date.getHours();
	var min = date.getMinutes();

	if (dd < 10) {
	    dd = '0' + dd;
	} 

	if (mm < 10) {
	    mm = '0' + mm;
	} 

	if (hh < 10) {
		hh = '0' + hh;
	}
	
	if (min < 10) {
		min = '0' + min;
	}
	
	return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
}