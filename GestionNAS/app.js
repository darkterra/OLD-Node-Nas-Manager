var express = require('express');
var resumable = require('./resumable-node.js')('temp/');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var multipart = require('connect-multiparty');
var shelljs = require('shelljs');
var os = require('os');

// Host most stuff in the public folder
app.use(express.static(__dirname + '/public'));

app.use(multipart());

//console.log(os.cpus());

function maj() {
	shelljs.exec("df -h /media/USBHDD1 | cut -d'/' -f 3 |  cut -d% -f 1 | tail -c3", {silent:true},
	function(code, data) {
		io.emit('majInfoDisqueUsed', data);
	});

	shelljs.exec("/opt/vc/bin/vcgencmd measure_temp | cut -d'=' -f 2 | cut -c 1,2,3,4", {silent:true},
	function(code, data) {
		io.emit('majTemperature', data);
	});

	shelljs.exec("cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq", {silent:true},
	function(code, data) {
		io.emit('majInfoFreqProc', data);
	});

	shelljs.exec("ls /media/USBHDD1/NAS01/MultiMedia/Films/ | wc -l", {silent:true},
	function(code, data) {
		io.emit('majInfoNbrFilm', data);
	});

	shelljs.exec("ls /media/USBHDD1/NAS01/MultiMedia/Séries/ | wc -l", {silent:true},
	function(code, data) {
		io.emit('majInfoNbrSerie', data);
	});

	shelljs.exec("ls -R /media/USBHDD1/NAS01/MultiMedia/Musiques/ | grep '.mp3' | wc -l", {silent:true},
	function(code, data) {
		io.emit('majInfoNbrMusique', data);
	});

/*	shelljs.exec("ls /media/USBHDD1/NAS01/MultiMedia/Images/ | wc -l", {silent:true},
	function(code, data) {
		io.emit('majInfoNbrImage', data);
	});
*/
}

// Handle uploads through Resumable.js
app.post('/upload', function(req, res){

	//console.log(req);

    resumable.post(req, function(status, filename, original_filename, identifier, nomFinal){
//        console.log('POST', status, original_filename, identifier);

	if (status == 'done')
	{
		var racine = "/home/pi/www/";
		var path = racine + "finish/";
		var nomFinal = req.param('nom_Final');
		var directoryName = path + '' + req.param('film_Or_Serie') + '/' + nomFinal + '(' +  req.param('anne_Film') + ')';
		var destFileFinal = directoryName + '/';
		var resumableFilename = req.param('resumableFilename');

		var fs = require('fs');

		nomFinal = nomFinal + '.' + resumableFilename.substr((resumableFilename.lastIndexOf('.') +1));

		fs.exists(destFileFinal, function (exists) {
                        if (! exists)
                        {
                        	shelljs.mkdir('-p', destFileFinal);
                        }

			destFileFinal = destFileFinal + '' + nomFinal;

//			console.log(destFileFinal);
//			console.log(nomFinal);

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
//        console.log('GET', status);
        res.send((status == 'found' ? 200 : 404), status);
      });
  });

app.get('/download/:identifier', function(req, res){
	resumable.write(req.params.identifier, res);
});

app.get('/resumable.js', function (req, res) {
  var fs = require('fs');
  res.setHeader("content-type", "application/javascript");
  fs.createReadStream("public/resumable.js").pipe(res);
});

app.get('/socket.io.js', function (req, res) {
  var fs = require('fs');
  res.setHeader("content-type", "application/javascript");
  fs.createReadStream("node_modules/socket.io/node_modules/socket.io-client/socket.io.js").pipe(res);
});

app.get('/Chart.js', function (req, res) {
  var fs = require('fs');
  res.setHeader("content-type", "application/javascript");
  fs.createReadStream("public/Chart.min.js").pipe(res);
});

// Quand on client se connecte, on le note dans la console
io.on('connection', function(socket){
	console.log('Un client est connecté !');
});

setInterval(maj, 1000);

server.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
  console.log('');
});