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

const GameJSVersion = "1.0.0-beta2";

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
    var installed = [];
    fs.readdirSync("../Games").forEach(function (file) {
        if (file.endsWith('.gjs')) {
            try {
                game = gjsHandler.readGame('../Games/' + file);
                var config = JSON.parse(game['config.json'].toString());
                var game = {
                    path:file,
                    name:config['name'],
                    description:config['description'],
                    logo:config['logo'],
                    folderName:config['name'].split(' ').join(''),
                    files:game
                }
                installed.push(game);
            } catch (err) {
                console.log('Error in reading game: ' + err);
            }
        }
    });
    return installed;
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

function startGameServer (host, port, gjs) {
    var game = gjsHandler.readGame('../Games/' + gjs);
    var config = JSON.parse(game['config.json'].toString());

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
            res.end(fs.readFileSync("./app-files/resources" + gameResources[config["resources"][req.url]]));
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

exports.startAppServer = function (host="localhost", dir="./app-files") { // dir allows the app to run the server with accesibiltiy to the files in the same folder as serverLib.js
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
        res.render("about", {GameJSVersion:GameJSVersion});
    });

    server.post("/launchGame", (req, res) => {
        startGameServer("localhost",
            ports[req.body["name"]],
            req.body['path']
        );
        res.end();
    });

    installedGames.forEach(function (game) {
        server.get(`/${game["folderName"]}/logo`, (req, res) => {
            try {
                var readGame = gjsHandler.readGame('../Games/' + game.path);
                var config = JSON.parse(readGame['config.json'].toString());
                res.send(readGame['files/' + config['logo']]);
            } catch (err) {
                console.log("Error in sending logo: " + err)
                res.end();
            }
        });

        server.get(`/${game["folderName"]}/info`, (req, res) => {
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
    });



    server.listen(3907, host, () => {
        console.log(`GameJS app server started at ${host}:3907`);
    }); // start the server
};
