// const { time, assert } = require('console');

const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow} = electron;

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        },
    })
  
    win.loadFile('index.html')

    win.on('close', () => {
        app.quit();
    })
  }

app.whenReady().then(() => {
    createWindow()
})

