const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700
  });

  win.loadURL('http://localhost:5173'); // Vite dev server
}

app.whenReady().then(createWindow);