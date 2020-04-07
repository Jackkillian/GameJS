"use strict";

/*
GameJS - Game.JS
Version 1.0-beta2
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const {exec} = require("child_process");
const express = require("express");
const gjsHandler = require('./gjs-handler.js');
const ejs = require("ejs");
const fs = require("fs");

const GameJSVersion = {
    "version":"1.0-beta2",
    "build":"pre",
    "os":"any"
};

let gameResources = {
        "Phaser":"/phaser.min.js",
        "Sprite16-Guy":"/guy16.png"
};

function readJSON (filepath) {
    try {
        const jsonString = fs.readFileSync(filepath);
        return JSON.parse(jsonString);
    } catch(err) {
        console.log("Error encountered in reading JSON: " + err);
        return;
    };
}

function getGameConfig (name) {
    return readJSON(`../Games/${name}/config.json`);
};

function getInstalledGames () {
    var installed = readJSON("../Code/games.json")["installed"];
    installed.forEach(function (game) {
        installed[installed.indexOf(game)].type = 'folder';
    });
    var gjs = [];
    fs.readdirSync("../Games").forEach(function (file) {
        if (file.endsWith('.gjs')) {
            game = gjsHandler.readGame('../Games/' + file);
            var config = JSON.parse(game['config.json'].toString())
            var game = {
                type:"gjs",
                path:file,
                name:config['name'],
                description:config['description'],
                logo:config['logo'],
                folderName:config['name'].split(' ').join('')+'GJS',
                files:game
            }
            gjs.push(game)
        }
    });
    return installed.concat(gjs);
}

var installedGames = getInstalledGames();

function genPorts () {
    var ports = {};
    var lastPort = 3907;
    installedGames.forEach((item) => {
        lastPort += 1;
        ports[item["folderName"]] = lastPort;
    });
    return ports;
}

function startGameServer (host, port, name, data, gameDir, appFilesDir) {
    console.log(`Starting server for ${name}`);

    let files = data["files"];

    let server = express();

    server.use(express.json());
    server.use(express.urlencoded({extended:true}));

    server.use((req, res, next) => {
      if (data["overrideFiles"] && req.url in files) {
            try {
                res.end(fs.readFileSync(gameDir + files[file]));
            } catch (err) {
                console.log(`\nError encountered in sending file:\n${err}\n`);
                res.end(`\nError encountered:\n${err}\n${errorHelpStr}.<br>Please report this to the game developer.`);
            }
        } else if (req.url == "/") {
            res.end(fs.readFileSync(gameDir + "/index.html"));
        } else if (req.url in data["resources"] && data["resources"][req.url] in gameResources) {
            res.end(fs.readFileSync(appFilesDir + "/resources" + gameResources[data["resources"][req.url]]));
        } else {
            res.end(fs.readFileSync(gameDir + req.url));
        }

        next();
    });

    server.listen(port, host, () => {
        console.log(`Started server for ${name} at ${host}:${port}`);
    }); // start the server
};

function startGJSGameServer (host, port, gjs) {
    var game = gjsHandler.readGame('../Games/' + gjs);
    var config = JSON.parse(game['config.json'].toString());
    console.log(`Starting GJS game server for ${config.name} (GJS)`);

    let files = config["files"];

    let server = express();

    server.use(express.json());
    server.use(express.urlencoded({extended:true}));

    server.use((req, res, next) => {
        // handle all incoming data
        if (config["overrideFiles"] && req.url in files) {
            try {
                // try to send overrided file
                res.end(game['files/' + config.files[req.url]]);
            } catch (err) {
                // if file doesn't exist, send and log an error
                console.log(`\nError encountered in sending file:\n${err}\n`);
                res.end(`\nError encountered:\n${err}\n${errorHelpStr}. Please report this to the game developer.`);
            }
        } else if (req.url in config["resources"] && config["resources"][req.url] in gameResources) {
            // requested URL is a resource that the game needs
            res.end(fs.readFileSync("../Code/app-files/resources" + gameResources[config["resources"][req.url]]));
        } else if (req.url == "/") {
            // resort to index.html file, even if it doesn't exist
            res.end(game['files/index.html'].toString());
        } else {
            // if file isn't a resource or overrided, send file from /files
            res.end(game['files' + req.url]);
        }

        // continue to the rest of the server code
        next();
    });

    server.listen(port, host, () => {
        console.log(`Started server for ${config.name} at ${host}:${port}`);
    }); // start the server
};

exports.startAppServer = function (host="localhost", dir="../Code/app-files") { // dir allows the app to run the server with accesibiltiy to the files in the same folder as serverLib.js
    let ports = genPorts();
    let server = express();

    server.set("view engine", "ejs");
    server.set("views", dir);

    server.use(express.json());
    server.use(express.urlencoded({extended:true}));
    server.use(express.static(dir));

    server.get("/online", (req, res) => {
        res.render("online");
    });

    server.get("/offline", (req, res) => {
        res.render("offline", {
            installedGames:installedGames,
      		ports:ports,
			host:host
        });
    });

    server.get("/about", (req, res) => {
        res.render("about", {GameJSVersion:GameJSVersion["version"]});
    });

    server.post("/launchGame", (req, res) => {
        if (req.body.type == 'gjs') {
            startGJSGameServer("localhost",
                    ports[req.body["name"]],
                    req.body['path']
                );
        } else {
            startGameServer("localhost",
                    ports[req.body["name"]],
                    req.body["name"],
                    getGameConfig(req.body["name"]),
                    `../Games/${req.body["name"]}`,
                    "../Code/app-files");
        }
        res.end();
    });

    installedGames.forEach(function (game) {
        if (game.type == 'folder') {
            server.get(`/${game["folderName"]}/logo`, (req, res) => {
                try {
                    res.send(fs.readFileSync("../Games/" + game["folderName"] + "/" + game["logo"]));
                } catch (err) {
                    console.log("Error in sending logo: " + err)
                    res.end();
                }
            });

            server.get(`/${game["folderName"]}/info`, (req, res) => {
                let info = getGameConfig(game["folderName"]);
                res.render("info", {
                    type:'folder',
                    pathName:game["folderName"],
                    name:info["name"],
                    description:info["description"],
                    version:info["version"],
                    madeFor:info["GameJSVersion"],
                    author:info["author"],
                    copyright:info["copyright"],
                    credits:info["credits"],
                    website:info["website"]
                });
            });
        } else {
            server.get(`/GJS/${game["folderName"]}/logo`, (req, res) => {
                try {
                    var readGame = gjsHandler.readGame('../Games/' + game.path);
                    var config = JSON.parse(readGame['config.json'].toString());
                    res.send(readGame['files/' + config['logo']]);
                } catch (err) {
                    console.log("Error in sending logo: " + err)
                    res.end();
                }
            });

            server.get(`/GJS/${game["folderName"]}/info`, (req, res) => {
                let info = JSON.parse(gjsHandler.readGame('../Games/' + game.path)['config.json'].toString());
                res.render("info", {
                    type:'GJS',
                    pathName:game["folderName"],
                    name:info["name"],
                    description:info["description"],
                    version:info["version"],
                    madeFor:info["gamejs"]['version'],
                    author:info["author"],
                    copyright:info["copyright"],
                    credits:info["credits"],
                    website:info["website"]
                });
            });
        }

    });



    server.listen(3907, host, () => {
        console.log(`GameJS app server started at ${host}:3907`);
    }); // start the server
};
