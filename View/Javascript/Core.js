/**
 * 
 * Core.js : 
**/

'use strict';

let NNM = NNM || {};

NNM.socket = io('http://localhost:3001');


// ES6 Static Legacy Import
import * as lib from 'lib.js';
import FileManager from 'webixFileManager/FileManager.js';


// API Dynamic Loader
NNM.socket.on('ModulesToLoad', function (data) {
  let temp = JSON.parse(data);
  webix.ready(function(){
    temp.NameModules.forEach (function(module, index) {
      System.import(module);
      console.log('Chargement du module: ' + module);
    });
  });
});

NNM.socket.emit('ScanNAS');

NNM.socket.on('NASScaned', function(data) {
  // console.log('Scan Receved: ' + JSON.stringify(data));
  console.log('Done');
  $$("files").parse(data);
  // FileManager.filemanager.parse(data);
});


console.log(lib.sqrt);
console.log(lib.pow(12));