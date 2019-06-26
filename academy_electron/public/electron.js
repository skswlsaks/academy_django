const electron = require('electron');
const robot = require('robotjs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || 'file://' + path.join(__dirname, '../build/index.html');
    mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true }, width: 900, height: 680 });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('mouse-click', (e, ratioX, ratioY) => {
    var screenSize = robot.getScreenSize();
    console.log(ratioX + "," + ratioY);
    var x = Math.round(parseFloat(ratioX) * screenSize.width);
    var y = Math.round(parseFloat(ratioY) * screenSize.height);
    console.log(screenSize.width + "/" + x + "," + screenSize.height + "/" + y);
    robot.moveMouse(x, y);
    robot.mouseClick();
});

ipcMain.on('mouse-click-test', (e, args) => {
    robot.setMouseDelay(2);

    var twoPI = Math.PI * 2.0;
    var screenSize = robot.getScreenSize();
    var height = (screenSize.height / 2) - 10;
    var width = screenSize.width;

    for (var x = 0; x < width; x++) {
        var y = height * Math.sin((twoPI * x) / width) + height;
        robot.moveMouse(x, y);
    }
});