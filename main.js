const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

if (require('electron-squirrel-startup'))
  app.quit();

function onReady() {
  win = new BrowserWindow({ width: 900, height: 6700 })
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'dist/jsonetto/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.on('ready', onReady);
