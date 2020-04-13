const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow () {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  console.log("Opening link");
  mainWindow.loadURL("http://localhost:3907/offline");

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
});

require("./Game.js").startAppServer();
