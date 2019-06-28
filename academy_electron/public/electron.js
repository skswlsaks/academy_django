const electron = require('electron');
const robot = require('robotjs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

var vkey = require('vkey');

const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || 'file://' + path.join(__dirname, '../build/index.html');
    mainWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true }, width: 700, height: 680 });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', () => mainWindow = null);

    let testWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true }, width: 700, height: 680 });
    testWindow.loadURL(startUrl);
    testWindow.on('closed', () => testWindow = null);
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

ipcMain.on('get-screen-size', (event, args) => {
    var screenSize = robot.getScreenSize();
    event.sender.send('reply-screen-size', screenSize.width, screenSize.height);
});

ipcMain.on('mouse-click', (event, x, y) => {
    robot.moveMouse(x, y);
    robot.mouseClick();
});

ipcMain.on('mouse-move', (event, x, y) => {
    console.log("mouse moved: " + x + "," + y);
    robot.moveMouseSmooth(x, y);
});

ipcMain.on('key-press', (event, keyCode, modifiers) => {
    var k = vkey[keyCode].toLowerCase();
    if (k === '<space>') k = ' ';

    if (k[0] !== '<') {
        console.log('typed ' + k + ' ' + JSON.stringify(modifiers))
        if (modifiers.length > 0 && modifiers[0]) robot.keyTap(k, modifiers[0])
        else robot.keyTap(k)
    } else {
        if (k === '<enter>') robot.keyTap('enter')
        else if (k === '<backspace>') robot.keyTap('backspace')
        else if (k === '<up>') robot.keyTap('up')
        else if (k === '<down>') robot.keyTap('down')
        else if (k === '<left>') robot.keyTap('left')
        else if (k === '<right>') robot.keyTap('right')
        else if (k === '<delete>') robot.keyTap('delete')
        else if (k === '<home>') robot.keyTap('home')
        else if (k === '<end>') robot.keyTap('end')
        else if (k === '<page-up>') robot.keyTap('pageup')
        else if (k === '<page-down>') robot.keyTap('pagedown')
        
        else if (k === '<control>') robot.keyTap('control')
        else if (k === '<meta>') robot.keyTap('command')
        else if (k === '<alt>') robot.keyTap('alt')
        else if (k === '<shift>') robot.keyTap('shift')

        else if (k === '<escape>') console.log('escape pressed')
        else console.log('did not type ' + k)
    }
});

ipcMain.on('mouse-click-test', (event, args) => {
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