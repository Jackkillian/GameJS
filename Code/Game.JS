/*
GameJS - Game.JS
Version 1.0.0-alpha1
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const codeLib = require("./modules/codeLib");

function runGame (name) {
    codeLib.run("localhost", 3907, name);
}
