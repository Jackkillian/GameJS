/*
GameJS - codeLib.js
Version 1.0.0-alpha1
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const serverLib = require("./serverLib.js");
const fs = require("fs");

exports.readJSON = function (filepath) {
    try {
        const jsonString = fs.readFileSync(filepath);
        return JSON.parse(jsonString);
    } catch(err) {
        console.log("Error encountered in reading JSON: " + err);
        return;
    };
};

function getGameConfig (name) {
    return exports.readJSON(`../Games/${name}/config.json`);
};

exports.run = function (host, port, name) {
    serverLib.startServer(host, port, name, getGameConfig(name));
};