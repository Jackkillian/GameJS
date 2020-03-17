# Making a Game
1. [Install GameJS](https://jackkillian.github.com/docs/installation "Installation Guide")  
2. Make a folder (anywhere you want). You can call it anything without __spaces__. This will be your game folder.
3. Within that folder, make a file called __install.json__. This will hold all of the data for the installation of your game.
4. Write the following in __install.json__:  
```json
{
    "name":"<your game name>",
    "folderName":"<your game folder name>"
}
```
5. Within the folder, make a file called __config.json__ Write the following in it:  
(NOTE: if you are wondering why you need to include the same data, ```name``` and ```folderName```, this is for your game to be compatible with the upcoming version of GameJS, 1.0-beta2)  
```json
{
    "name":"<your game name>",
    "folderName":"<your game folder name>",
    "description":"<description of your game>",
    "version":"<version of your game>",
    "GameJSVersion":"<version of GameJS you made your game on (the latest is 1.0-beta1)>",
    "author":"<your name>",
    "copyright":"<copyright of your game>",
    "credits":"<credits for extra resources, such as the author of the graphics for your game>",
    "logo":"logo.png",
    "website":"<website for your game>",
    "resources":{},
    "overrideFiles":false,
    "files":{}
}
```
6. Make the file __index.html__ within the folder, and write the following in it:  
```html
<!DOCTYPE html>
<html>
	<head>
		<title><your game name></title>
	</head>
	<body>
		<script src="/myGameScript.js"></script>
	</body>
</html>
```
7. Make a file in the folder called __logo.png__. It can just be an image. It will be stretched to 250 by 125 px.
8. Make a folder called __myGameScript.js__ within the folder. Write the following in it:
```js
console.log("My Game Works!");
```
9. __Copy__ the folder into the __CLI-Utility__ folder in GameJS.
10. Launch the [CLI-Utiliy](https://jackkillian.github.io/GameJS/CLI-Utility).
11. Run the command ```install <your game folder name>```
12. [Run the app](https://jackkillian.github.io/GameJS/docs/installation) and you should see your game!
  
# Extra Notes
## 1. ```resources```
In __install.json__, you may have seen the key ```resources```. If your game uses extra resources, such as the JavaScript game engine Phaser 3, you can use some packaged with GameJS.
To do this, enter the following in-between the curly brackets ("{}"):  
```"/phaser.js":"Phaser"```  
The key (/phaser.js) assigns a link to the resource, and the value (Phaser) is the name of the resource.  
To reference Phaser in the HTML, you can do the following:  
```<script src="/phaser.js"></script>```
  
##### List of available resources:
Phaser 3 - ```Phaser```
