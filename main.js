import { app, BrowserWindow } from 'electron';

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
