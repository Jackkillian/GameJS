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

const errMessages = {
	0:"Could not read game's config file. Please report this to the game developer, or run 'geninstall <game folder name> <game name>' to automatically generate a install file.",
	1:"Could not read game index. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	2:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	3:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	4:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	5:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	6:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS",
	7:"Could not read/set property. Please report this to the GameJS developer at https://github.com/Jackkillian/GameJS"
};

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
				
				var progress = 0;
				var error = false;
				
				if (fs.existsSync(`./${game}`)) {
					try {
						// load game config
						console.log(`Getting game config...`);
						var config = readJSON(`./${game}/config.json`);
						progress = 1;
						
						// log info
						console.log(`Found ${config["name"]} in ${config["folderName"]}`);
						console.log(`Installing game...`);
						
						// read file for games
						console.log(`Getting game list...`);
						var games = readJSON(`../Code/games.json`);
						progress = 2;
						
						// add to logo and description to installation config object
						console.log(`Adding description and logo to config...`);
						
						var gameInstall = {};

						gameInstall["name"] = config["name"];
						progress = 4;
						gameInstall["folderName"] = config["folderName"];
						progress = 5;
						gameInstall["description"] = config["description"];
						progress = 6;
						gameInstall["logo"] = config["logo"];
						progress = 7;

						// add installation config to games object
						console.log(`Adding config to game list...`);
						games["installed"].push(gameInstall);
						progress = 8;
						
						// move game folder to /Games
						console.log(`Moving game folder...`);
						fs.renameSync(`./${game}`, `../Games/${game}`);
						progress = 9;
						
						// update game list
						console.log(`Updating game list...`);
						writeJSON(`../Code/games.json`, games);
						progress = 10;
						
						// log
						console.log(`Successfully installed ${game}.`);
					} catch (err) {
						error = err;
					} finally {
						if (error) {
							console.log("Error encountered:");
							console.log("Error: " + error);
							console.log(errMessages[progress]);
						}
					}
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
