const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Path to your server file (adjust as necessary)
const serverPath = path.join(__dirname, 'server.js');

let mainWindow;
let serverProcess = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: true,
    autoHideMenuBar: true, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Start the backend server
  serverProcess = spawn('node', [serverPath]);

  // Load the app from localhost during development
  mainWindow.loadURL('http://localhost:3000/viewer');

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess !== null) {
      serverProcess.kill();
      serverProcess = null;
    }
  });
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
