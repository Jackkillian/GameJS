/*
GameJS - Game.JS
Version 1.0-beta1
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const serverLib = require("./modules/serverLib.js");
const fs = require("fs");


function genPort () {
    return 3908;
}

function readJSON (filepath) {
    try {
        const jsonString = fs.readFileSync(filepath);
        return JSON.parse(jsonString);
    } catch(err) {
        console.log("Error encountered in reading JSON: " + err);
        return;
    };
};

function getGameConfig (name) {
    return readJSON(`../Games/${name}/config.json`);
};

function getInstalledGames () {
    return readJSON("./games.json")["installed"];
};


function runGame (name) {
    var host = 'localhost';
    var port = genPort();
    var gameConfig = getGameConfig(name);
    serverLib.startServer(host, port, name, gameConfig);
}