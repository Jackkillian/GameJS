/*
GameJS - serverLib.js
Version 1.0-beta1
License: MIT
Copyright (c) 2020 Jack KA Freund
*/

const express = require("express");
const ejs = require("ejs");
const fs = require("fs");

const GameJSVersion = '1.0-beta2';

const errorHelpStr = `Please report this error to the game developer or at the GameJS GitHub Page \n (https://github.com/Jackkillian/GameJS/issues/new/choose)`;

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
    return installed;
}

function genPorts () {
    var ports = {};
    var lastPort = 3907;
    getInstalledGames().forEach((item) => {
        lastPort += 1;
        ports[item["folderName"]] = lastPort;
    });
    return ports;
}
    
exports.startServer = function (host, port, name, data, gameDir, appFilesDir) {
    console.log(`Starting server for ${name}`);
    let server = express();
    let files = data["files"];
    let gameResources = {
    		"Phaser":"/phaser.min.js",
    		"Sprite16-Guy":"/guy16.png"
    }
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

exports.startAppServer = function (host="localhost", dir="../Code/modules/app-files") { // dir allows the app to run the server with accesibiltiy to the files in the same folder as serverLib.js
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
            installedGames:getInstalledGames(),
      		ports:ports,
			host:host
        });
    });

    server.get("/about", (req, res) => {
        res.render("about", {GameJSVersion:GameJSVersion});
    });

    server.post("/launchGame", (req, res) => {
        exports.startServer("localhost", 
                ports[req.body["name"]],
                req.body["name"],
                getGameConfig(req.body["name"]),
                `../Games/${req.body["name"]}`,
                "../Code/modules/app-files");
        res.end();
    });
    
    getInstalledGames().forEach(function (game) {
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
    });



    server.listen(3907, host, () => {
        console.log(`GameJS app server started at ${host}:3907`);
    }); // start the server
};

