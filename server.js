/*
 * Version 0.0.0
 * Date de Création 16/04/2015
 * Date de modification 16/04/2015
 *
 * server.js
 *  Point d'entrée de l'application (Main) 'Node-Nas-Management' qui permet de gérer un serveur NAS
 * 
 * Conçu par l'équipe de Node-Nas-Management :
 *  - Jérémy Young
 */

// NNM Daemonized
//require('daemon')();

// Profileur & Moniteur de performance
/*require('nodetime').profile({
  accountKey: '64e613ca9dd12e185731419090cb4075a999ccad', 
  appName: 'Node-Nas-Management'
});*/

var messages    = [];
var sockets     = [];

// Requires de bases
var express         = require('express');
var app             = express();
var http            = require('http').Server(app);
var path            = require('path');
var favicon         = require('serve-favicon');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var os              = require('os');
var colors          = require('colors');
var socketio        = require('socket.io');
var resumable       = require('./resumable-node.js')('tmp/');

// Require des controllers
/*var compte          = require('./controllers/compte');
var accueil         = require('./controllers/accueil');
var oublie          = require('./controllers/oublie');
var parametres      = require('./controllers/parametres');
var infosJoueur     = require('./controllers/infosJoueur');
var administration  = require('./controllers/administration');
var support         = require('./controllers/support');
var legion          = require('./controllers/legion');
var classement      = require('./controllers/classement');
var faq             = require('./controllers/faq');
var apropos         = require('./controllers/apropos');*/

// Configuration du port
var port = process.env.PORT || 3000;

// Configuration des sessions
var EXPRESS_SID_VALUE = 'secret keyboard cat';
var sessionMiddleware = session({
    secret              : EXPRESS_SID_VALUE,
    resave              : false,
    saveUninitialized   : true,
});

// Configuration de l'application
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);

// Socket io
//require('./controllers/sockets').listen(http, sessionMiddleware, colors);
var io  = socketio.listen(http);

// Template
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Routing
/*app.use(express.static(path.join(__dirname, 'public')));
app.use('/compte', compte);
app.use('/', accueil);
app.use('/oublie', oublie);
app.use('/parametres', parametres);
app.use('/infosJoueur', infosJoueur.router);
app.use('/administration', administration);
app.use('/support', support);
app.use('/legion', legion);
app.use('/classement', classement);
app.use('/faq', faq);
app.use('/apropos', apropos);*/

// Configuration de la coloration des logs
colors.setTheme({
  silly     : 'rainbow',
  input     : 'grey',
  verbose   : 'cyan',
  prompt    : 'grey',
  info      : 'green',
  data      : 'grey',
  help      : 'cyan',
  warn      : 'yellow',
  debug     : 'blue',
  error     : 'red'
});

/*------------------------------------------------------------------------------------------------------------------------------*/
// Handle uploads through Resumable.js
app.post('/upload', function(req, res){
  //console.log(req);
  
  resumable.post(req, function(status, filename, original_filename, identifier, nomFinal){
    //console.log('POST', status, original_filename, identifier);
    
    if (status == 'done') {
      var racine            = "/home/pi/www/";
      var path              = racine + "finish/";
      var nomFinal          = req.param('nom_Final');
      var directoryName     = path + '' + req.param('film_Or_Serie') + '/' + nomFinal + '(' +  req.param('anne_Film') + ')';
      var destFileFinal     = directoryName + '/';
      var resumableFilename = req.param('resumableFilename');
      
      var fs = require('fs');
      
      nomFinal = nomFinal + '.' + resumableFilename.substr((resumableFilename.lastIndexOf('.') +1));
      
      fs.exists(destFileFinal, function (exists) {
        if (! exists) {
          shelljs.mkdir('-p', destFileFinal);
        }
        destFileFinal = destFileFinal + '' + nomFinal;
        
        var ws = fs.createWriteStream(destFileFinal);
        
        resumable.write(identifier, ws);
        ws.on('finish', function() {
          console.log('Fichier : ' + nomFinal + ' Enregistré...');
          shelljs.rm('-rf', 'temp/*' + identifier + '*');
        });
      });
    }
    
    res.send(status, {
      // NOTE: Uncomment this funciton to enable cross-domain request.
      //'Access-Control-Allow-Origin': '*'
    });
  });
});

// Handle status checks on chunks through Resumable.js
app.get('/upload', function(req, res){
  resumable.get(req, function(status, filename, original_filename, identifier){
    //console.log('GET', status);
    res.send((status == 'found' ? 200 : 404), status);
  });
});

app.get('/download/:identifier', function(req, res){
  resumable.write(req.params.identifier, res);
});

/*------------------------------------------------------------------------------------------------------------------------------*/



// Création du serveur
http.listen(port, function () {
  console.log('\nNodeAion listening at 127.0.0.1:'.verbose + port.verbose);
  console.log('La version du serveur Node.JS : '.data + process.version.warn);
  console.log('Le serveur Node.JS fonctionne sur la plateforme : '.data + process.platform.warn);
  //console.log('La plateforme fonctionne depuis : '.data + tools.convertTimeToHuman(os.uptime()).warn);
  console.log('Profileur du projet : https://nodetime.com/app/b3bf13f35870de/transactions\n'.info);
});





/*io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
      });
    });
  });

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});*/