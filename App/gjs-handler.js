"use strict";

/*
GameJS - GJS-Handler
Version 1.0
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const admZip = require('adm-zip');

var gjsHandlerVersion = '1'

function inObj(key, obj) {
    for (let item of Object.keys(obj)) {
        if (item == key) {
            return true;
        }
    }
}

function readGame (path) {
    var zip = new admZip(path)
    var files = {};
    var data = zip.getEntries();
    data.forEach(function (file) {
        path = file.entryName
        files[path] = file.getData();
    });
    return files
}
exports.readGame = readGame;
