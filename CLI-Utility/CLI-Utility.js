/*
GameJS - Installation Utility.js
Version: 1.0
License: MIT
Made by Jack Freund (Jackkillian on GitHub)
*/

var readlineSync = require("readline-sync");
var fs = require("fs");

const about = `
GameJS CLI Utility
Version 1.0
Licensed under MIT
Made by Jack Freund (Jackkillian on GitHub)
For documentation, visit
https://jackkillian.github.io/GameJS/CLI-Utility
`;

function readJSON (filepath) {
    try {
        const jsonString = fs.readFileSync(filepath);
        return JSON.parse(jsonString);
    } catch (err) {
        console.log("Error encountered in reading JSON: " + err);
        return;
    };
}

function writeJSON (filepath, obj) {
    try {
        fs.writeFileSync(filepath, JSON.stringify(obj, null, 2));
    } catch (err) {
        console.log("Error encountered in writing JSON: " + err);
    };
}

function startCLI () {
		console.log("Welcome to the GameJS CLI Utility.");
		console.log("Type help for a list of commands, or type exit to quit.");
		readlineSync.promptCLLoop({
		
			help:function () {
					console.log("Commands:");
					console.log("help                    -  show help");
					console.log("exit                    -  quit installation utiliy");
					console.log("install <game name>     -  install <game name>");
					console.log("uninstall <game name>   -  uninstall <game name>");
					console.log("list                    -  list installed games");
					console.log("info <game name>        -  get information about <game name>");
					console.log("about                   -  information about the GameJS CLI Utility");
					console.log("Documentation:");
					console.log("https://jackkillian.github.io/GameJS/CLI-Utility");
			},
		
			install:function (game) {
				console.log(`Searching for game "${game}..."`);
				if (fs.existsSync(`./${game}`)) {
						// load installation config
						var config = readJSON(`./${game}/install.json`);

						// log info
						console.log(`Found ${config["name"]} in ${config["folderName"]}`);
						console.log(`Installing game...`);

						// read file for games
						console.log(`Getting game list...`);
						var games = readJSON(`../Code/games.json`);

						// add to logo and description to installation config object
						console.log(`Adding description and logo to config...`);
						config["description"] = readJSON(`./${game}/config.json`)["description"];
						config["logo"] = readJSON(`./${game}/config.json`)["logo"];

						// add installation config to games object
						console.log(`Adding config to game list...`);
						games["installed"].push(config);

						// delete installation file
						console.log(`Deleting installation files...`);
						fs.unlinkSync(`./${game}/install.json`);

						// move game folder to /Games
						console.log(`Moving game folder...`);
						fs.renameSync(`./${game}`, `../Games/${game}`);

						// update game list
						console.log(`Updating game list...`);
						writeJSON(`../Code/games.json`, games);

						// log
						console.log(`Successfully installed ${game}.`);
				} else {
						console.log(`Error: game directory "${game}" not found.`);
						console.log("Please make sure the folder is in the CLI-Utility folder.");
				}
			},
			
			uninstall:function (game) {
				console.log(`Checking if ${game} is installed...`);
				if (fs.existsSync(`../Games/${game}`)) {
					if (readlineSync.keyInYN(`Are you sure you want to uninstall ${game}?`)) {
						// delete game folder
						console.log(`Deleting game folder...`);
						fs.rmdirSync(`../Games/${game}`, {recursive:true});

						// read file for games
						console.log(`Getting game list...`);
						var games = readJSON(`../Code/games.json`);

						// remove game from list
						console.log("Removing from game list...");
						games["installed"].forEach((gameObj) => {
							if (gameObj["folderName"] == game) {
								const index = games["installed"].indexOf(gameObj);
								if (index > -1) {	
  									games["installed"].splice(index, 1);
								}
							}
						});
						
						// update game list
						console.log(`Updating game list...`);
						writeJSON(`../Code/games.json`, games);
						
						// log
						console.log(`Successfully uninstalled ${game}.`);
					}
				} else {
					console.log(`Could not find ${game}. Make sure you have spelled it correctly, or type list to see installed games.`);
				}
			},

			list:function () {
				// read file for games
				var games = readJSON(`../Code/games.json`);

				// log each game
				games["installed"].forEach((game) => {
					console.log(`\n${game["name"]}`);
				});
				console.log(`\n`);
			},

			info:function (game) {
				// read file for games
				var games = readJSON(`../Code/games.json`);

				// log info for game
				games["installed"].forEach((gameObj) => {
					if (gameObj["folderName"] == game) {
						console.log(`Info for ${game}:`);
						console.log(`Name: ${gameObj["name"]}`);
						console.log(`Folder Name: ${gameObj["folderName"]}`);
						console.log(`Description: ${gameObj["description"]}`);
						console.log(`Logo file: ${gameObj["logo"]}`);
					}
				});
			},

			about:function () {
				console.log(about);
			},
			
			exit:function () { return true; }
			
		});
		console.log('Quiting...');
}

startCLI();