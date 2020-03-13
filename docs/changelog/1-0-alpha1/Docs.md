# GameJS Changelog
## Documentation
Added "getting-started.md" to /docs/docs/:
```
# Getting Started - GameJS
This guide will show you how to make a GameJS compatible game.
  
1. Download [this repository](https://github.com/Jackkillian/GameJS).
2. In the __Game__ folder, make a new folder called __\<name of your game\>__
3. In the folder you just created, make a file called __config.json__. This file will tell GameJS about your game.
4. Add the following text to __config.json__:
\```
  {
      "name":"<name of your game>",
      "author":"<your name>",
      ""files" signifies the files in your game.copyright":"<copyright for your game, if you make it on GitHub one will be generated for you.>",
      "credits":"<credits. If you use resources from other places, such as images made by someone else, credit them here.>",
      "files":{
          "/":"index.html" // if you want, you can include a favicon too
      }
  }
\```
5. You may have noticed the ```"files"``` key. This contains the files for your game. Make the following files in your folder:
__index.html__ - ```<p>Welcome to my game!</p><script src="myGameScript.js"></script>``` This is the webpage that shows when you open your game web server.  
__myGameScript.js__ - ```console.log("Hi!")```  This is the script that will be called when your open your webpage. It may contain code for your game.  
6. At the end of Game.JS in the __Code__ folder, add the following code:
\```runGame("<your game name>");\```
```
(backslashes (\) have been added for formatting)
