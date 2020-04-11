# Making a Game
1. [Install GameJS](https://jackkillian.github.com/docs/installation "Installation Guide")  
2. Make a folder (anywhere you want). You can call it anything. The files inside of this folder will be archived into a `.gjs` game.
3. Within the folder, make a file called __config.json__ Write the following in it:  
```json
{
	"name":"[name of your game]",
	"description":"[description of your game]",
	"logo":"logo.png",
	"version":"[version of your game]",
	"author":"[your name]",
	"copyright":"[copyright for your game]",
	"credits":"[credits for your game]",
	"website":"[website for your game]",
	"feedback":{
		"bugs":"[link to where people can report bugs]",
		"suggestions":"[link to where people can make suggestions]"
	},
	"resources":{
    },
	"overrideFiles":true,
	"files":{
		"/":"index.html"
	},

	"gamejs":{
		"version":"1",
		"build":"any",
		"os":"any"
	},

	"gjs":{
		"version":"1"
	}
}
```
4. Make a folder within the first folder, and call it __files__.
5. Within __files__, make a new file __index.html__ within the folder, and write the following in it:  
```html
<!DOCTYPE html>
<html>
	<head>
		<title>[your game name]</title>
	</head>
	<body>
		<script src="/myGameScript.js"></script>
	</body>
</html>
```
6. Make a file in the folder called __logo.png__. It can just be an image. It will be stretched to 250 by 125 px.
7. Within __files__, make a new file __myGameScript.js__. Write the following in it:
```js
console.log("My Game Works!");
```
8. Archive the files. If you are in Windows 10, select __config.json__ and __files__. Right-click and open `Send to > Compressed (zipped) folder`. Rename the compressed file `[your game name].gjs`.
9. Put the file into your __Games__ folder in GameJS.
10. Run [the app](https://jackkillian.github.io/GameJS/docs/installation) and you should see your game!

# Extra Notes
## 1. ```resources```
In __config.json__, you may have seen the key `resources`. If your game uses extra resources, such as the JavaScript game engine Phaser 3, you can use some packaged with GameJS.
To do this, enter the following in-between the curly brackets ("{}"):  
```"/phaser.js":"Phaser"```  
The key (/phaser.js) assigns a link to the resource, and the value (Phaser) is the name of the resource.  
To reference Phaser in the HTML, you can do the following:  
```<script src="/phaser.js"></script>```

##### List of available resources:
Phaser 3 - `Phaser`
