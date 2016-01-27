/**
 * 
 * Core.js : 
**/

'use strict';
let NNM = NNM || {};

let socket = io();

// ES6 Static Legacy Import
import * as lib from 'lib.js';
import 'webixFileManager/FileManager.js';


// API Dynamic Loader
socket.on('ModulesToLoad', function (data) {
  let temp = JSON.parse(data);
  webix.ready(function(){
    temp.NameModules.forEach (function(module, index) {
      System.import(module);
      console.log('Chargement du module: ' + module);
    });
  });
});

console.log(lib.sqrt);
console.log(lib.pow(12));


