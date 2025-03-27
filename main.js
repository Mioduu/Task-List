const { app, BrowserWindow, Notification, ipcMain } = require("electron")

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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

ipcMain.on("Deadline Reached", (event, taskName) => {
    new Notification({
        title: "Przypomnienie",
        body: `Upłynął czas na zadanie ${taskName}`
    }).show();
})
